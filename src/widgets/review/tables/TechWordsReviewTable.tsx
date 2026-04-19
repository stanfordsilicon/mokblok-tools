import { useDataContext } from '@data/DataContext';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import InputDataCell from '../InputDataCell';
import SourceDataCell from '../SourceDataCell';

function TechWordsReviewTable() {
  const { findDataFields } = useDataContext();
  const techWords = findDataFields({ group: 'Tech Words' });

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>
              <SourceLanguageLabel />
            </th>
            <th>Translated</th>
          </tr>
        </thead>
        <tbody>
          {techWords.map((datum) => (
            <tr key={datum.instance}>
              <SourceDataCell data={datum} />
              <InputDataCell data={datum} inputWidth="15em" />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TechWordsReviewTable;
