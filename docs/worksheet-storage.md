# Managing review worksheets

Worksheet baselines now load from `homescreen_review_worksheets` in the database
selected by `SILICON_DB_NAME` (default `silicon`). The runtime does not fall back
to repository TSVs. Reviewer drafts remain in `homescreen_review_edits`.

## Uploading

Sign in as an administrator and open `/admin/worksheets`, or choose **Manage
worksheets** in the admin sidebar. Select a UTF-8 file or paste worksheet text,
check its language and worksheet type, then choose **Validate and preview**.
Publish only after reviewing the counts and warnings. Worksheet 3/4 accept plain
text; the other types require their corresponding TSV layout. The limit is 1 MiB
per worksheet. A source file's text is retained exactly, including its BOM and
line endings; normalization is only for parsing.

Publishing changes shared baseline data on the next review load. It does not
overwrite a reviewer's saved edits or publish text entered in the ordinary import
textarea. The screen displays upload attribution and revision. A concurrent edit
returns a conflict; refresh the list and preview again before replacing it.
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

The 33 source files are currently retained under `public/input_tsvs/` pending
approval for their deletion. They are no longer used by the app, but remain
public static assets until removed. Automatic approval review permitted the
database copy but rejected deletion of these remaining files. The obsolete
`abr_2.tsv` deletion was explicitly authorized separately.

The migration utility requires Node 24. It validates every input before writing,
skips identical documents, refuses to replace different published content, and
verifies the stored source hashes. It can safely resume after a partial failure.
It never prints database credentials or session cookies.

```sh
# Local dry run, no database access.
npm run worksheets:migrate

# Operator bootstrap using existing database credentials.
node --env-file=.env.local --import ./scripts/lib/register-typescript.mjs \
  scripts/migrate-worksheets.mjs --direct-db --apply

# Alternatively, use an authenticated administrator's session via the API.
# Supply WORKSHEET_ADMIN_COOKIE securely in the environment; do not commit it.
npm run worksheets:migrate -- --apply --origin http://localhost:3000
```

Direct database mode is an operator tool requiring database write credentials;
it is not an HTTP endpoint or a way for regular app users to upload. The web
routes always require an authenticated admin. The optional `--prune-source`
flag deletes the verified input files only after all uploads/readbacks succeed
and the manifest is written; use it only when source deletion is authorized.
Keep the Git revision containing the original inputs for rollback.

New deployments need the migrated database before using the new loader. Other
databases must be seeded separately. A database outage shows an error instead of
silently falling back to an old static baseline. The application currently reads
the small language registry from `public/languageNames.tsv`; include that public
asset when packaging the server.

## Verification

```sh
npm run worksheets:test
npm run worksheets:browser-test
npx tsc --noEmit
npm run build
```

The worksheet tests cover source validation, all retained migration inputs,
authentication/authorization, demotion, request size and encoding, CSRF origin
checks, assigned-language reads, and concurrent publication conflicts. API and
repository tests use controlled dependencies and do not modify a real database.
Migration readback verifies actual stored text separately.

The two browser checks use mocked data to verify database loading, local edit
preservation, visible errors, and retry. Their isolated server uses the webpack
production build because Turbopack's CSS worker port binding was restricted in
the implementation environment. Type checking, lint, nine worksheet tests, the
two browser checks, and the webpack production build passed.
