import React from 'react';

import { getDocFileType, type Doc } from '@data/Doc';

import { type UseStoredParamsReturn } from '@settings/useStoredParams';

type Props = {
  doc: Doc;
  texts: Record<Doc, UseStoredParamsReturn<string>>;
};

const InputTextArea: React.FC<Props> = ({ doc, texts }) => {
  const { value: inputText, setValue: setInputText } = texts[doc];

  return (
    <textarea
      style={{
        width: '100%',
        height: '300px',
        marginTop: '1em',
        fontSize: '8px',
        tabSize: 16,
        whiteSpace: 'nowrap',
      }}
      placeholder={`Paste ${getDocFileType(doc).toUpperCase()} data here...`}
      value={inputText}
      onChange={(e) => setInputText(e.target.value)}
    />
  );
};

export default InputTextArea;
