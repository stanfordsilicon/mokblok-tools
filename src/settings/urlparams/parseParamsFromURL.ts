import { parseCoverageLevel } from '@data/CoverageLevel';
import { DataPage, DataSection } from '@data/DataSection';
import { InterfaceLanguage } from '@data/DataTypes';
import ImportSource from '@data/ImportSource';
import { Worksheets } from '@data/worksheets/Worksheets';

import { BackgroundStyle } from '@settings/BackgroundStyle';
import StepName from '@settings/StepName';

import { URLParams } from './urlParamsTypes';

/**
 * Convert the array of keys to strings to keys to the proper parameter types.
 */
function parseParamsFromURL(urlParams: URLSearchParams): Partial<URLParams> {
  const params: Partial<URLParams> = {};
  urlParams.forEach((value, keyUntyped) => {
    const key = keyUntyped as keyof URLParams;
    switch (key) {
      case 'step':
        if (Object.values(StepName).includes(value as StepName)) params[key] = value as StepName;
        break;
      case 'interfaceLanguage':
        if (Object.values(InterfaceLanguage).includes(value as InterfaceLanguage))
          params[key] = value as InterfaceLanguage;
        break;
      case 'coverageLevel':
        params[key] = parseCoverageLevel(value);
        break;
      case 'page':
        if (Object.values(DataPage).includes(value as DataPage)) params[key] = value as DataPage;
        break;
      case 'section':
        if (Object.values(DataSection).includes(value as DataSection))
          params[key] = value as DataSection;
        break;
      case 'sourceLanguage':
      case 'targetLanguage':
        params[key] = value;
        break;
      case 'bgStyle':
        if (Object.values(BackgroundStyle).includes(Number(value) as BackgroundStyle))
          params[key] = Number(value) as BackgroundStyle;
        break;
      case 'dateExample':
        if (!isNaN(Number(value))) params[key] = Number(value);
        break;
      case 'admin':
        if (value === 'true' || value === 'false') params[key] = value === 'true';
        break;
      case 'importSource':
        if (Object.values(ImportSource).includes(value as ImportSource))
          params[key] = value as ImportSource;
        break;
      case 'worksheets':
        if (Object.values(Worksheets).includes(value as Worksheets))
          params[key] = value as Worksheets;
        break;
      default:
        break;
    }
  });
  return params;
}

export default parseParamsFromURL;
