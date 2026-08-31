import React from 'react';

import enforceExhaustiveSwitch from '@shared/enforceExhaustiveSwitch';
import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import DemoID from './DemoID';

const DemoLabel: React.FC<{ demoID: DemoID }> = ({ demoID }) => {
  const { uitext } = useInterfaceTranslation();
  switch (demoID) {
    case DemoID.MonthsGrid:
      return uitext('mocks.Months in a Grid');
    case DemoID.MonthsTemp:
      return uitext('mocks.Temperature') + ' (' + uitext('mocks.12months') + ')';
    case DemoID.DaysOfWeekInMonth:
      return uitext('dataSection.DaysOfWeek') + ' (' + uitext('mocks.monthView') + ')';
    case DemoID.DaysOfWeekInWeek:
      return uitext('dataSection.DaysOfWeek') + ' (' + uitext('mocks.weekView') + ')';
    case DemoID.WeatherInWeek:
      return uitext('mocks.Weather') + ' (' + uitext('mocks.weekView') + ')';
    case DemoID.ClassesThisWeek:
      return uitext('mocks.Classes') + ' ' + uitext('mocks.thisWeek');
    case DemoID.ClassesThisWeekend:
      return uitext('mocks.Classes') + ' ' + uitext('mocks.thisWeekend');
    case DemoID.DateFieldBreakdown:
      return uitext('mocks.Date Field Breakdown');
    case DemoID.CoordinatesMap:
      return uitext('mocks.Location in Map');
    case DemoID.CoordinatesDirections:
      return uitext('mocks.Directions');
    case DemoID.QuartersCircle:
      return uitext('dataSection.Quarters') + ' (' + uitext('mocks.pieChart') + ')';
    case DemoID.QuartersEvents:
      return uitext('dataSection.Quarters') + ' (' + uitext('mocks.events') + ')';
    case DemoID.DateInterval_InMonth_MEd:
      return uitext('mocks.Date Interval') + ' (' + uitext('mocks.withinMonth') + ' 1)';
    case DemoID.DateInterval_InMonth_MMMd:
      return uitext('mocks.Date Interval') + ' (' + uitext('mocks.withinMonth') + ' 2)';
    case DemoID.DateInterval_InMonth_MMMEd:
      return uitext('mocks.Date Interval') + ' (' + uitext('mocks.withinMonth') + ' 3)';
    case DemoID.DateInterval_InMonth_yMMMd:
      return uitext('mocks.Date Interval') + ' (' + uitext('mocks.withinMonth') + ' 4)';
    case DemoID.DateInterval_InMonth_yMMMEd:
      return uitext('mocks.Date Interval') + ' (' + uitext('mocks.withinMonth') + ' 5)';
    case DemoID.TimeInterval24HourMin:
      return uitext('dataSection.TimeIntervals') + ' (' + uitext('review.24hClock') + ')';
    case DemoID.TimeInterval12HourMin:
      return uitext('dataSection.TimeIntervals') + ' (' + uitext('review.12hClock') + ')';
    case DemoID.TimeInterval24HourMinTimezone:
      return (
        uitext('dataSection.TimeIntervals') +
        ' (' +
        uitext('review.24hClock') +
        ', ' +
        uitext('mocks.withTimezone') +
        ')'
      );
    case DemoID.TimeInterval12HourMinTimezone:
      return (
        uitext('dataSection.TimeIntervals') +
        ' (' +
        uitext('review.12hClock') +
        ', ' +
        uitext('mocks.withTimezone') +
        ')'
      );
    case DemoID.TimeInterval24HourOnly:
      return (
        uitext('dataSection.TimeIntervals') +
        ' (' +
        uitext('review.24hClock') +
        ', ' +
        uitext('mocks.hoursOnly') +
        ')'
      );
    case DemoID.TimeInterval12HourOnly:
      return (
        uitext('dataSection.TimeIntervals') +
        ' (' +
        uitext('review.12hClock') +
        ', ' +
        uitext('mocks.hoursOnly') +
        ')'
      );
    case DemoID.EraTimelineReligious:
      return uitext('mocks.EraTimelineReligious');
    case DemoID.EraTimelineSecular:
      return uitext('mocks.EraTimelineSecular');
    case DemoID.RelativeTimeEventEnd:
      return uitext('mocks.RelativeTimeEventEnd');
    case DemoID.EmojiKeyboardSuggestions:
      return uitext('mocks.EmojiKeyboardSuggestions');
    case DemoID.EmojiExplanations:
      return uitext('mocks.EmojiExplanations');
    default:
      enforceExhaustiveSwitch(demoID);
  }
};

export default DemoLabel;
