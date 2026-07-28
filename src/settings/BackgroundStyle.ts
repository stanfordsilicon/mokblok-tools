export enum BackgroundStyle {
  None,
  Missing,
  CoverageLevel,
  DifferentThanSource,
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
    case 'none':
    case '0':
    default:
      return BackgroundStyle.None;
  }
}
