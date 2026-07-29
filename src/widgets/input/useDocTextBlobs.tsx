import { Doc } from '@data/tsvdocs/Doc';

import useStoredParams, { type UseStoredParamsReturn } from '@settings/useStoredParams';

export type DocTextBlobs = Record<Doc, UseStoredParamsReturn<string>>;

// Provides data for each Doc
const useDocTextBlobs = (): Record<Doc, UseStoredParamsReturn<string>> => {
  return {
    [Doc.Doc1]: useStoredParams('inputText_1', ''),
    [Doc.Doc2_1]: useStoredParams('inputText_2_1', ''),
    [Doc.Doc2_2]: useStoredParams('inputText_2_2', ''),
    [Doc.Doc2_3]: useStoredParams('inputText_2_3', ''),
    [Doc.Doc3]: useStoredParams('inputText_3', ''),
    [Doc.Doc4]: useStoredParams('inputText_4', ''),
  };
};

export default useDocTextBlobs;
