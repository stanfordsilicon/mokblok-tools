import { useState } from 'react';

import { Doc } from '@data/tsvdocs/Doc';

import WorksheetsSelector from '@settings/selectors/WorksheetsSelector';

import ImportCheck from './check/ImportCheck';
import ImportTSVDocSelector from './ImportTSVDocSelector';
import InputTSVTextArea from './ImportTSVTextArea';

const ImportTSVSection = () => {
  const [currentDoc, setCurrentDoc] = useState<Doc>(Doc.Doc1);

  return (
    <>
      <div className="w-fit">
        <WorksheetsSelector />
      </div>
      <ImportTSVDocSelector curWorksheet={currentDoc} setWorksheet={setCurrentDoc} />
      <InputTSVTextArea doc={currentDoc} />
      <ImportCheck doc={currentDoc} />
    </>
  );
};

export default ImportTSVSection;
