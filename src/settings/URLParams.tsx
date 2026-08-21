import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React, { createContext, useCallback, useContext, useEffect, useMemo } from 'react';

import i18n from '@i18n';

import { CoverageLevel, parseCoverageLevel } from '@data/CoverageLevel';
import { DataPage, DataSection } from '@data/DataSection';
import { InterfaceLanguage, SourceLanguage } from '@data/DataTypes';
import ImportSource from '@data/ImportSource';
import { Worksheets } from '@data/worksheets/Worksheets';

import enforceExhaustiveSwitch from '@shared/enforceExhaustiveSwitch';

import { BackgroundStyle } from './BackgroundStyle';
import {
  preferredImportSourceForTargetLanguage,
  supportsTargetLanguage,
} from './selectors/TargetLanguageOptions';
import StepName from './StepName';
import { getScopedTargetLanguages } from './target-language-scope';

const GLOBAL_DEFAULTS: Readonly<URLParams> = {
  interfaceLanguage: InterfaceLanguage.English,
  sourceLanguage: SourceLanguage.English,
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
  sourceLanguage: SourceLanguage; // en, fr, mg, wo
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
  role?: string,
  languages?: string[],
): Partial<URLParams> {
  const inferredParams: Partial<URLParams> = {};
  if (instantiatedParams.sourceLanguage == null && instantiatedParams.interfaceLanguage != null) {
    switch (instantiatedParams.interfaceLanguage) {
      case InterfaceLanguage.EnglishFraktur:
        inferredParams.sourceLanguage = SourceLanguage.EnglishFraktur;
        break;
      case InterfaceLanguage.English:
        inferredParams.sourceLanguage = SourceLanguage.English;
        break;
      case InterfaceLanguage.Spanish:
        inferredParams.sourceLanguage = SourceLanguage.Spanish;
        break;
      case InterfaceLanguage.French:
        inferredParams.sourceLanguage = SourceLanguage.French;
        break;
      case InterfaceLanguage.Italian:
        inferredParams.sourceLanguage = SourceLanguage.Italian;
        break;
      default:
        enforceExhaustiveSwitch(instantiatedParams.interfaceLanguage);
    }
  }

  // Restrictions based on sign-in role.
  if (role !== 'admin') inferredParams.admin = false;
  if (!role) inferredParams.importSource = ImportSource.Blank;

  const scopedLanguages = getScopedTargetLanguages(role, languages);
  if (scopedLanguages.length > 0) {
    const currentTargetLanguage = instantiatedParams.targetLanguage;
    const targetLanguage =
      currentTargetLanguage && scopedLanguages.includes(currentTargetLanguage)
        ? currentTargetLanguage
        : scopedLanguages[0];

    inferredParams.targetLanguage = targetLanguage;

    const currentImportSource =
      instantiatedParams.importSource ??
      inferredParams.importSource ??
      GLOBAL_DEFAULTS.importSource;

    if (role !== 'admin' && !supportsTargetLanguage(currentImportSource, targetLanguage)) {
      inferredParams.importSource = preferredImportSourceForTargetLanguage(targetLanguage);
    }
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
  const { role, languages } = useSession().data?.user ?? {};

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
    const inferredParams = getInferredParams(instantiatedParams, role, languages);
    return {
      ...GLOBAL_DEFAULTS,
      ...instantiatedParams,
      ...inferredParams,
      updateURLParams,
    };
  }, [languages, role, searchParams, updateURLParams]);

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
