import { useTranslation } from 'react-i18next';

import { DataSection } from '@data/DataSection';

import ErrorBoundary from '@shared/ErrorBoundary';

import DemosForSection from './demo/DemosForSection';
import AlphabetReview from './tables/AlphabetReview';
import CLDRTicketReviewTable from './tables/CLDRTicketReviewTable';
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
import AllReviewTable from './tables/FullReviewTable';
import LanguageNamesReviewTable from './tables/LanguageNamesReviewTable';
import MathsReviewTable from './tables/MathsReviewTable';
import MonthsReviewTable from './tables/MonthsReviewTable';
import ParagraphsReviewTable from './tables/ParagraphsReviewTable';
import PluralsReviewTable from './tables/PluralsReviewTable';
import QuartersReviewTable from './tables/QuartersReviewTable';
import QuotesReviewTable from './tables/QuotesReviewTable';
import RegionsReviewTable from './tables/RegionsReviewTable';
import RelativeTimeReviewTable from './tables/RelativeTimeReviewTable';
import SymbolsReviewTable from './tables/SymbolsReviewTable';
import TechWordsReviewTable from './tables/TechWordsReviewTable';
import TimeCombinationsReviewTable from './tables/TimeCombinationsReviewTable';
import TimeIntervalsReviewTable from './tables/TimeIntervalsReviewTable';
import TimezonesReviewTable from './tables/TimezonesReviewTable';

function ReviewSection({ dataSection }: { dataSection: DataSection }) {
  const { t } = useTranslation();
  return (
    <div>
      <h2 style={{ margin: '.5em 0' }}>{t(`dataSection.${dataSection}`)}</h2>
      <div style={{ display: 'flex', gap: '1em', flexDirection: 'row' }}>
        <div>
          <ErrorBoundary>
            <ReviewTable dataSection={dataSection} />
          </ErrorBoundary>
        </div>
        <div style={{ display: 'flex', gap: '1em', flexWrap: 'wrap', placeContent: 'start' }}>
          <DemosForSection dataSection={dataSection} />
        </div>
      </div>
    </div>
  );
}

function ReviewTable({ dataSection }: { dataSection: DataSection }) {
  switch (dataSection) {
    case DataSection.All:
      return null;
    case DataSection.Alphabet:
      return <AlphabetReview />;
    case DataSection.CLDRTicket:
      return <CLDRTicketReviewTable />;
    case DataSection.Coordinates:
      return <CoordinatesReviewTable />;
    case DataSection.DateCombinations:
      return <DateCombinationsReviewTable />;
    case DataSection.DateIntervals:
      return <DateIntervalsReviewTable />;
    case DataSection.DateFields:
      return <DateFieldsReviewTable />;
    case DataSection.DateTimeCombinations:
      return <DateTimeCombinationsReviewTable />;
    case DataSection.DayPeriods:
      return <DayPeriodsReviewTable />;
    case DataSection.DaysOfWeek:
      return <DaysOfWeekReviewTable />;
    case DataSection.DirectionExamples:
      return <DirectionsReviewTable />;
    case DataSection.Emojis:
      return <EmojisReviewTable />;
    case DataSection.Eras:
      return <ErasReviewTable />;
    case DataSection.EraDateCombinations:
      return <EraDatesReviewTable />;
    case DataSection.LanguageNames:
      return <LanguageNamesReviewTable />;
    case DataSection.Maths:
      return <MathsReviewTable />;
    case DataSection.Months:
      return <MonthsReviewTable />;
    case DataSection.Paragraphs:
      return <ParagraphsReviewTable />;
    case DataSection.Plurals:
      return <PluralsReviewTable />;
    case DataSection.Quarters:
      return <QuartersReviewTable />;
    case DataSection.Quotes:
      return <QuotesReviewTable />;
    case DataSection.Regions:
      return <RegionsReviewTable />;
    case DataSection.RelativeTime:
      return <RelativeTimeReviewTable />;
    case DataSection.Symbols:
      return <SymbolsReviewTable />;
    case DataSection.TechWords:
      return <TechWordsReviewTable />;
    case DataSection.TimeCombinations:
      return <TimeCombinationsReviewTable />;
    case DataSection.TimeIntervals:
      return <TimeIntervalsReviewTable />;
    case DataSection.Timezones:
      return <TimezonesReviewTable />;
    case DataSection.FullTable:
      return <AllReviewTable />;
  }
}

export default ReviewSection;
