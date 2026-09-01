import { DataPage, DataSection } from '@data/DataSection';

import StepName from '@settings/StepName';
import { useURLParams } from '@settings/URLParams';

import ErrorBoundary from '@shared/ErrorBoundary';
import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import DemosForSection from './demo/DemosForSection';
import AllReviewTable from './fulltable/FullReviewTable';
import { useCompletionForSection } from './getDataEntriesForSection';
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
import useAdjacentSections from './useAdjacentSections';

function ReviewSection({ dataSection }: { dataSection: DataSection }) {
  const { uitext } = useInterfaceTranslation();
  const { step, section } = useURLParams();
  const completion = useCompletionForSection(DataPage.All, dataSection);
  const { nextSection, previousSection, goToNextSection, goToPreviousSection } =
    useAdjacentSections();

  if (completion.overall === 0) return null;

  return (
    <div>
      <div role="heading" aria-level={2} className="flex flex-row gap-2 place-items-end my-2">
        <div className="text-2xl">{uitext(`dataSection.${dataSection}`)}</div>
        <div className="text-sm">
          {completion.translations.count} / {completion.overall}{' '}
          {uitext('nav.translations').toLowerCase()}
        </div>
        {step === StepName.Vote && (
          <div className="text-sm">
            {completion.votes.accepted + completion.votes.rejected} / {completion.votes.total}{' '}
            {uitext('nav.votes').toLowerCase()}
          </div>
        )}
        {section !== DataSection.All && (
          <div className="text-xs">
            {previousSection && (
              <button style={{ padding: '0 5px' }} onClick={goToPreviousSection}>
                &lt; {uitext('nav.previous')}
              </button>
            )}
            {nextSection && (
              <button style={{ padding: '0 5px' }} onClick={goToNextSection}>
                {uitext('nav.next')} &gt;
              </button>
            )}
          </div>
        )}
      </div>
      <div className="flex flex-row gap-4 flex-wrap">
        <div>
          <ErrorBoundary>
            <ReviewTable dataSection={dataSection} />
          </ErrorBoundary>
        </div>
        <div
          className="flex flex-wrap gap-4 place-content-start"
          style={{
            maxWidth: '950px',
          }}
        >
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
    case DataSection.Dates:
      return <DateCombinationsReviewTable />;
    case DataSection.DateIntervals:
      return <DateIntervalsReviewTable />;
    case DataSection.DateFields:
      return <DateFieldsReviewTable />;
    case DataSection.DateTimes:
      return <DateTimeCombinationsReviewTable />;
    case DataSection.DayPeriods:
      return <DayPeriodsReviewTable />;
    case DataSection.DaysOfWeek:
      return <DaysOfWeekReviewTable />;
    case DataSection.DirectionExamples:
      return <DirectionsReviewTable />;
    case DataSection.Emoji:
      return <EmojisReviewTable />;
    case DataSection.Eras:
      return <ErasReviewTable />;
    case DataSection.EraDates:
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
    case DataSection.Times:
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
