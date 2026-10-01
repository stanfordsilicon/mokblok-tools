import { type DataEntry } from '@data/DataTypes';
import useTranslationFromSourceLanguage from '@data/source/useTranslationFromSourceLanguage';

import { useURLParams } from '@settings/URLParams';

import { HoverCard, HoverCardContent, HoverCardTrigger } from '@shared/shadcn/ui/hover-card';
import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import DebugHovercard from './DebugHovercard';

type Props = {
  entry?: DataEntry;
  style?: React.CSSProperties;
  convertPatternToExample?: boolean;
};
function SourceDataCell({ entry, style, convertPatternToExample = true }: Props) {
  const { admin } = useURLParams();
  const { uitext } = useInterfaceTranslation();
  const getSourceTranslation = useTranslationFromSourceLanguage();

  if (!entry) return <td>{uitext('common.emptyCell')}</td>;
  const sourceTranslation = getSourceTranslation(entry);

  if (!admin) {
    return (
      <td tabIndex={0}>
        <NewLineAwareRenderer>
          {!sourceTranslation.pattern || convertPatternToExample
            ? sourceTranslation.translation
            : sourceTranslation.pattern}
        </NewLineAwareRenderer>
      </td>
    );
  }

  return (
    <td tabIndex={0}>
      <HoverCard>
        <HoverCardTrigger>
          <div style={style} className="text-black font-normal">
            <NewLineAwareRenderer>
              {!sourceTranslation.pattern || convertPatternToExample
                ? sourceTranslation.translation
                : sourceTranslation.pattern}
            </NewLineAwareRenderer>
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <DebugHovercard entry={entry} source={sourceTranslation} />
        </HoverCardContent>
      </HoverCard>
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
