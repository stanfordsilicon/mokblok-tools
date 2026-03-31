import { ErrorBoundary } from 'react-error-boundary';

import DemoID from './DemoID';
import DemoLabel from './DemoLabel';
import DemoCoordinatesDirections from './demos/DemoCoordinatesDirections';
import DemoCoordinatesMap from './demos/DemoCoordinatesMap';
import DemoDateFieldBreakdown from './demos/DemoDateFieldBreakdown';
import DemoDaysOfWeekInMonth from './demos/DemoDaysOfWeekInMonth';
import DemoDaysOfWeekInWeek from './demos/DemoDaysOfWeekInWeek';
import DemoMonthsGrid from './demos/DemoMonthsGrid';
import DemoMonthsTemp from './demos/DemoMonthsTemp';
import DemoQuartersCircle from './demos/DemoQuartersCircle';
import DemoQuartersEvents from './demos/DemoQuartersEvents';
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
        <ErrorBoundary fallback={<div style={{ color: 'red' }}>Error loading demo</div>}>
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
    default:
      return <div style={{ color: 'red' }}>Demo not found</div>;
  }
};

export default Demo;
