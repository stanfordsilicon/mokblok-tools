# MongoDB worksheet storage proposal

Status: implemented. See [operation and migration notes](worksheet-storage.md)
for the completed migration and verified source cleanup. This
document records the original design; the operational notes describe final
behavior, including the operator bootstrap option and optional notes columns.

Store uploaded worksheet source text in `homescreen_review_worksheets` in the
existing database selected by `siliconDbName()`. Administrators publish shared
baselines; reviewers continue saving their individual edits separately in
`homescreen_review_edits`.

## Scope and existing integration points

- Move the language worksheets in `public/input_tsvs/`, including worksheet 3/4
  `.txt` companions. Keep `dataentries.tsv`, `languageNames.tsv`, and
  `numberingSystems.tsv` as application reference data for this change.
- Replace static file fetching in `src/data/worksheets/useImportedWorksheets.ts`
  with a backend read. Preserve the existing worksheet state and parser outputs.
- Use `getMongoClient()` and `siliconDbName()` from `src/mongodb.ts`.
- Use `requireRole('admin')` from `src/settings/auth/roles.ts` on every upload
  and administrative read. This checks the current database role. The URL's
  `admin` flag and session role are only UI hints.

## Storage model

One current document per language and worksheet, with a unique compound index
on `{ targetLanguage: 1, worksheetKey: 1 }`, created during setup/migration.

```ts
type StoredWorksheet = {
  targetLanguage: string; // canonical app language code, e.g. "mg"
  worksheetKey: '1' | '2_1' | '2_2' | '2_3' | '3' | '4';
  format: 'tsv' | 'txt'; // derived from worksheetKey on the server
  content: string; // original UTF-8 text; preserve tabs, quotes and newlines
  originalFilename: string | null; // display metadata, never a filesystem path
  sha256: string; // server-computed hash of the UTF-8 content
  byteLength: number;
  parsedRowCount: number; // zero for text worksheets
  validationVersion: number;
  revision: number; // starts at 1; increment on content replacement
  createdAt: Date;
  createdBy: string; // authenticated user ID
  updatedAt: Date;
  updatedBy: string;
};
```

Raw text remains authoritative so imports and downloads retain the source and
parser changes do not require reconstructing TSVs from database rows. Derive
parsed rows when needed rather than maintaining a second editable copy.

Use a proposed 1 MiB UTF-8 limit per worksheet (current files are below this).
Enforce the request limit before buffering/decoding; reject rather than truncate.
Store only the current version initially. `revision` detects conflicts; it is
not a version archive. Historical restore would require a later revision
collection or database backup restore, not an unbounded embedded history array.

## Admin experience

Add a worksheet management screen with language, worksheet, last upload time,
uploader, and revision. An administrator can select a file or paste copied TSV
text, choose the target language and worksheet, and preview validation results.
Infer selections from known filenames for convenience but show them explicitly.

Show parsed row count, translated row count, warnings, and whether publishing
creates or replaces a worksheet. A deliberate Publish action makes the source
available to subsequent review loads. Typing in the existing import textarea
must not silently publish a shared baseline.

Start with one worksheet per publish. Batch migration reports each file's result
and does not claim that a set of worksheets is published atomically. Multi-file
release semantics can be added if reviewers need coordinated language releases.

## API contract

| Endpoint | Access | Behavior |
| --- | --- | --- |
| `GET /api/worksheets` | Signed in | Available language/worksheet metadata, filtered to authorized languages; no source text or uploader identity. |
| `GET /api/worksheets/[language]` | Admin or assigned language | All current source texts and revisions for that language in one response. |
| `GET /api/admin/worksheets` | Admin | Management metadata including upload attribution. |
| `POST /api/admin/worksheets/validate` | Admin | Validate a candidate and return preview/diagnostics without persisting. |
| `PUT /api/admin/worksheets/[language]/[worksheetKey]` | Admin | Revalidate and publish one worksheet with an expected revision. |

Use bounded JSON `{ content, originalFilename, expectedRevision }` for publishing;
file selection and paste both become text in the browser. Validation uses the
same payload plus language/worksheet selection. Server code derives attribution,
timestamps, checksum, and format; it never accepts those as authoritative input.
Require same-origin writes or equivalent CSRF protection for session-cookie
requests. Render preview content as text.

For read authorization, reuse the live-role and assigned-language logic in
`app/api/review-drafts/[language]/route.ts`, preferably extracted into a shared
helper. Do not copy the temporary client fallback granting `mg`/`nd` when there
are no assignments. This recommendation makes worksheet reads authenticated;
today files under `public/` are directly accessible without authentication.

Return `401` for signed-out callers, `403` for insufficient privileges, `400`
for invalid requests, `413` for oversized content, `422` for invalid worksheet
content, and `409` for a stale revision. A language without worksheets returns
an empty worksheet map; a database failure is an error, never an empty success.
Use private, no-store responses initially.

For creation, require `expectedRevision: 0` and insert; a duplicate key means
conflict. For replacement, update with a filter containing the language, key,
and expected revision, then increment revision in that same operation. Do not
upsert a replacement with a stale revision. Check a matched result; zero matches
means conflict. An identical checksum at the expected revision can be a no-op.
MongoDB supports this through single-document atomic writes and expected-value
filters: [MongoDB atomicity documentation](https://www.mongodb.com/docs/manual/core/write-operations-atomicity/).

## Validation and review loading

Use shared, server-safe parsing/validation functions for preview and publication.
The existing parsers are permissive: worksheet 1 can return no rows for missing
columns, and worksheet 2 parsers can produce empty or incomplete rows. A parser
returning successfully is not sufficient validation.

Reject invalid UTF-8 uploads, empty content, unsupported worksheet keys, invalid
language codes, missing required worksheet structure, and content with no usable
rows. Validate language codes against the app's supported language registry,
not the old preload list; preserve valid script/region distinctions and use one
canonical lookup representation consistently with language authorization.
Report malformed rows and duplicate recognized keys. Treat untranslated cells,
instruction rows, and incomplete coverage as warnings where the format allows
them. Account for quoted multiline fields, CRLF, and BOMs in the parsing view
without modifying the stored original. Text worksheets have separate validation.

Fetch the language bundle once, fill each matching worksheet state, and clear
missing worksheets. Cancel or ignore stale requests when the language/import
source changes. Show a loading/error state and avoid leaving the previous
language's content on screen. Do not hot-replace unsaved text while someone is
editing; a newly published baseline takes effect on explicit reload or next load.

Replace `PreloadableTSVLanguages` as the source of worksheet availability with
the backend catalog. Update all availability consumers, including
`TargetLanguageOptions.ts`, preferred import-source selection, support checks,
and `useAllowedTargetLanguages.ts`. Preserve XML/blank import behavior and
intersect available TSV languages with authorized languages for reviewers.

Uploading a worksheet never modifies reviewer edits. Since edits are keyed by
entry IDs, changing baseline content can leave an edit associated with changed
source text; expose the worksheet revision and make baseline refresh explicit.
Baseline-aware review history is a separate future feature.

## Migration and delivery

1. Implement the collection service, index setup, shared validator, authorized
   routes, and admin screen. Keep runtime source files until verification ends.
2. Provide a dry-run migration that inventories `public/input_tsvs/`, maps each
   filename to language/key, validates it, and records content checksums. An
   authenticated admin uses the publishing API for writes; no browser database
   credentials. Skip identical content and report differing existing data as a
   conflict unless the administrator explicitly selects replacement.
3. Resolve exceptions before cutover: `abr_2.tsv` has no matching supported key
   (`2_1`, `2_2`, `2_3`) and must be split/mapped or explicitly archived;
   do not guess. `kri_1.tsv` exists but `kri` is absent from the current preload
   list, so making it discoverable is a behavior change to verify. Include the
   existing worksheet 3/4 `.txt` files in the inventory.
4. Verify every migrated source by checksum and compare parsed rows with the
   repository baseline. Test representative review screens and existing drafts.
5. Switch the loader and language catalog to the API. Verify access and failure
   handling, then remove migrated files from `public/input_tsvs/`. Avoid a silent
   static-file fallback, which can hide a failed migration or database outage.
   Retain a migration manifest and backup for rollback.

Acceptance checks: signed-out/non-admin writes are denied; a demoted admin is
denied immediately; language reads enforce assignments; uploads round-trip;
malformed/oversized content is rejected; simultaneous creates/replacements
produce conflicts rather than lost updates; new uploaded languages appear;
switching languages cannot apply late responses; missing worksheets are handled;
database errors remain visible; publishing leaves existing reviewer edits intact.
