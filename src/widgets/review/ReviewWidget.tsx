import { useSettings } from '@settings/Settings';

import DateFieldsReviewTable from './tables/DateFieldsReviewTable';
import DaysOfWeekReviewTable from './tables/DaysOfWeekReviewTable';
import HourMinuteReviewTable from './tables/HourMinuteReviewTable';
import MonthsReviewTable from './tables/MonthsReviewTable';
import RelativeTimeReviewTable from './tables/RelativeTimeReviewTable';

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
      <div>
        Set today (using browser date picker):{' '}
        <input type="date" value={today.toISOString().split('T')[0]} onChange={handleDateChange} />{' '}
        <input type="time" value={today.toTimeString().slice(0, 5)} onChange={handleTimeChange} />
      </div>
      <MonthsReviewTable />
      <DaysOfWeekReviewTable />
      <DateFieldsReviewTable />
      <RelativeTimeReviewTable />
      <HourMinuteReviewTable />
    </div>
  );
};

export default ReviewWidget;
