import { SourceLanguage } from '@data/DataTypes';

import useStoredParams from '@settings/useStoredParams';

import DateFieldsReviewTable from './DateFieldsReviewTable';
import DaysOfWeekReviewTable from './DaysOfWeekReviewTable';
import MonthsReviewTable from './MonthsReviewTable';

const ReviewWidget: React.FC = () => {
  const { value: sourceLanguage, setValue: setSourceLanguage } = useStoredParams<SourceLanguage>(
    'sourceLanguage',
    SourceLanguage.English,
  );

  return (
    <div>
      <div style={{ display: 'flex', gap: '1em', alignItems: 'center' }}>
        Source language:
        {Object.values(SourceLanguage).map((lang) => (
          <button
            key={lang}
            className={lang === sourceLanguage ? 'selected' : ''}
            onClick={() => setSourceLanguage(lang)}
          >
            {/* Convert ID to a readable name */}
            {Object.entries(SourceLanguage).find(([, value]) => value === lang)?.[0]}
          </button>
        ))}
      </div>
      <MonthsReviewTable sourceLanguage={sourceLanguage} />
      <DaysOfWeekReviewTable sourceLanguage={sourceLanguage} />
      <DateFieldsReviewTable sourceLanguage={sourceLanguage} />
    </div>
  );
};

export default ReviewWidget;
