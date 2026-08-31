import { BackgroundStyle } from '../BackgroundStyle';
import StepName from '../StepName';

import { URL_PARAMS_DEFAULTS, URLParams } from './urlParamsTypes';

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
  Object.entries(URL_PARAMS_DEFAULTS).forEach(([key, value]) => {
    if (next.get(key) === value.toString()) next.delete(key);
  });

  return next;
}

export default buildNextURLSearchParams;
