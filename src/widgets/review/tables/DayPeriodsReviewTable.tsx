import { useTranslation } from 'react-i18next';

import { useDataContext } from '@data/DataContext';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import { matrixBy } from '@shared/setUtils';

import InputDataCell from '../InputDataCell';
import SourceDataCell from '../SourceDataCell';

const amPMs = ['am', 'pm'];
const dayPeriods = ['morning1', 'afternoon1', 'evening1', 'night1', 'midnight'];

const DayPeriodsReviewTable = () => {
  const { findDataFields } = useDataContext();
  const dayPeriodFields = findDataFields({ group: 'DayPeriods' });
  const amPMMatrix = matrixBy(
    dayPeriodFields.filter((f) => ['am', 'pm'].includes(f.instance)),
    (f) => f.instance,
    (f) => f.length,
  );
  const naturalsMatrix = matrixBy(
    dayPeriodFields.filter((f) => !['am', 'pm'].includes(f.instance)),
    (f) => f.instance,
    (f) => f.variant + f.exampleNum,
  );
  const { t } = useTranslation();

  return (
    <>
      <table style={{ height: 'fit-content' }}>
        <thead>
          <tr>
            <th colSpan={2} style={{ textAlign: 'center' }}>
              <SourceLanguageLabel />
            </th>
            <th colSpan={2} style={{ textAlign: 'center' }}>
              {t('review.translated')}
            </th>
          </tr>
          <tr>
            <th>{t('length.wide')}</th>
            <th>{t('length.narrow')}</th>
            <th>{t('length.wide')}</th>
            <th>{t('length.narrow')}</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(amPMs).map((dayPeriod) => {
            const row = amPMMatrix[dayPeriod];
            return (
              <tr key={dayPeriod}>
                <SourceDataCell data={row['w']} />
                <SourceDataCell data={row['n']} />
                <InputDataCell data={row['w']} />
                <InputDataCell data={row['n']} />
              </tr>
            );
          })}
        </tbody>
      </table>
      <table style={{ height: 'fit-content' }}>
        <thead>
          <tr>
            <th colSpan={3} style={{ textAlign: 'center' }}>
              <SourceLanguageLabel />
            </th>
            <th colSpan={3} style={{ textAlign: 'center' }}>
              {t('review.translated')}
            </th>
          </tr>
          <tr>
            <th>{t('review.standalone')}</th>
            <th>{t('review.inSentence')}</th>
            <th>{t('review.exampleSentence')}</th>
            <th>{t('review.standalone')}</th>
            <th>{t('review.inSentence')}</th>
            <th>{t('review.exampleSentence')}</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(dayPeriods).map((dayPeriod) => {
            const row = naturalsMatrix[dayPeriod];
            return (
              <tr key={dayPeriod}>
                <SourceDataCell data={row['s0']} />
                <SourceDataCell data={row['f0']} />
                <SourceDataCell data={row['f1']} />
                <InputDataCell data={row['s0']} />
                <InputDataCell data={row['f0']} inputWidth="10em" />
                <InputDataCell data={row['f1']} inputWidth="10em" />
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default DayPeriodsReviewTable;
