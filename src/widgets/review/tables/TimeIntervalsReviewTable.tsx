import { useDataContext } from '@data/DataContext';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import { sortBy, uniqueBy } from '@shared/setUtils';

import InputDataCell from '../InputDataCell';
import SourceDataCell from '../SourceDataCell';

function TimeIntervalsReviewTable() {
  const { findDataFields } = useDataContext();
  // const intervalFormats = findDataFields({ subject: 'dates', field: 'intervalFormats' }).filter(
  //   (f) => f.instance.match(/^h/i),
  // );
  const intervalFormats = uniqueBy(
    sortBy(findDataFields({ group: 'TimeIntervals' }), (f) => f.instance),
    (f) => f.english,
  );

  return (
    <table>
      <thead>
        <tr>
          <th>Components</th>
          <th>Greatest Difference</th>
          <th style={{ textAlign: 'center' }}>
            <SourceLanguageLabel />
          </th>
          <th style={{ textAlign: 'center' }}>Translated</th>
        </tr>
      </thead>
      <tbody>
        {intervalFormats.map((datum) => (
          <tr key={datum.index}>
            <td>{datum.instance}</td>
            <td>{datum.variant}</td>
            <SourceDataCell data={datum} />
            <InputDataCell data={datum} inputWidth="15em" />
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TimeIntervalsReviewTable;
