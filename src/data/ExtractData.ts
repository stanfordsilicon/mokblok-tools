import type { RowData } from './DataTypes';

export type MonthData = {
  long: RowData;
  short: RowData;
  narrow: RowData;
};

export function getMonthsData(rowsByExtID: Record<string, RowData>): MonthData[] {
  return [
    {
      long: rowsByExtID['mw-1_XXX'],
      short: rowsByExtID['mw-13_XXX'],
      narrow: rowsByExtID['mw-25_XXX'],
    },
    {
      long: rowsByExtID['mw-2_XXX'],
      short: rowsByExtID['mw-14_XXX'],
      narrow: rowsByExtID['mw-26_XXX'],
    },
    {
      long: rowsByExtID['mw-3_XXX'],
      short: rowsByExtID['mw-15_XXX'],
      narrow: rowsByExtID['mw-27_XXX'],
    },
    {
      long: rowsByExtID['mw-4_XXX'],
      short: rowsByExtID['mw-16_XXX'],
      narrow: rowsByExtID['mw-28_XXX'],
    },
    {
      long: rowsByExtID['mw-5_XXX'],
      short: rowsByExtID['mw-17_XXX'],
      narrow: rowsByExtID['mw-29_XXX'],
    },
    {
      long: rowsByExtID['mw-6_XXX'],
      short: rowsByExtID['mw-18_XXX'],
      narrow: rowsByExtID['mw-30_XXX'],
    },
    {
      long: rowsByExtID['mw-7_XXX'],
      short: rowsByExtID['mw-19_XXX'],
      narrow: rowsByExtID['mw-31_XXX'],
    },
    {
      long: rowsByExtID['mw-8_XXX'],
      short: rowsByExtID['mw-20_XXX'],
      narrow: rowsByExtID['mw-32_XXX'],
    },
    {
      long: rowsByExtID['mw-9_XXX'],
      short: rowsByExtID['mw-21_XXX'],
      narrow: rowsByExtID['mw-33_XXX'],
    },
    {
      long: rowsByExtID['mw-10_XXX'],
      short: rowsByExtID['mw-22_XXX'],
      narrow: rowsByExtID['mw-34_XXX'],
    },
    {
      long: rowsByExtID['mw-11_XXX'],
      short: rowsByExtID['mw-23_XXX'],
      narrow: rowsByExtID['mw-35_XXX'],
    },
    {
      long: rowsByExtID['mw-12_XXX'],
      short: rowsByExtID['mw-24_XXX'],
      narrow: rowsByExtID['mw-36_XXX'],
    },
  ];
}

export type DayOfWeekData = {
  wide: RowData;
  abbreviated: RowData;
  short: RowData;
  narrow: RowData;
};

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
