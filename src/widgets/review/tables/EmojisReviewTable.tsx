import { useDataContext } from '@data/DataContext';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import { groupBy } from '@shared/setUtils';

import InputDataCell from '../InputDataCell';
import SourceDataCell from '../SourceDataCell';

function EmojisReviewTable() {
  const { findDataFields } = useDataContext();
  const emojisByGroup = groupBy(findDataFields({ subject: 'emoji' }), (f) => f.group);

  return (
    <div>
      Write the name describing the emoji -- you don't necessarily need to stay true to the source
      word, but explain what the emoji means.
      {Object.entries(emojisByGroup).map(([group, emojis]) => (
        <div key={group}>
          <h3>{group}</h3>
          <table>
            <thead>
              <tr>
                <th>Emoji</th>
                <th>
                  <SourceLanguageLabel />
                </th>
                <th>Translated</th>
              </tr>
            </thead>
            <tbody>
              {emojis.map((datum) => (
                <tr key={datum.instance}>
                  <td>{datum.instance}</td>
                  <SourceDataCell data={datum} />
                  <InputDataCell data={datum} inputWidth="15em" />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default EmojisReviewTable;
