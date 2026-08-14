import { useState } from 'react';

import { Worksheet } from '@data/worksheets/Worksheet';

import WorksheetsSelector from '@settings/selectors/WorksheetsSelector';

import ImportCheck from './check/ImportCheck';
import InputTSVTextArea from './ImportTSVTextArea';
import ImportWorksheetSelector from './ImportWorksheetSelector';

const ImportTSVSection = () => {
  const [currentWorksheet, setCurrentWorksheet] = useState<Worksheet>(Worksheet.W1);

  return (
    <>
      <div className="w-fit">
        <WorksheetsSelector />
      </div>
      <ImportWorksheetSelector curWorksheet={currentWorksheet} setWorksheet={setCurrentWorksheet} />
      <InputTSVTextArea worksheet={currentWorksheet} />
      <ImportCheck worksheet={currentWorksheet} />
    </>
  );
};

export default ImportTSVSection;
