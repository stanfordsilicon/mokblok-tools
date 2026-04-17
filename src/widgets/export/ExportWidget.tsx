import ExportCoreData from './ExportCoreData';
import ExportXMLData from './ExportXMLData';

const ExportWidget: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
      <ExportCoreData />
      <ExportXMLData />
    </div>
  );
};

export default ExportWidget;
