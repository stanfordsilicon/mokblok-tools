import { useDataContext } from '@data/DataContext';
import { DataSection } from '@data/DataSection';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import InputDataCell from '../input/InputDataCell';
import SourceDataCell from '../SourceDataCell';

function RegionsReviewTable() {
  const { uitext } = useInterfaceTranslation();
  const { findDataEntries } = useDataContext();
  const regions = findDataEntries({ section: DataSection.Regions });

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>
              <SourceLanguageLabel />
            </th>
            <th>{uitext('review.translated')}</th>
          </tr>
        </thead>
        <tbody>
          {regions.map((entry) => (
            <tr key={entry.instance + entry.length}>
              <SourceDataCell entry={entry} />
              <InputDataCell entry={entry} inputWidth="15em" />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RegionsReviewTable;
