import {
  assertWriteOrigin,
  candidateWorksheet,
  readWorksheetBody,
  worksheetAccess,
  worksheetHandler,
  worksheetJSON,
} from '../../../../../src/data/worksheets/server/http';

export const runtime = 'nodejs';
export async function POST(request: Request) {
  return worksheetHandler(async () => {
    const access = await worksheetAccess(true);
    if (access.response) return access.response;
    assertWriteOrigin(request);
    const body = await readWorksheetBody(request);
    const { validation } = await candidateWorksheet(
      String(body.targetLanguage ?? ''),
      String(body.worksheetKey ?? ''),
      body,
    );
    return worksheetJSON({ validation }, validation.valid ? 200 : 422);
  });
}
