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

  return (
    <>
      <table style={{ height: 'fit-content' }}>
        <thead>
          <tr>
            <th colSpan={2} style={{ textAlign: 'center' }}>
              <SourceLanguageLabel />
            </th>
            <th colSpan={2} style={{ textAlign: 'center' }}>
              Translated
            </th>
          </tr>
          <tr>
            <th>Wide</th>
            <th>Narrow</th>
            <th>Wide</th>
            <th>Narrow</th>
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
              Translated
            </th>
          </tr>
          <tr>
            <th>Standalone</th>
            <th>In Sentence</th>
            <th>Example Sentence</th>
            <th>Standalone</th>
            <th>In Sentence</th>
            <th>Example Sentence</th>
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
