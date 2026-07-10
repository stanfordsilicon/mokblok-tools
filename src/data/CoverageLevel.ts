export enum CoverageLevel {
  Unknown = 0,
  Core = 1,
  Basic = 2,
  BasicIfLocal = 3,
  Moderate = 4,
  ModerateIfLocal = 5,
  Modern = 6,
  Comprehensive = 7,
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

export function getCoverageLevelLabel(level: CoverageLevel): string {
  switch (level) {
    case CoverageLevel.Core:
      return 'Core';
    case CoverageLevel.Basic:
      return 'Basic';
    case CoverageLevel.BasicIfLocal:
      return 'Basic (if local)';
    case CoverageLevel.Moderate:
      return 'Moderate';
    case CoverageLevel.ModerateIfLocal:
      return 'Moderate (if local)';
    case CoverageLevel.Modern:
      return 'Modern';
    case CoverageLevel.Comprehensive:
      return 'Comprehensive';
    default:
      return 'Unknown';
  }
}

export function parseCoverageLevel(level: string): CoverageLevel {
  switch (level.toLowerCase().replace(/\s+/g, '')) {
    case 'core':
    case '1':
      return CoverageLevel.Core;
    case 'basic':
    case '2':
      return CoverageLevel.Basic;
    case 'basiciflocal':
    case '3':
      return CoverageLevel.BasicIfLocal;
    case 'moderate':
    case '4':
      return CoverageLevel.Moderate;
    case 'moderateiflocal':
    case '5':
      return CoverageLevel.ModerateIfLocal;
    case 'modern':
    case '6':
      return CoverageLevel.Modern;
    case 'comprehensive':
    case '7':
      return CoverageLevel.Comprehensive;
    default:
      return CoverageLevel.Unknown;
  }
}
