export enum BackgroundStyle {
  None,
  Missing,
  CoverageLevel,
  DifferentThanSource,
  Vote,
}

export function parseBackgroundStyle(style: string): BackgroundStyle {
  switch (style.toLowerCase().replace(/\s+/g, '')) {
    case 'missing':
    case '1':
      return BackgroundStyle.Missing;
    case 'coveragelevel':
    case '2':
      return BackgroundStyle.CoverageLevel;
    case 'differentthansource':
    case '3':
      return BackgroundStyle.DifferentThanSource;
    case 'vote':
    case '4':
      return BackgroundStyle.Vote;
    case 'none':
    case '0':
    default:
      return BackgroundStyle.None;
  }
}
