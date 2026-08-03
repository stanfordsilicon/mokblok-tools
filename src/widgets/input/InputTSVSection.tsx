import { useState } from 'react';

import { Doc } from '@data/tsvdocs/Doc';

import InputCheck from './check/InputCheck';
import InputDocSelector from './InputDocSelector';
import InputTSVTextArea from './InputTSVTextArea';

const InputTSVSection = () => {
  const [currentDoc, setCurrentDoc] = useState<Doc>(Doc.Doc1);

  return (
    <>
      <InputDocSelector curDoc={currentDoc} setDoc={setCurrentDoc} />
      <InputTSVTextArea doc={currentDoc} />
      <InputCheck doc={currentDoc} />
    </>
  );
};

export default InputTSVSection;
