import { useSession } from 'next-auth/react';
import { useState } from 'react';

import { useTargetDataContext } from '@data/target/TargetDataProvider';
import type { WorksheetKey } from '@data/worksheets/storageTypes';
import { Worksheet, getWorksheetFileSuffix } from '@data/worksheets/Worksheet';
import { getAvailableWorksheets } from '@data/worksheets/Worksheets';

import WorksheetsSelector from '@settings/selectors/WorksheetsSelector';
import { useURLParams } from '@settings/URLParams';

import ImportCheck from './check/ImportCheck';
import InputTSVTextArea from './ImportTSVTextArea';
import ImportWorksheetSelector from './ImportWorksheetSelector';
import WorksheetManager from './WorksheetManager';

const ImportTSVSection = () => {
  const [selectedWorksheet, setCurrentWorksheet] = useState<Worksheet>(Worksheet.W1);
  const { targetLanguage, worksheets } = useURLParams();
  const { importedWorksheets, worksheetsLoading } = useTargetDataContext();
  const session = useSession();
  const available = getAvailableWorksheets(worksheets);
  const currentWorksheet = available.includes(selectedWorksheet) ? selectedWorksheet : available[0];
  const editor = (
    <>
      <InputTSVTextArea worksheet={currentWorksheet} />
      <ImportCheck worksheet={currentWorksheet} />
    </>
  );

  return (
    <>
      <div className="w-fit">
        <WorksheetsSelector />
      </div>
      <ImportWorksheetSelector curWorksheet={currentWorksheet} setWorksheet={setCurrentWorksheet} />
      <WorksheetManager
        canSave={session.data?.user?.role === 'admin'}
        key={`${targetLanguage}:${currentWorksheet}`}
        targetLanguage={targetLanguage}
        worksheetKey={getWorksheetFileSuffix(currentWorksheet) as WorksheetKey}
        worksheetLabel={currentWorksheet}
        content={importedWorksheets[currentWorksheet]?.value ?? ''}
        onContentChange={(content) => importedWorksheets[currentWorksheet]?.set(content)}
        loading={worksheetsLoading}
      >
        {editor}
      </WorksheetManager>
    </>
  );
};

export default ImportTSVSection;
