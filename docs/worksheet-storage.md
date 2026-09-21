# Managing review worksheets

Worksheet baselines now load from `homescreen_review_worksheets` in the database
selected by `SILICON_DB_NAME` (default `silicon`), with public worksheet files as
a fallback. Each database worksheet wins over the corresponding file; missing
worksheets load from `public/input_tsvs/<language>_<worksheet>.tsv` (or `.txt` for
worksheets 3/4). Failed, unauthorized, or timed-out database reads can also use
these already-public files. A three-second request timeout keeps an unavailable
database from blocking the fallback indefinitely. Errors remain visible when
neither source supplies data. Saves still use the authenticated database API.
Reviewer drafts remain in `homescreen_review_edits`.

`/api/worksheet-files` discovers available languages from the public filenames
without accessing MongoDB. The picker combines those languages with the database
catalog. Restoring a file makes its language available without a hardcoded list.
Bundled sources are identified as “bundled file” in worksheet revision details.

Screenshot helpers simulate an unavailable worksheet database and use these real
public files by default, with review drafts mocked as well. Focused API browser
tests can opt into their own mocks using `gotoApp(..., viewer, 'mocked')`.

## Uploading

Open **Import → TSV**, select the language and worksheet, and paste data into
the worksheet text area. **Load from a file instead** is an optional alternative
for any user who can access Import: it fills the same text area without saving.
The filename never changes the selected language or document.

Administrators see **Save to database** below the editor. One click validates and
saves the current text; invalid data stays in the editor with error messages.
Pasting, typing, and choosing a file do not save automatically. Server-side admin
checks and revision conflicts still apply to each save.

The **Published worksheets** details panel below the import controls shows upload
attribution and revisions across languages for admins. The former
`/admin/worksheets` URL redirects to Import.

Worksheet 3/4 accept plain text; the other types require their corresponding TSV
layout. The limit is 1 MiB per worksheet. Uploaded source text is retained exactly,
including its BOM and line endings; normalization is only for parsing.

Publishing changes shared baseline data on the next review load. It does not
overwrite a reviewer's saved edits or publish text entered in the ordinary import
textarea. The screen displays upload attribution and revision. A concurrent edit
returns a conflict; refresh the list and review the current revision before saving again.
Revisions prevent lost updates but do not provide historical version storage.

TSV language availability comes from the authorized database catalog, so Krio
and future uploaded languages appear without updating a hardcoded list. Reviewers
can read only assigned languages; admins can read all languages. The backend
rechecks database roles and assignments for every request.

## Initial migration and verification

The initial migration copied and checksum-verified 33 documents: 25 TSVs and eight
worksheet 3/4 text files, including `kri_1.tsv`. `abr_2.tsv` was obsolete and was
removed without importing it. See `worksheet-migration-manifest.json` for the
verified source hashes. Bootstrap uploads are attributed to
`migration:repository`; browser uploads record the authenticated administrator ID.

The initial 33 source files were removed after MongoDB checksum verification.
The six Malagasy (`mg`) TSV/TXT files have since been restored under
`public/input_tsvs/` to support fallback and screenshot tests. They are public
static assets. The migration manifest remains in the repository.

The migration utility requires Node 24. It validates every input before writing,
skips identical documents, refuses to replace different published content, and
verifies the stored source hashes. It can safely resume after a partial failure.
It never prints database credentials or session cookies.

```sh
# Dry-run an external backup, with no database access.
npm run worksheets:migrate -- --source /path/to/worksheet-backup

# Operator bootstrap using existing database credentials.
node --env-file=.env.local --import ./scripts/lib/register-typescript.mjs \
  scripts/migrate-worksheets.mjs --source /path/to/worksheet-backup --direct-db --apply

# Alternatively, use an authenticated administrator's session via the API.
# Supply WORKSHEET_ADMIN_COOKIE securely in the environment; do not commit it.
npm run worksheets:migrate -- --source /path/to/worksheet-backup --apply --origin http://localhost:3000
```

Direct database mode is an operator tool requiring database write credentials;
it is not an HTTP endpoint or a way for regular app users to upload. The web
routes always require an authenticated admin. The optional `--prune-source`
flag deletes the verified input files only after all uploads/readbacks succeed
and the manifest is written; use it only when source deletion is authorized.
Keep the Git revision containing the original inputs for rollback.

New deployments need the migrated database for languages not bundled locally.
Other databases must be seeded separately. Public fallback files may be older
than saved database revisions. The application currently reads
the small language registry from `public/languageNames.tsv`; include that public
asset when packaging the server.

## Verification

```sh
npm run worksheets:test
npm run worksheets:browser-test
npx tsc --noEmit
npm run build
```

The worksheet tests cover source validation and representative worksheet formats,
authentication/authorization, demotion, request size and encoding, CSRF origin
checks, assigned-language reads, and concurrent publication conflicts. API and
repository tests use controlled dependencies and do not modify a real database.
Migration readback verifies actual stored text separately.

The browser checks use mocked data to verify database loading, local edit
preservation, visible errors, and retry. Their isolated server uses the webpack
production build because Turbopack's CSS worker port binding was restricted in
the implementation environment. Type checking, lint, nine worksheet tests, the
browser checks, and the webpack production build passed.
