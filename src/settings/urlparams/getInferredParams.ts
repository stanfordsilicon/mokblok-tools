import { InterfaceLanguage } from '@data/DataTypes';
import ImportSource from '@data/ImportSource';

import enforceExhaustiveSwitch from '@shared/enforceExhaustiveSwitch';

import { getPreferredImportSourceForTargetLanguage } from '../selectors/TargetLanguageOptions';

import { URLParams, URL_PARAMS_DEFAULTS } from './urlParamsTypes';

function getInferredParams(
  instantiatedParams: Partial<URLParams>,
  userSettings?: { role: string | null; languages: readonly string[] | null | undefined },
): Partial<URLParams> {
  const instantiatedOrDefault = { ...URL_PARAMS_DEFAULTS, ...instantiatedParams };
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
      instantiatedOrDefault.targetLanguage != 'mg'
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

export default getInferredParams;
