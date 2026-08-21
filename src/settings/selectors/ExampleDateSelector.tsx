import { useURLParams } from '@settings/URLParams';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

export const DEFAULT_DATE = new Date(1713914064000); // Default to a specific date (e.g., 2024-04-23T12:34:24.000Z)

const ExampleDateSelector: React.FC = () => {
  const { uitext } = useInterfaceTranslation();
  const { dateExample, updateURLParams } = useURLParams();

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '') return;
    const updatedDate = new Date(e.target.value);
    updateURLParams({ dateExample: updatedDate.getTime() });
  };
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '') return;
    const [hours, minutes] = e.target.value.split(':').map(Number);
    const updatedDate = new Date(dateExample ? new Date(dateExample) : DEFAULT_DATE);
    updatedDate.setHours(hours);
    updatedDate.setMinutes(minutes);
    updateURLParams({ dateExample: updatedDate.getTime() });
  };

  const today = dateExample ? new Date(dateExample) : DEFAULT_DATE;
  return (
    <div style={{ display: 'flex', gap: '1em', alignItems: 'center', flexWrap: 'wrap' }}>
      <strong>{uitext('settings.dateExample')}:</strong>
      <input
        type="date"
        value={today.toISOString().split('T')[0]}
        onChange={handleDateChange}
      />{' '}
      <input type="time" value={today.toTimeString().slice(0, 5)} onChange={handleTimeChange} />
      <button onClick={() => updateURLParams({ dateExample: undefined })}>×</button>
    </div>
  );
};

export const useExampleDate = () => {
  const { dateExample } = useURLParams();
  return dateExample ? new Date(dateExample) : DEFAULT_DATE;
};

export default ExampleDateSelector;
