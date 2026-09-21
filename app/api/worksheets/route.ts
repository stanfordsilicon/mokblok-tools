import {
  worksheetAccess,
  worksheetHandler,
  worksheetJSON,
} from '../../../src/data/worksheets/server/http';
import { worksheetsCollection } from '../../../src/data/worksheets/server/repository';

export const runtime = 'nodejs';
export async function GET() {
  return worksheetHandler(async () => {
    const access = await worksheetAccess();
    if (access.response) return access.response;
    const collection = await worksheetsCollection();
    const worksheets = await collection
      .find(
        access.languages === null
          ? {}
          : {
              targetLanguage: { $in: access.languages ?? [] },
            },
        { projection: { _id: 0, targetLanguage: 1, worksheetKey: 1, revision: 1, updatedAt: 1 } },
      )
      .sort({ targetLanguage: 1, worksheetKey: 1 })
      .toArray();
    return worksheetJSON({ worksheets });
  });
}
