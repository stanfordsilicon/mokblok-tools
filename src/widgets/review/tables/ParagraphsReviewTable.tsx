import { useDataContext } from '@data/DataContext';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import { groupBy } from '@shared/setUtils';

import InputTextareaCell from '../InputTextareaCell';
import SourceDataCell from '../SourceDataCell';

function ParagraphsReviewTable() {
  const { findDataFields } = useDataContext();
  const paragraphsByGroup = groupBy(findDataFields({ group: 'Paragraphs' }), (f) => f.field);

  function getHeight(english: string) {
    return Math.max(english.length / 50, 1.5) + 'em';
  }

  return (
    <div>
      {Object.entries(paragraphsByGroup).map(([group, paragraphs]) => (
        <div key={group}>
          <h3>{group}</h3>
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
              {paragraphs.map((datum) => (
                <tr key={datum.instance}>
                  <SourceDataCell data={datum} style={{ textWrap: 'balance' }} />
                  <InputTextareaCell
                    data={datum}
                    style={{ height: getHeight(datum.english), width: '50em' }}
                  />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default ParagraphsReviewTable;
