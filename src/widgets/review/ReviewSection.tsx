import { useCallback, useDeferredValue, useMemo } from 'react';

import { DataContext } from '@data/DataContext';
import { DataPage, DataSection } from '@data/DataSection';
import type { DataEntry } from '@data/DataTypes';
import { useSourceDataContext } from '@data/SourceDataProvider';
import { useTargetDataContext } from '@data/TargetDataProvider';

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

function ReviewSection({ dataSection }: { dataSection: DataSection }) {
  const { uitext } = useInterfaceTranslation();
  const completion = useCompletionForSection(DataPage.All, dataSection);

  const ratioComplete = uitext('review.progress.ratioComplete', {
    completed: completion.completed,
    inCoverage: completion.inCoverage,
  });

  return (
    <div>
      <h2 style={{ margin: '.5em 0' }}>
        {uitext(`dataSection.${dataSection}`)} <span className="text-sm">{ratioComplete}</span>
      </h2>
      <div style={{ display: 'flex', gap: '1em', flexDirection: 'row', flexWrap: 'wrap' }}>
        <div>
          <ErrorBoundary>
            <ReviewTable dataSection={dataSection} />
          </ErrorBoundary>
        </div>
        <div
          className="flex flex-wrap gap-4"
          style={{
            placeContent: 'start',
            maxWidth: '950px',
          }}
        >
          <DeferredDemoDataProvider>
            <DemosForSection dataSection={dataSection} />
          </DeferredDemoDataProvider>
        </div>
      </div>
    </div>
  );
}

function DeferredDemoDataProvider({ children }: { children: React.ReactNode }) {
  const { alphabet, translations } = useTargetDataContext();
  const { findDataEntries, findDataEntry, getSourceData } = useSourceDataContext();
  const deferredTranslations = useDeferredValue(translations);

  const getDeferredTranslation = useCallback(
    (entry: DataEntry | undefined, fallback = true): string => {
      if (!entry) return '';
      const info = deferredTranslations[entry.index];
      if (!info) return '';
      return info.edit ?? info.translation ?? (fallback ? info.source : '');
    },
    [deferredTranslations],
  );

  const dataContext = useMemo(
    () => ({
      alphabet,
      findDataEntry,
      findDataEntries,
      getSourceData,
      getTranslation: getDeferredTranslation,
    }),
    [alphabet, findDataEntry, findDataEntries, getDeferredTranslation, getSourceData],
  );

  return <DataContext.Provider value={dataContext}>{children}</DataContext.Provider>;
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
