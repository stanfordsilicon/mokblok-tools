import { getCoverageLevelKey } from '@data/CoverageLevel';
import { DataEntry } from '@data/DataTypes';
import useTranslationFromSourceLanguage from '@data/sourcedata/useTranslationFromSourceLanguage';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import useBackgroundColor from '../input/getBackgroundColor';
import InputDataCell from '../input/InputDataCell';
import SourceDataCell from '../SourceDataCell';

function FullReviewRow({ entry }: { entry: DataEntry }) {
  const { uitext } = useInterfaceTranslation();
  const getSourceTranslation = useTranslationFromSourceLanguage();
  const getBackgroundColor = useBackgroundColor();
  const sourceTranslation = getSourceTranslation(entry);

  return (
    <tr key={entry.id} style={{ backgroundColor: getBackgroundColor(entry) }}>
      <td style={{ maxWidth: '5em' }}>{entry.worksheet}</td>
      <td style={{ maxWidth: '5em' }}>{uitext(`dataPage.${entry.page}`)}</td>
      <td style={{ maxWidth: '5em' }}>{uitext(`dataSection.${entry.section}`)}</td>
      <td style={{ maxWidth: '5em' }}>{entry.group}</td>
      <td style={{ maxWidth: '5em' }}>{entry.field}</td>
      <td style={{ maxWidth: '5em' }}>{entry.instance}</td>
      <td>{entry.length}</td>
      <td>{entry.variant}</td>
      <td>{entry.exampleNum}</td>
      <SourceDataCell entry={entry} style={{ maxWidth: '15em' }} />
      <InputDataCell entry={entry} inputWidth="15em" />
      <td style={{ overflow: 'hidden' }}>
        {uitext(`coverageLevelName.${getCoverageLevelKey(entry.level)}`)}
      </td>
      <td>{Array.isArray(sourceTranslation) ? sourceTranslation[0] : sourceTranslation}</td>
      <td>{Array.isArray(sourceTranslation) ? sourceTranslation[1] : ''}</td>
      <td>{entry.xpath}</td>
      <td>{uitext(`patternFormat.${entry.patternFormat}`)}</td>
    </tr>
  );
}

export default FullReviewRow;
