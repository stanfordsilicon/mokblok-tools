import DataTypeLabel from '@data/DataTypeLabel';
import { DataType } from '@data/DataTypes';

import ErrorBoundary from '@shared/ErrorBoundary';

import DemosForDataType from './demo/DemosForDataType';
import AllReviewTable from './tables/AllReviewTable';
import AlphabetReview from './tables/AlphabetReview';
import CoordinatesReviewTable from './tables/CoordinatesReviewTable';
import DateCombinationsReviewTable from './tables/DateCombinationsReviewTable';
import DateFieldsReviewTable from './tables/DateFieldsReviewTable';
import DateIntervalsReviewTable from './tables/DateIntervalsReviewTable';
import DateTimeCombinationsReviewTable from './tables/DateTimeCombinationsReviewTable';
import DayPeriodsReviewTable from './tables/DayPeriodsReviewTable';
import DaysOfWeekReviewTable from './tables/DaysOfWeekReviewTable';
import DirectionsReviewTable from './tables/DirectionsReviewTable';
import EmojisReviewTable from './tables/EmojisReviewTable';
import EraDatesReviewTable from './tables/EraDatesReviewTable';
import ErasReviewTable from './tables/ErasReviewTable';
import MathsReviewTable from './tables/MathsReviewTable';
import MonthsReviewTable from './tables/MonthsReviewTable';
import QuartersReviewTable from './tables/QuartersReviewTable';
import QuotesReviewTable from './tables/QuotesReviewTable';
import RelativeTimeReviewTable from './tables/RelativeTimeReviewTable';
import SymbolsReviewTable from './tables/SymbolsReviewTable';
import TimeCombinationsReviewTable from './tables/TimeCombinationsReviewTable';
import TimeIntervalsReviewTable from './tables/TimeIntervalsReviewTable';

function ReviewSection({ dataType }: { dataType: DataType }) {
  return (
    <div>
      <h2 style={{ margin: '.5em 0' }}>
        <DataTypeLabel dataType={dataType} />
      </h2>
      <div style={{ display: 'flex', gap: '1em', flexDirection: 'row' }}>
        <div>
          <ErrorBoundary>
            <ReviewTable dataType={dataType} />
          </ErrorBoundary>
        </div>
        <div style={{ display: 'flex', gap: '1em', flexWrap: 'wrap', placeContent: 'start' }}>
          <DemosForDataType dataType={dataType} />
        </div>
      </div>
    </div>
  );
}

function ReviewTable({ dataType }: { dataType: DataType }) {
  switch (dataType) {
    case DataType.Alphabet:
      return <AlphabetReview />;
    case DataType.Coordinates:
      return <CoordinatesReviewTable />;
    case DataType.DateCombinations:
      return <DateCombinationsReviewTable />;
    case DataType.DateIntervals:
      return <DateIntervalsReviewTable />;
    case DataType.DateFields:
      return <DateFieldsReviewTable />;
    case DataType.DateTimeCombinations:
      return <DateTimeCombinationsReviewTable />;
    case DataType.DayPeriods:
      return <DayPeriodsReviewTable />;
    case DataType.DaysOfWeek:
      return <DaysOfWeekReviewTable />;
    case DataType.DirectionExamples:
      return <DirectionsReviewTable />;
    case DataType.Emojis:
      return <EmojisReviewTable />;
    case DataType.Eras:
      return <ErasReviewTable />;
    case DataType.EraDateCombinations:
      return <EraDatesReviewTable />;
    case DataType.Maths:
      return <MathsReviewTable />;
    case DataType.Months:
      return <MonthsReviewTable />;
    case DataType.Quarters:
      return <QuartersReviewTable />;
    case DataType.Quotes:
      return <QuotesReviewTable />;
    case DataType.RelativeTime:
      return <RelativeTimeReviewTable />;
    case DataType.Symbols:
      return <SymbolsReviewTable />;
    case DataType.TimeCombinations:
      return <TimeCombinationsReviewTable />;
    case DataType.TimeIntervals:
      return <TimeIntervalsReviewTable />;
    case DataType.All:
      return <AllReviewTable />;
  }
}

export default ReviewSection;
