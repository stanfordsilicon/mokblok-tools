import { ErrorBoundary } from 'react-error-boundary';

import DemoDaysOfWeekInMonth from './DemoDaysOfWeekInMonth';
import DemoDaysOfWeekInWeek from './DemoDaysOfWeekInWeek';
import DemoID from './DemoID';
import DemoMonthsGrid from './DemoMonthsGrid';
import DemoMonthsTemp from './DemoMonthsTemp';
import DownloadDemoButton from './DownloadDemoButton';

type Props = {
  demoID: DemoID;
  title: string;
};

const Demo: React.FC<Props> = ({ demoID, title }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div>
        {title}
        <DownloadDemoButton demoID={demoID} />
      </div>
      <div style={{ margin: '1em' }}>
        {/* // Wrap in an error boundary to prevent the whole page from crashing if there's an issue with the demo */}
        <ErrorBoundary fallback={<div style={{ color: 'red' }}>Error loading demo</div>}>
          <DemoImage demoID={demoID} />
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
  }
};

export default Demo;
