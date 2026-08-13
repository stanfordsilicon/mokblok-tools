import { useState } from 'react';

import { Doc } from '@data/tsvdocs/Doc';

import ImportCheck from './check/ImportCheck';
import ImportTSVDocSelector from './ImportTSVDocSelector';
import InputTSVTextArea from './ImportTSVTextArea';

const ImportTSVSection = () => {
  const [currentDoc, setCurrentDoc] = useState<Doc>(Doc.Doc1);

  return (
    <>
      <ImportTSVDocSelector curDoc={currentDoc} setDoc={setCurrentDoc} />
      <InputTSVTextArea doc={currentDoc} />
      <ImportCheck doc={currentDoc} />
    </>
  );
};

export default ImportTSVSection;
