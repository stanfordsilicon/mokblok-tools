import React, { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { CoverageLevel, parseCoverageLevel } from '@data/CoverageLevel';
import { DataPage, DataSection } from '@data/DataSection';
import { SourceLanguage } from '@data/DataTypes';

import i18n from '../i18n';

import { BackgroundStyle } from './BackgroundStyle';
import StepName from './StepName';

const GLOBAL_DEFAULTS: Readonly<URLParams> = {
  sourceLanguage: SourceLanguage.English,
  targetLanguage: 'mg',
  coverageLevel: CoverageLevel.Moderate,
  step: StepName.Input,
  page: DataPage.DateAndTime,
  section: DataSection.DaysOfWeek,
  bgStyle: BackgroundStyle.Missing,
};

export type URLParams = {
  sourceLanguage: SourceLanguage; // eng, fra
  targetLanguage: string; // mlg, fra
  coverageLevel: CoverageLevel;
  step: StepName;
  page: DataPage;
  section: DataSection;
  bgStyle: BackgroundStyle;
};

type URLParamsContextState = URLParams & {
  updateURLParams: (newParams: Partial<URLParams>) => void;
};

const URLParamsContext = createContext<URLParamsContextState | undefined>(undefined);

/**
 * Create a new URLSearchParams object by converting the typed parameters into strings
 * and removing empty parameters.
 */
function buildNextURLSearchParams(
  newParams: Partial<URLParams>,
  next: URLSearchParams,
): URLSearchParams {
  // Convert newParams to array for iterate
  Object.entries(newParams).forEach(([key, value]) => {
    // Add special processing for numeric parameters here when they are added
    if (value == null || value === '') {
      next.delete(key);
    } else {
      next.set(key, value.toString());
    }
  });

  // Clear parameters that match the defaults
  Object.entries(GLOBAL_DEFAULTS).forEach(([key, value]) => {
    if (next.get(key) === value) next.delete(key);
  });

  return next;
}

/**
 * Convert the array of keys to strings to keys to the proper parameter types.
 */
export function getParamsFromURL(urlParams: URLSearchParams): Partial<URLParams> {
  const params: Partial<URLParams> = {};
  urlParams.forEach((value, keyUntyped) => {
    const key = keyUntyped as keyof URLParams;
    switch (key) {
      case 'sourceLanguage':
        if (Object.values(SourceLanguage).includes(value as SourceLanguage))
          params[key] = value as SourceLanguage;
        break;
      case 'coverageLevel':
        params[key] = parseCoverageLevel(value);
        break;
      case 'step':
        if (Object.values(StepName).includes(value as StepName)) params[key] = value as StepName;
        break;
      case 'page':
        if (Object.values(DataPage).includes(value as DataPage)) params[key] = value as DataPage;
        break;
      case 'section':
        if (Object.values(DataSection).includes(value as DataSection))
          params[key] = value as DataSection;
        break;
      case 'targetLanguage':
        params[key] = value;
        break;
      case 'bgStyle':
        if (Object.values(BackgroundStyle).includes(Number(value) as BackgroundStyle))
          params[key] = Number(value) as BackgroundStyle;
        break;
      default:
        break;
    }
  });
  return params;
}

/**
 * These parameters are saved in the URL
 */
export const URLParamsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [urlPageParams, setURLPageParams] = useSearchParams({});

  const updateURLParams = useCallback(
    (newParams: Partial<URLParams>) => {
      setURLPageParams((prev) => buildNextURLSearchParams(newParams, prev));
    },
    [setURLPageParams],
  );

  const providerValue: URLParamsContextState = useMemo(() => {
    const instantiatedParams = getParamsFromURL(urlPageParams);

    Object.keys(instantiatedParams).forEach((key) => {
      const typedKey = key as keyof URLParams;
      if (instantiatedParams[typedKey] == null) delete instantiatedParams[typedKey];
    });
    return {
      ...GLOBAL_DEFAULTS,
      ...instantiatedParams,
      updateURLParams,
    };
  }, [urlPageParams, updateURLParams]);

  useEffect(() => {
    const changeLanguage = async () => {
      await i18n.changeLanguage(providerValue.sourceLanguage);
    };
    void changeLanguage();
  }, [providerValue.sourceLanguage]);

  return <URLParamsContext.Provider value={providerValue}>{children}</URLParamsContext.Provider>;
};

export const useURLParams = () => {
  const context = useContext(URLParamsContext);
  if (!context) {
    throw new Error('useURLParams must be used within a URLParamsProvider');
  }
  return context;
};
