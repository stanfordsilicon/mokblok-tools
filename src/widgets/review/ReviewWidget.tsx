import { useSettings } from '@settings/Settings';

import DownloadAllDemos from './demos/DownloadAllDemos';
import CoordinatesReviewTable from './tables/CoordinatesReviewTable';
import DateCombinationsReviewTable from './tables/DateCombinationsReviewTable';
import DateFieldsReviewTable from './tables/DateFieldsReviewTable';
import DaysOfWeekReviewTable from './tables/DaysOfWeekReviewTable';
import EraReviewTable from './tables/EraReviewTable';
import MonthsReviewTable from './tables/MonthsReviewTable';
import QuartersReviewTable from './tables/QuartersReviewTable';
import RelativeTimeReviewTable from './tables/RelativeTimeReviewTable';
import TimeCombinationseReviewTable from './tables/TimeCombinationsReviewTable';
import TimeIntervalReviewTable from './tables/TimeIntervalReviewTable';

const ReviewWidget: React.FC = () => {
  const { today, setToday } = useSettings();
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '') return;
    const date = new Date(e.target.value);
    setToday(date);
  };
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '') return;
    const [hours, minutes] = e.target.value.split(':').map(Number);
    const updatedDate = new Date(today);
    updatedDate.setHours(hours);
    updatedDate.setMinutes(minutes);
    setToday(updatedDate);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          Set today (using browser date picker):{' '}
          <input
            type="date"
            value={today.toISOString().split('T')[0]}
            onChange={handleDateChange}
          />{' '}
          <input type="time" value={today.toTimeString().slice(0, 5)} onChange={handleTimeChange} />
        </div>
        <DownloadAllDemos />
      </div>
      <MonthsReviewTable />
      <DaysOfWeekReviewTable />
      <DateFieldsReviewTable />
      <RelativeTimeReviewTable />
      <TimeCombinationseReviewTable />
      <TimeIntervalReviewTable />
      <DateCombinationsReviewTable />
      <QuartersReviewTable />
      <CoordinatesReviewTable />
      <EraReviewTable />
    </div>
  );
};

export default ReviewWidget;
