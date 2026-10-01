import { DataSection } from '@data/DataSection';

import ErrorBoundary from '@shared/ErrorBoundary';
import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import DemoID from './DemoID';
import DemoLabel from './DemoLabel';
import DemoClassesThisWeek from './demos/DemoClassesThisWeek';
import DemoCoordinatesDirections from './demos/DemoCoordinatesDirections';
import DemoCoordinatesMap from './demos/DemoCoordinatesMap';
import DemoDateCombination from './demos/DemoDateCombination';
import DemoDateFieldBreakdown from './demos/DemoDateFieldBreakdown';
import DemoDaysOfWeekInMonth from './demos/DemoDaysOfWeekInMonth';
import DemoDaysOfWeekInWeek from './demos/DemoDaysOfWeekInWeek';
import DemoEmojiKeyboardSuggestions from './demos/DemoEmojiKeyboardSuggestions';
import DemoEraTimeline from './demos/DemoEraTimeline';
import DemoMonthlyCalendar from './demos/DemoMonthlyCalendar';
import DemoMonthsGrid from './demos/DemoMonthsGrid';
import DemoMonthsTemp from './demos/DemoMonthsTemp';
import DemoQuartersCircle from './demos/DemoQuartersCircle';
import DemoQuartersEvents from './demos/DemoQuartersEvents';
import DemoRelativeTimeEventEnd from './demos/DemoRelativeTimeEventEnd';
import DemoSelector from './demos/DemoSelector';
import DemoTimeClockAnnotated from './demos/DemoTimeClockAnnotated';
import DemoTimeInterval from './demos/DemoTimeInterval';
import DemoTimeMeetingsToday from './demos/DemoTimeMeetingsToday';
import DemoWeatherInWeek from './demos/DemoWeatherInWeek';
import DemoSVG from './DemoSVG';
import DownloadDemoButton from './DownloadDemoButton';

type Props = {
  demoID: DemoID;
};

const Demo: React.FC<Props> = ({ demoID }) => {
  return (
    <article className="group flex min-w-0 flex-col items-center">
      <div className="flex min-h-10 items-center justify-between gap-3">
        <div className="min-w-0 text-sm text-(--silicon-ink)">
          <DemoLabel demoID={demoID} />
        </div>
        <div className="shrink-0 opacity-70 transition group-hover:opacity-100">
          <DownloadDemoButton demoID={demoID} />
        </div>
      </div>
      <div className="mx-auto w-full max-w-[18rem] [&_svg]:mx-auto [&_svg]:block [&_svg]:h-auto [&_svg]:w-full">
        {/* // Wrap in an error boundary to prevent the whole page from crashing if there's an issue with the demo */}
        <ErrorBoundary>
          <DemoSVG id={demoID} height={240} width={240}>
            <DemoImage demoID={demoID} />
          </DemoSVG>
        </ErrorBoundary>
      </div>
    </article>
  );
};

const DemoImage: React.FC<{ demoID: DemoID }> = ({ demoID }) => {
  const { uitext } = useInterfaceTranslation();
  switch (demoID) {
    case DemoID.MonthsGrid:
      return <DemoMonthsGrid />;
    case DemoID.MonthsTemp:
      return <DemoMonthsTemp />;
    case DemoID.DaysOfWeekInMonth:
      return <DemoDaysOfWeekInMonth />;
    case DemoID.DaysOfWeekInWeek:
      return <DemoDaysOfWeekInWeek />;
    case DemoID.DateFieldBreakdown:
      return <DemoDateFieldBreakdown />;
    case DemoID.DateCombination_Md:
      return <DemoDateCombination instance="Md" />;
    case DemoID.DateCombination_MEd:
      return <DemoDateCombination instance="MEd" />;
    case DemoID.DateCombination_MMMd:
      return <DemoDateCombination instance="MMMd" />;
    case DemoID.DateCombination_yMd:
      return <DemoDateCombination instance="yMd" />;
    case DemoID.DateCombination_yMMMEd:
      return <DemoDateCombination instance="yMMMEd" />;
    case DemoID.CoordinatesMap:
      return <DemoCoordinatesMap />;
    case DemoID.CoordinatesDirections:
      return <DemoCoordinatesDirections />;
    case DemoID.QuartersCircle:
      return <DemoQuartersCircle />;
    case DemoID.QuartersEvents:
      return <DemoQuartersEvents />;
    case DemoID.DateInterval_InMonth_MEd:
    case DemoID.DateInterval_InMonth_MMMd:
    case DemoID.DateInterval_InMonth_MMMEd:
    case DemoID.DateInterval_InMonth_yMMMd:
    case DemoID.DateInterval_InMonth_yMMMEd:
      return (
        <DemoMonthlyCalendar
          query={{ field: 'intervalFormats', variant: 'd', instance: demoID.split('_').pop() }}
        />
      );
    case DemoID.TimeInterval24HourMin:
      return <DemoTimeInterval pattern="Hm" />;
    case DemoID.TimeInterval12HourMin:
      return <DemoTimeInterval pattern="hm" />;
    case DemoID.TimeInterval24HourMinTimezone:
      return <DemoTimeInterval pattern="Hmv" />;
    case DemoID.TimeInterval12HourMinTimezone:
      return <DemoTimeInterval pattern="hmv" />;
    case DemoID.TimeInterval24HourOnly:
      return <DemoTimeInterval pattern="H" />;
    case DemoID.TimeInterval12HourOnly:
      return <DemoTimeInterval pattern="h" />;
    case DemoID.EraTimelineReligious:
      return <DemoEraTimeline variant="" />;
    case DemoID.EraTimelineSecular:
      return <DemoEraTimeline variant="variant" />;
    case DemoID.RelativeTimeEventEnd:
      return <DemoRelativeTimeEventEnd />;
    case DemoID.EmojiKeyboardSuggestions:
      return <DemoEmojiKeyboardSuggestions includeAnnotations={false} />;
    case DemoID.EmojiExplanations:
      return <DemoEmojiKeyboardSuggestions includeAnnotations={true} />;
    case DemoID.WeatherInWeek:
      return <DemoWeatherInWeek />;
    case DemoID.ClassesThisWeek:
      return <DemoClassesThisWeek period="week" />;
    case DemoID.ClassesThisWeekend:
      return <DemoClassesThisWeek period="weekend" />;
    case DemoID.DaysOfWeekSelector:
      return (
        <DemoSelector entryFilter={{ section: DataSection.DaysOfWeek, field: 'E', length: 'w' }} />
      );
    case DemoID.MonthsSelector:
      return (
        <DemoSelector entryFilter={{ section: DataSection.Months, field: 'M', length: 'w' }} />
      );
    case DemoID.LanguageNamesSelector:
      return <DemoSelector entryFilter={{ section: DataSection.LanguageNames, group: '' }} />;
    case DemoID.RegionsContinentSelector:
      return <DemoSelector entryFilter={{ section: DataSection.Regions, group: 'Continent' }} />;
    case DemoID.TimezonesCitySelector:
      return <DemoSelector entryFilter={{ field: 'zone', variant: '', group: 'Africa' }} />;
    case DemoID.TimezonesSelector:
      return (
        <DemoSelector entryFilter={{ field: 'metazone', variant: 'standard', group: 'Africa' }} />
      );
    case DemoID.TimeMeetingsToday12h:
      return <DemoTimeMeetingsToday hourFormat="12h" />;
    case DemoID.TimeMeetingsToday24h:
      return <DemoTimeMeetingsToday hourFormat="24h" />;
    case DemoID.TimeClockAnnotatedMorning:
      return <DemoTimeClockAnnotated period="morning" />;
    case DemoID.TimeClockAnnotatedAfternoon:
      return <DemoTimeClockAnnotated period="afternoon" />;
    case DemoID.TimeClockAnnotatedEvening:
      return <DemoTimeClockAnnotated period="evening" />;
    case DemoID.TimeClockAnnotatedMidnight:
      return <DemoTimeClockAnnotated period="midnight" />;
    default:
      return <div style={{ color: 'red' }}>{uitext('errors.demoNotFound')}</div>;
  }
};

export default Demo;
