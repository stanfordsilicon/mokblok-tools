import { type DataEntry } from '@data/DataTypes';
import useTranslationFromSourceLanguage from '@data/sourcedata/useTranslationFromSourceLanguage';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import DebugHovercard from './DebugHovercard';

type Props = {
  entry?: DataEntry;
  style?: React.CSSProperties;
  convertPatternToExample?: boolean;
};
function SourceDataCell({ entry, style, convertPatternToExample = true }: Props) {
  const { uitext } = useInterfaceTranslation();
  const getSourceTranslation = useTranslationFromSourceLanguage();

  if (!entry) return <td>{uitext('common.emptyCell')}</td>;
  const sourceTranslation = getSourceTranslation(entry);

  return (
    <td className="Cell" tabIndex={0}>
      <div className="Cell__content" style={style}>
        <NewLineAwareRenderer>
          {typeof sourceTranslation === 'string'
            ? sourceTranslation
            : sourceTranslation[convertPatternToExample ? '0' : '1']}
        </NewLineAwareRenderer>
      </div>

      <DebugHovercard entry={entry} sourceTranslation={sourceTranslation} />
    </td>
  );
}

// Convert newline chars to new blocks
const NewLineAwareRenderer: React.FC<React.PropsWithChildren> = ({ children }) => {
  if (typeof children === 'string' && children.includes('\\n')) {
    return children.split('\\n').map((line, index) => <div key={index}>{line}</div>);
  }
  return <>{children}</>;
};

export default SourceDataCell;
