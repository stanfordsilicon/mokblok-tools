// Ordered from larger to smaller (and time-zone last)
export enum DateField {
  Era = 'G',
  Year = 'y',
  Quarter = 'q',
  Month = 'M',
  Week = 'w',
  DayOfWeek = 'E',
  Day = 'd',
  DayPeriod = 'a', // am/pm
  Hour = 'h',
  Minute = 'm',
  Second = 's',
  Timezone = 'v',
}
