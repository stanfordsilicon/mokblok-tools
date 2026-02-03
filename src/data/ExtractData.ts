import {
  DateField,
  type DateFieldData,
  type DayOfWeekData,
  type MonthData,
  type RowData,
} from './DataTypes';

export function getMonthsData(rowsByExtID: Record<string, RowData>): MonthData[] {
  return [
    {
      wide: rowsByExtID['mw-1_XXX'],
      abbreviated: rowsByExtID['mw-13_XXX'],
      narrow: rowsByExtID['mw-25_XXX'],
    },
    {
      wide: rowsByExtID['mw-2_XXX'],
      abbreviated: rowsByExtID['mw-14_XXX'],
      narrow: rowsByExtID['mw-26_XXX'],
    },
    {
      wide: rowsByExtID['mw-3_XXX'],
      abbreviated: rowsByExtID['mw-15_XXX'],
      narrow: rowsByExtID['mw-27_XXX'],
    },
    {
      wide: rowsByExtID['mw-4_XXX'],
      abbreviated: rowsByExtID['mw-16_XXX'],
      narrow: rowsByExtID['mw-28_XXX'],
    },
    {
      wide: rowsByExtID['mw-5_XXX'],
      abbreviated: rowsByExtID['mw-17_XXX'],
      narrow: rowsByExtID['mw-29_XXX'],
    },
    {
      wide: rowsByExtID['mw-6_XXX'],
      abbreviated: rowsByExtID['mw-18_XXX'],
      narrow: rowsByExtID['mw-30_XXX'],
    },
    {
      wide: rowsByExtID['mw-7_XXX'],
      abbreviated: rowsByExtID['mw-19_XXX'],
      narrow: rowsByExtID['mw-31_XXX'],
    },
    {
      wide: rowsByExtID['mw-8_XXX'],
      abbreviated: rowsByExtID['mw-20_XXX'],
      narrow: rowsByExtID['mw-32_XXX'],
    },
    {
      wide: rowsByExtID['mw-9_XXX'],
      abbreviated: rowsByExtID['mw-21_XXX'],
      narrow: rowsByExtID['mw-33_XXX'],
    },
    {
      wide: rowsByExtID['mw-10_XXX'],
      abbreviated: rowsByExtID['mw-22_XXX'],
      narrow: rowsByExtID['mw-34_XXX'],
    },
    {
      wide: rowsByExtID['mw-11_XXX'],
      abbreviated: rowsByExtID['mw-23_XXX'],
      narrow: rowsByExtID['mw-35_XXX'],
    },
    {
      wide: rowsByExtID['mw-12_XXX'],
      abbreviated: rowsByExtID['mw-24_XXX'],
      narrow: rowsByExtID['mw-36_XXX'],
    },
  ];
}

export function getDaysOfWeekData(rowsByExtID: Record<string, RowData>): DayOfWeekData[] {
  console.log({ rowsByExtID });
  return [
    {
      wide: rowsByExtID['wk-1_XXX'],
      abbreviated: rowsByExtID['wk-8_XXX'],
      short: rowsByExtID['wk-15_XXX'],
      narrow: rowsByExtID['wk-22_XXX'],
    },
    {
      wide: rowsByExtID['wk-2_XXX'],
      abbreviated: rowsByExtID['wk-9_XXX'],
      short: rowsByExtID['wk-16_XXX'],
      narrow: rowsByExtID['wk-23_XXX'],
    },
    {
      wide: rowsByExtID['wk-3_XXX'],
      abbreviated: rowsByExtID['wk-10_XXX'],
      short: rowsByExtID['wk-17_XXX'],
      narrow: rowsByExtID['wk-24_XXX'],
    },
    {
      wide: rowsByExtID['wk-4_XXX'],
      abbreviated: rowsByExtID['wk-11_XXX'],
      short: rowsByExtID['wk-18_XXX'],
      narrow: rowsByExtID['wk-25_XXX'],
    },
    {
      wide: rowsByExtID['wk-5_XXX'],
      abbreviated: rowsByExtID['wk-12_XXX'],
      short: rowsByExtID['wk-19_XXX'],
      narrow: rowsByExtID['wk-26_XXX'],
    },
    {
      wide: rowsByExtID['wk-6_XXX'],
      abbreviated: rowsByExtID['wk-13_XXX'],
      short: rowsByExtID['wk-20_XXX'],
      narrow: rowsByExtID['wk-27_XXX'],
    },
    {
      wide: rowsByExtID['wk-7_XXX'],
      abbreviated: rowsByExtID['wk-14_XXX'],
      short: rowsByExtID['wk-21_XXX'],
      narrow: rowsByExtID['wk-28_XXX'],
    },
  ];
}

export function getDateFieldsData(
  rowsByExtID: Record<string, RowData>,
): Record<DateField, DateFieldData> {
  return {
    [DateField.Era]: {
      wide: rowsByExtID['dw-1_XXX'],
    },
    [DateField.Year]: {
      wide: rowsByExtID['dw-2_XXX'],
      short: rowsByExtID['dw-3_XXX'], // Note: French is flipped by accident
      narrow: rowsByExtID['dw-4_XXX'],
    },
    [DateField.Quarter]: {
      wide: rowsByExtID['dw-5_XXX'],
      short: rowsByExtID['dw-6_XXX'],
      narrow: rowsByExtID['dw-7_XXX'],
    },
    [DateField.Month]: {
      wide: rowsByExtID['dw-8_XXX'],
      short: rowsByExtID['dw-9_XXX'],
      narrow: rowsByExtID['dw-10_XXX'],
    },
    [DateField.Week]: {
      wide: rowsByExtID['dw-11_XXX'],
      short: rowsByExtID['dw-12_XXX'],
      narrow: rowsByExtID['dw-13_XXX'],
    },
    [DateField.Day]: {
      wide: rowsByExtID['dw-14_XXX'],
      short: rowsByExtID['dw-15_XXX'],
    },
    [DateField.Hour]: {
      wide: rowsByExtID['dw-16_XXX'],
      narrow: rowsByExtID['dw-17_XXX'],
    },
    [DateField.Minute]: {
      wide: rowsByExtID['dw-18_XXX'],
      narrow: rowsByExtID['dw-19_XXX'],
    },
    [DateField.Second]: {
      wide: rowsByExtID['dw-20_XXX'],
      short: rowsByExtID['dw-21_XXX'],
      narrow: rowsByExtID['dw-22_XXX'],
    },
    [DateField.DayOfWeek]: {
      wide: rowsByExtID['dw-23_XXX'],
    },
  };
}
