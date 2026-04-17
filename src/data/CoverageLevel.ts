export enum CoverageLevel {
  Core = 'core',
  Basic = 'basic',
  BasicIfLocal = 'basic if local',
  Moderate = 'moderate',
  ModerateIfLocal = 'moderate if local',
  Modern = 'modern',
  Comprehensive = 'comprehensive',
}

// Data of an earlier coverage level is also relevant for a later coverage level,
// but not the opposite. For example, if the user selects "Moderate", they should
// also see the "Core" and "Basic" fields, but if they select "Basic", they should
// not see the "Moderate" fields.
export function isWithinCoverageLevel(input: CoverageLevel, target: CoverageLevel): boolean {
  const levels = [
    CoverageLevel.Core,
    CoverageLevel.Basic,
    CoverageLevel.BasicIfLocal,
    CoverageLevel.Moderate,
    CoverageLevel.ModerateIfLocal,
    CoverageLevel.Modern,
    CoverageLevel.Comprehensive,
  ];
  const inputIndex = levels.indexOf(input);
  const targetIndex = levels.indexOf(target);
  return inputIndex !== -1 && targetIndex !== -1 && inputIndex <= targetIndex;
}
