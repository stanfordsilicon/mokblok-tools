import {
  worksheetAccess,
  worksheetHandler,
  worksheetJSON,
} from '../../../../src/data/worksheets/server/http';
import { worksheetsCollection } from '../../../../src/data/worksheets/server/repository';

export const runtime = 'nodejs';
export async function GET() {
  return worksheetHandler(async () => {
    const access = await worksheetAccess(true);
    if (access.response) return access.response;
    const worksheets = await (
      await worksheetsCollection()
    )
      .find(
        {},
        {
          projection: { _id: 0, content: 0 },
        },
      )
      .sort({ targetLanguage: 1, worksheetKey: 1 })
      .toArray();
    return worksheetJSON({ worksheets });
  });
}
