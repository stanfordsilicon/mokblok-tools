import DateFieldsReviewTable from './DateFieldsReviewTable';
import DaysOfWeekReviewTable from './DaysOfWeekReviewTable';
import MonthsReviewTable from './MonthsReviewTable';

const ReviewWidget: React.FC = () => {
  return (
    <div>
      <MonthsReviewTable />
      <DaysOfWeekReviewTable />
      <DateFieldsReviewTable />
    </div>
  );
};

export default ReviewWidget;
