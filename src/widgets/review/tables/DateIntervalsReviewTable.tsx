import { useDataContext } from '@data/DataContext';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import InputDataCell from '../InputDataCell';
import SourceDataCell from '../SourceDataCell';

function DateIntervalsReviewTable() {
  const { findDataFields } = useDataContext();
  const intervalFormats = findDataFields({ subject: 'dates', field: 'intervalFormats' }).filter(
    (f) => !f.instance.includes('G') && !f.instance.match(/^h/i),
  );

  return (
    <table>
      <thead>
        <tr>
          <th>Components</th>
          <th>
            Greatest
            <br />
            Difference
          </th>
          <th>
            <SourceLanguageLabel />
          </th>
          <th>Translated</th>
        </tr>
      </thead>
      <tbody>
        {intervalFormats?.map((datum) => {
          //   const shortXPath = datum.xpath
          //     ?.replace(/\/\/ldml\/dates\/calendars\/calendar\[@type="([a-z]{2})[^"]+"\]\//, '$1/')
          //     .replace(/\/([a-z])[a-z]*([A-Z])[a-z]*([A-Z])?[a-z]*/g, '/$1$2$3')
          //     .replace(/@[a-z]+="([a-zA-Z]+)"/g, '$1');
          return (
            <tr key={datum.index}>
              <td>{datum.instance}</td>
              <td>{datum.variant}</td>
              <SourceDataCell data={datum} />
              <InputDataCell data={datum} inputWidth="25em" />
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default DateIntervalsReviewTable;
