import {
  DateField,
  HourMinuteFormat,
  type DateCombinationData,
  type DateFieldData,
  type DayOfWeekData,
  type HourMinuteData,
  type MonthData,
  type RelativeTimeData,
  type RowData,
  type TimeIntervalData,
} from './DataTypes';

export function getMonthsData(rowsByKey: Record<string, RowData>): MonthData[] {
  return [
    {
      wide: rowsByKey['mw-1_XXX'],
      abbreviated: rowsByKey['mw-13_XXX'],
      narrow: rowsByKey['mw-25_XXX'],
    },
    {
      wide: rowsByKey['mw-2_XXX'],
      abbreviated: rowsByKey['mw-14_XXX'],
      narrow: rowsByKey['mw-26_XXX'],
    },
    {
      wide: rowsByKey['mw-3_XXX'],
      abbreviated: rowsByKey['mw-15_XXX'],
      narrow: rowsByKey['mw-27_XXX'],
    },
    {
      wide: rowsByKey['mw-4_XXX'],
      abbreviated: rowsByKey['mw-16_XXX'],
      narrow: rowsByKey['mw-28_XXX'],
    },
    {
      wide: rowsByKey['mw-5_XXX'],
      abbreviated: rowsByKey['mw-17_XXX'],
      narrow: rowsByKey['mw-29_XXX'],
    },
    {
      wide: rowsByKey['mw-6_XXX'],
      abbreviated: rowsByKey['mw-18_XXX'],
      narrow: rowsByKey['mw-30_XXX'],
    },
    {
      wide: rowsByKey['mw-7_XXX'],
      abbreviated: rowsByKey['mw-19_XXX'],
      narrow: rowsByKey['mw-31_XXX'],
    },
    {
      wide: rowsByKey['mw-8_XXX'],
      abbreviated: rowsByKey['mw-20_XXX'],
      narrow: rowsByKey['mw-32_XXX'],
    },
    {
      wide: rowsByKey['mw-9_XXX'],
      abbreviated: rowsByKey['mw-21_XXX'],
      narrow: rowsByKey['mw-33_XXX'],
    },
    {
      wide: rowsByKey['mw-10_XXX'],
      abbreviated: rowsByKey['mw-22_XXX'],
      narrow: rowsByKey['mw-34_XXX'],
    },
    {
      wide: rowsByKey['mw-11_XXX'],
      abbreviated: rowsByKey['mw-23_XXX'],
      narrow: rowsByKey['mw-35_XXX'],
    },
    {
      wide: rowsByKey['mw-12_XXX'],
      abbreviated: rowsByKey['mw-24_XXX'],
      narrow: rowsByKey['mw-36_XXX'],
    },
  ];
}

export function getDaysOfWeekData(rowsByKey: Record<string, RowData>): DayOfWeekData[] {
  return [
    {
      wide: rowsByKey['wk-1_XXX'],
      abbreviated: rowsByKey['wk-8_XXX'],
      short: rowsByKey['wk-15_XXX'],
      narrow: rowsByKey['wk-22_XXX'],
    },
    {
      wide: rowsByKey['wk-2_XXX'],
      abbreviated: rowsByKey['wk-9_XXX'],
      short: rowsByKey['wk-16_XXX'],
      narrow: rowsByKey['wk-23_XXX'],
    },
    {
      wide: rowsByKey['wk-3_XXX'],
      abbreviated: rowsByKey['wk-10_XXX'],
      short: rowsByKey['wk-17_XXX'],
      narrow: rowsByKey['wk-24_XXX'],
    },
    {
      wide: rowsByKey['wk-4_XXX'],
      abbreviated: rowsByKey['wk-11_XXX'],
      short: rowsByKey['wk-18_XXX'],
      narrow: rowsByKey['wk-25_XXX'],
    },
    {
      wide: rowsByKey['wk-5_XXX'],
      abbreviated: rowsByKey['wk-12_XXX'],
      short: rowsByKey['wk-19_XXX'],
      narrow: rowsByKey['wk-26_XXX'],
    },
    {
      wide: rowsByKey['wk-6_XXX'],
      abbreviated: rowsByKey['wk-13_XXX'],
      short: rowsByKey['wk-20_XXX'],
      narrow: rowsByKey['wk-27_XXX'],
    },
    {
      wide: rowsByKey['wk-7_XXX'],
      abbreviated: rowsByKey['wk-14_XXX'],
      short: rowsByKey['wk-21_XXX'],
      narrow: rowsByKey['wk-28_XXX'],
    },
  ];
}

export function getDateFieldsData(
  rowsByKey: Record<string, RowData>,
): Record<DateField, DateFieldData> {
  return {
    [DateField.Era]: {
      wide: rowsByKey['dw-1_XXX'],
    },
    [DateField.Year]: {
      wide: rowsByKey['dw-2_XXX'],
      short: rowsByKey['dw-3_XXX'], // Note: French is flipped by accident
      narrow: rowsByKey['dw-4_XXX'],
    },
    [DateField.Quarter]: {
      wide: rowsByKey['dw-5_XXX'],
      short: rowsByKey['dw-6_XXX'],
      narrow: rowsByKey['dw-7_XXX'],
    },
    [DateField.Month]: {
      wide: rowsByKey['dw-8_XXX'],
      short: rowsByKey['dw-9_XXX'],
      narrow: rowsByKey['dw-10_XXX'],
    },
    [DateField.Week]: {
      wide: rowsByKey['dw-11_XXX'],
      short: rowsByKey['dw-12_XXX'],
      narrow: rowsByKey['dw-13_XXX'],
    },
    [DateField.Day]: {
      wide: rowsByKey['dw-14_XXX'],
      short: rowsByKey['dw-15_XXX'],
    },
    [DateField.Hour]: {
      wide: rowsByKey['dw-16_XXX'],
      narrow: rowsByKey['dw-17_XXX'],
    },
    [DateField.Minute]: {
      wide: rowsByKey['dw-18_XXX'],
      narrow: rowsByKey['dw-19_XXX'],
    },
    [DateField.Second]: {
      wide: rowsByKey['dw-20_XXX'],
      short: rowsByKey['dw-21_XXX'],
      narrow: rowsByKey['dw-22_XXX'],
    },
    [DateField.DayOfWeek]: {
      wide: rowsByKey['dw-23_XXX'],
    },
  };
}

export function getRelativeTimeData(rowsByKey: Record<string, RowData>): RelativeTimeData {
  return {
    [DateField.Year]: {
      '-1': rowsByKey['rt-4_XXX'],
      '0': rowsByKey['rt-8_XXX'],
      '1': rowsByKey['rt-12_XXX'],
    },
    [DateField.Month]: {
      '-1': rowsByKey['rt-1_XXX'],
      '0': rowsByKey['rt-5_XXX'],
      '1': rowsByKey['rt-10_XXX'],
    },
    [DateField.Week]: {
      '-1': rowsByKey['rt-2_XXX'],
      '0': rowsByKey['rt-6_XXX'],
      '1': rowsByKey['rt-11_XXX'],
    },
    [DateField.Day]: {
      '-1': rowsByKey['rt-3_XXX'],
      '0': rowsByKey['rt-7_XXX'],
      '1': rowsByKey['rt-9_XXX'],
    },
  };
}

export function getHourMinuteData(rowsByKey: Record<string, RowData>): HourMinuteData {
  return {
    [HourMinuteFormat.HM12]: {
      morning: rowsByKey['hr-4_XXX'],
      evening: rowsByKey['hr-1_XXX'],
    },
    [HourMinuteFormat.HM12TZ]: {
      morning: undefined, // not asked
      evening: rowsByKey['hr-7_XXX'],
    },
    [HourMinuteFormat.HM24]: {
      morning: rowsByKey['hr-2_XXX'],
      evening: rowsByKey['hr-3_XXX'],
    },
    [HourMinuteFormat.HMS24]: {
      morning: rowsByKey['hr-6_XXX'],
      evening: rowsByKey['hr-5_XXX'],
    },
  };
}

export function getTimeIntervalData(rowsByKey: Record<string, RowData>): TimeIntervalData {
  return {
    h12: {
      h: {
        h: rowsByKey['ti-2_XXX'],
        a: rowsByKey['ti-1_XXX'],
      },
      hm: {
        m: rowsByKey['ti-5_XXX'],
        h: rowsByKey['ti-4_XXX'],
        a: rowsByKey['ti-3_XXX'],
      },
      hmv: {
        m: rowsByKey['ti-8_XXX'],
        h: rowsByKey['ti-7_XXX'],
        a: rowsByKey['ti-6_XXX'],
      },
      hv: {
        h: rowsByKey['ti-10_XXX'],
        a: rowsByKey['ti-9_XXX'],
      },
    },
    h12alt: {
      h: {
        h: rowsByKey['ti-18_XXX'],
        a: rowsByKey['ti-17_XXX'],
      },
    },
    h24: {
      h: {
        h: rowsByKey['ti-14_XXX'],
      },
      hm: {
        m: rowsByKey['ti-15_XXX'],
        h: rowsByKey['ti-16_XXX'],
      },
      hmv: {
        m: rowsByKey['ti-12_XXX'],
        h: rowsByKey['ti-11_XXX'],
      },
      hv: {
        h: rowsByKey['ti-13_XXX'],
      },
    },
  };
}

export function getDateCombinationData(rowsByKey: Record<string, RowData>): DateCombinationData {
  return Object.values(rowsByKey).filter((row) => row.key.startsWith('dc-'));
}
