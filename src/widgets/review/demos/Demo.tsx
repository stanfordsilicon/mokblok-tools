import DemoID from './DemoID';
import DemoMonthsGrid from './DemoMonthsGrid';
import DemoMonthsShort from './DemoMonthsShort';
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
      <DemoImage demoID={demoID} />
    </div>
  );
};

const DemoImage: React.FC<{ demoID: DemoID }> = ({ demoID }) => {
  switch (demoID) {
    case DemoID.MonthsGrid:
      return <DemoMonthsGrid />;
    case DemoID.MonthsShort:
      return <DemoMonthsShort />;
  }
};

export default Demo;
