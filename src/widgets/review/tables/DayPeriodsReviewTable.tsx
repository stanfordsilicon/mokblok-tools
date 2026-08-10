import { useDataContext } from '@data/DataContext';
import { DataSection } from '@data/DataSection';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import { matrixBy } from '@shared/setUtils';
import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import InputDataCell from '../input/InputDataCell';
import SourceDataCell from '../SourceDataCell';

const amPMs = ['am', 'pm'];
const dayPeriods = ['morning1', 'afternoon1', 'evening1', 'night1', 'midnight'];

const DayPeriodsReviewTable = () => {
  const { findDataEntries } = useDataContext();
  const dayPeriodFields = findDataEntries({ section: DataSection.DayPeriods });
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
  const { uitext } = useInterfaceTranslation();

  return (
    <>
      <table style={{ height: 'fit-content' }}>
        <thead>
          <tr>
            <th colSpan={2} style={{ textAlign: 'center' }}>
              <SourceLanguageLabel />
            </th>
            <th colSpan={2} style={{ textAlign: 'center' }}>
              {uitext('review.translated')}
            </th>
          </tr>
          <tr>
            <th>{uitext('length.wide')}</th>
            <th>{uitext('length.narrow')}</th>
            <th>{uitext('length.wide')}</th>
            <th>{uitext('length.narrow')}</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(amPMs).map((dayPeriod) => {
            const row = amPMMatrix[dayPeriod];
            return (
              <tr key={dayPeriod}>
                <SourceDataCell entry={row?.['w']} />
                <SourceDataCell entry={row?.['n']} />
                <InputDataCell entry={row?.['w']} />
                <InputDataCell entry={row?.['n']} />
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
              {uitext('review.translated')}
            </th>
          </tr>
          <tr>
            <th>{uitext('review.standalone')}</th>
            <th>{uitext('review.inSentence')}</th>
            <th>{uitext('review.exampleSentence')}</th>
            <th>{uitext('review.standalone')}</th>
            <th>{uitext('review.inSentence')}</th>
            <th>{uitext('review.exampleSentence')}</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(dayPeriods).map((dayPeriod) => {
            const row = naturalsMatrix[dayPeriod];
            return (
              <tr key={dayPeriod}>
                <SourceDataCell entry={row?.['s0']} />
                <SourceDataCell entry={row?.['f0']} />
                <SourceDataCell entry={row?.['f1']} convertPatternToExample={false} />
                <InputDataCell entry={row?.['s0']} />
                <InputDataCell entry={row?.['f0']} inputWidth="10em" />
                <InputDataCell entry={row?.['f1']} inputWidth="10em" />
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default DayPeriodsReviewTable;
