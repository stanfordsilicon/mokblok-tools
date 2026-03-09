import ExportCoreData from './ExportCoreData';
import ExportDatePatterns from './ExportDatePatterns';

const ExportWidget: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
      <ExportCoreData />
      <ExportDatePatterns />
    </div>
  );
};

export default ExportWidget;
