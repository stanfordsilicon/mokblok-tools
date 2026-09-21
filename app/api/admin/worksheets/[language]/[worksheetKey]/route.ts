import {
  assertWriteOrigin,
  candidateWorksheet,
  readWorksheetBody,
  worksheetAccess,
  worksheetHandler,
  worksheetJSON,
} from '../../../../../../src/data/worksheets/server/http';
import { publishWorksheet } from '../../../../../../src/data/worksheets/server/repository';

export const runtime = 'nodejs';
export async function PUT(
  request: Request,
  context: { params: Promise<{ language: string; worksheetKey: string }> },
) {
  return worksheetHandler(async () => {
    const access = await worksheetAccess(true);
    if (access.response) return access.response;
    assertWriteOrigin(request);
    const { language, worksheetKey } = await context.params;
    const { input, validation } = await candidateWorksheet(
      language,
      worksheetKey,
      await readWorksheetBody(request),
    );
    if (!validation.valid)
      return worksheetJSON({ validation, error: 'Worksheet validation failed.' }, 422);
    const result = await publishWorksheet(input, access.userId!);
    if (!result)
      return worksheetJSON(
        { error: 'This worksheet changed. Refresh its revision and preview again.' },
        409,
      );
    return worksheetJSON({ ...result, validation }, input.expectedRevision === 0 ? 201 : 200);
  });
}
