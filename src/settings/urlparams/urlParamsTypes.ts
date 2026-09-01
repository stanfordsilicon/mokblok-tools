import { CoverageLevel } from '@data/CoverageLevel';
import { DataPage, DataSection } from '@data/DataSection';
import { InterfaceLanguage } from '@data/DataTypes';
import ImportSource from '@data/ImportSource';
import { Worksheets } from '@data/worksheets/Worksheets';

import { BackgroundStyle } from '../BackgroundStyle';
import StepName from '../StepName';

export const URL_PARAMS_DEFAULTS: Readonly<URLParams> = {
  interfaceLanguage: InterfaceLanguage.English,
  sourceLanguage: 'en',
  targetLanguage: '',
  coverageLevel: CoverageLevel.Comprehensive,
  step: StepName.Intro,
  page: DataPage.DateAndTime,
  section: DataSection.DaysOfWeek,
  bgStyle: BackgroundStyle.Missing,
  dateExample: 0,
  admin: false,
  importSource: ImportSource.TSV,
  worksheets: Worksheets.W1only,
};

export type URLParams = {
  step: StepName;
  interfaceLanguage: InterfaceLanguage; // en, fr
  sourceLanguage: string; // en, fr, mg, wo
  targetLanguage: string; // mg, wo
  coverageLevel: CoverageLevel;
  page: DataPage;
  section: DataSection;
  bgStyle: BackgroundStyle;
  dateExample: number; // DateTime in seconds for examples
  admin: boolean;
  importSource: ImportSource;
  worksheets: Worksheets;
};

export type URLParamsContextState = URLParams & {
  updateURLParams: (newParams: Partial<URLParams>) => void;
};
