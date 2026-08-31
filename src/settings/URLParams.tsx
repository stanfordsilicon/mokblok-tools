import { useSession } from 'next-auth/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { createContext, useCallback, useContext, useEffect, useMemo } from 'react';

import i18n from '@i18n';

import { CoverageLevel, parseCoverageLevel } from '@data/CoverageLevel';
import { DataPage, DataSection } from '@data/DataSection';
import { InterfaceLanguage } from '@data/DataTypes';
import ImportSource from '@data/ImportSource';
import { Worksheets } from '@data/worksheets/Worksheets';

import enforceExhaustiveSwitch from '@shared/enforceExhaustiveSwitch';

import { BackgroundStyle } from './BackgroundStyle';
import { getPreferredImportSourceForTargetLanguage } from './selectors/TargetLanguageOptions';
import StepName from './StepName';

const GLOBAL_DEFAULTS: Readonly<URLParams> = {
  interfaceLanguage: InterfaceLanguage.English,
  sourceLanguage: 'en',
  targetLanguage: 'mg',
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
  interfaceLanguage: InterfaceLanguage; // en, fr
  sourceLanguage: string; // en, fr, mg, wo
  targetLanguage: string; // mg, wo
  coverageLevel: CoverageLevel;
  step: StepName;
  page: DataPage;
  section: DataSection;
  bgStyle: BackgroundStyle;
  dateExample: number; // DateTime in seconds for examples
  admin: boolean;
  importSource: ImportSource;
  worksheets: Worksheets;
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
    if (value == null || (value === '' && key !== 'targetLanguage')) {
      next.delete(key);
    } else {
      next.set(key, value.toString());
    }
  });

  // Modify undeclared parameters that have contextual defaults
  if (!next.has('bgStyle') && newParams.step === StepName.Vote)
    next.set('bgStyle', BackgroundStyle.Vote.toString());

  // Clear parameters that match the defaults
  Object.entries(GLOBAL_DEFAULTS).forEach(([key, value]) => {
    if (next.get(key) === value.toString()) next.delete(key);
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
      case 'interfaceLanguage':
        if (Object.values(InterfaceLanguage).includes(value as InterfaceLanguage))
          params[key] = value as InterfaceLanguage;
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

function getInferredParams(
  instantiatedParams: Partial<URLParams>,
  userSettings?: { role: string | null; languages: readonly string[] | null | undefined },
): Partial<URLParams> {
  const instantiatedOrDefault = { ...GLOBAL_DEFAULTS, ...instantiatedParams };
  const inferredParams: Partial<URLParams> = {};

  // Match the source language to the interface language
  if (instantiatedParams.sourceLanguage == null && instantiatedParams.interfaceLanguage != null) {
    switch (instantiatedParams.interfaceLanguage) {
      case InterfaceLanguage.EnglishFraktur:
      case InterfaceLanguage.English:
      case InterfaceLanguage.Spanish:
      case InterfaceLanguage.French:
      case InterfaceLanguage.Italian:
      case InterfaceLanguage.Portuguese:
        inferredParams.sourceLanguage = instantiatedParams.interfaceLanguage;
        break;
      default:
        enforceExhaustiveSwitch(instantiatedParams.interfaceLanguage);
    }
  }

  // Restrictions based on sign-in role.
  if (userSettings?.role !== 'admin') inferredParams.admin = false;

  if (!(inferredParams.admin ?? instantiatedOrDefault.admin)) {
    // Remove target language if its not in the user's allowed languages
    const allowedLanguages = userSettings?.languages ?? [];
    if (
      !allowedLanguages.includes(instantiatedOrDefault.targetLanguage) &&
      instantiatedOrDefault.targetLanguage != 'nd' &&
      instantiatedOrDefault.targetLanguage != 'mos'
    )
      inferredParams.targetLanguage = allowedLanguages[0] ?? ''; // None
  }
  if (!userSettings?.role) inferredParams.importSource = ImportSource.Blank;

  // Find the best import source for the target language if it is not specified
  if (!instantiatedParams.importSource) {
    const effectiveTargetLanguage =
      inferredParams.targetLanguage ?? instantiatedOrDefault.targetLanguage ?? '';
    if (inferredParams.importSource === ImportSource.Blank || !effectiveTargetLanguage) {
      inferredParams.importSource = ImportSource.Blank;
      return inferredParams;
    }
    inferredParams.importSource =
      getPreferredImportSourceForTargetLanguage(effectiveTargetLanguage);
  }

  return inferredParams;
}

/**
 * These parameters are saved in the URL
 */
export const URLParamsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const userSettings = useSession().data?.user;

  const updateURLParams = useCallback(
    (newParams: Partial<URLParams>) => {
      const nextSearchParams = buildNextURLSearchParams(
        newParams,
        new URLSearchParams(searchParams.toString()),
      );
      const nextSearch = nextSearchParams.toString();
      router.replace(nextSearch ? `${pathname}?${nextSearch}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const providerValue: URLParamsContextState = useMemo(() => {
    const instantiatedParams = getParamsFromURL(new URLSearchParams(searchParams.toString()));

    Object.keys(instantiatedParams).forEach((key) => {
      const typedKey = key as keyof URLParams;
      if (instantiatedParams[typedKey] == null) delete instantiatedParams[typedKey];
    });
    const inferredParams = getInferredParams(instantiatedParams, userSettings);
    return {
      ...GLOBAL_DEFAULTS,
      ...instantiatedParams,
      ...inferredParams,
      updateURLParams,
    };
  }, [userSettings, searchParams, updateURLParams]);

  useEffect(() => {
    const changeLanguage = async () => {
      await i18n.changeLanguage(providerValue.interfaceLanguage);
    };
    void changeLanguage();
  }, [providerValue.interfaceLanguage]);

  return <URLParamsContext.Provider value={providerValue}>{children}</URLParamsContext.Provider>;
};

export const useURLParams = () => {
  const context = useContext(URLParamsContext);
  if (!context) {
    throw new Error('useURLParams must be used within a URLParamsProvider');
  }
  return context;
};
