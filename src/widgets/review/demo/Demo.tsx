import ErrorBoundary from '@shared/ErrorBoundary';

import DemoID from './DemoID';
import DemoLabel from './DemoLabel';
import DemoCoordinatesDirections from './demos/DemoCoordinatesDirections';
import DemoCoordinatesMap from './demos/DemoCoordinatesMap';
import DemoDateFieldBreakdown from './demos/DemoDateFieldBreakdown';
import DemoDaysOfWeekInMonth from './demos/DemoDaysOfWeekInMonth';
import DemoDaysOfWeekInWeek from './demos/DemoDaysOfWeekInWeek';
import DemoEraTimeline from './demos/DemoEraTimeline';
import DemoMonthlyCalendar from './demos/DemoMonthlyCalendar';
import DemoMonthsGrid from './demos/DemoMonthsGrid';
import DemoMonthsTemp from './demos/DemoMonthsTemp';
import DemoQuartersCircle from './demos/DemoQuartersCircle';
import DemoQuartersEvents from './demos/DemoQuartersEvents';
import DemoTimeInterval from './demos/DemoTimeInterval';
import DemoSVG from './DemoSVG';
import DownloadDemoButton from './DownloadDemoButton';

type Props = {
  demoID: DemoID;
};

const Demo: React.FC<Props> = ({ demoID }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div>
        <DemoLabel demoID={demoID} />
        <DownloadDemoButton demoID={demoID} />
      </div>
      <div style={{ margin: '1em' }}>
        {/* // Wrap in an error boundary to prevent the whole page from crashing if there's an issue with the demo */}
        <ErrorBoundary>
          <DemoSVG id={demoID} height={240} width={240}>
            <DemoImage demoID={demoID} />
          </DemoSVG>
        </ErrorBoundary>
      </div>
    </div>
  );
};

const DemoImage: React.FC<{ demoID: DemoID }> = ({ demoID }) => {
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
    default:
      return <div style={{ color: 'red' }}>Demo not found</div>;
  }
};

export default Demo;
