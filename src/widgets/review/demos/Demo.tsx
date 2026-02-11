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
        <DemoImage demoID={demoID} />
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
  }
};

export default Demo;
