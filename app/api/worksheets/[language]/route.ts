import {
  languageParam,
  worksheetAccess,
  worksheetHandler,
  worksheetJSON,
} from '../../../../src/data/worksheets/server/http';
import { worksheetsCollection } from '../../../../src/data/worksheets/server/repository';

export const runtime = 'nodejs';
export async function GET(_request: Request, context: { params: Promise<{ language: string }> }) {
  return worksheetHandler(async () => {
    const access = await worksheetAccess();
    if (access.response) return access.response;
    const language = languageParam((await context.params).language);
    if (access.languages !== null && !access.languages?.includes(language)) {
      return worksheetJSON({ error: 'Not allowed for this language.' }, 403);
    }
    const documents = await (
      await worksheetsCollection()
    )
      .find(
        { targetLanguage: language },
        {
          projection: { worksheetKey: 1, content: 1, revision: 1 },
        },
      )
      .toArray();
    return worksheetJSON({
      worksheets: Object.fromEntries(
        documents.map((doc) => [
          doc.worksheetKey,
          {
            content: doc.content,
            revision: doc.revision,
          },
        ]),
      ),
    });
  });
}
