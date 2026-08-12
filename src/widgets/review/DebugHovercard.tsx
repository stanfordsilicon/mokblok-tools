import { SourceLanguage, type DataEntry } from '@data/DataTypes';

import { useURLParams } from '@settings/URLParams';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

type Props = {
  entry: DataEntry;
  sourceTranslation: string | [string, string];
};

function DebugHovercard({ entry, sourceTranslation }: Props) {
  const { uitext } = useInterfaceTranslation();
  const { admin, sourceLanguage } = useURLParams();
  const translationText =
    typeof sourceTranslation === 'string' ? sourceTranslation : sourceTranslation[0];
  const pattern = typeof sourceTranslation === 'string' ? undefined : sourceTranslation[1];
  if (!admin) return null;

  return (
    <aside className="DebugHovercard" role="tooltip" aria-label="Source data debugging information">
      <div className="DebugHovercard__title">Source data debug</div>
      <div className="DebugHovercard__description">Click the row to keep the hovercard open.</div>

      <dl>
        {/* Translations */}
        <DebugRow label={uitext(`languageName.${sourceLanguage}`)} value={translationText} />
        {pattern && <DebugRow label="Pattern value" value={pattern} indent={1} />}
        {sourceLanguage !== SourceLanguage.English && (
          <DebugRow
            label={uitext(`languageName.${SourceLanguage.English}`)}
            value={entry.english}
          />
        )}
        {pattern && sourceLanguage !== SourceLanguage.English && entry.englishPattern && (
          <DebugRow label="English pattern" value={entry.englishPattern} indent={1} />
        )}
        {sourceLanguage !== SourceLanguage.French && (
          <DebugRow label={uitext(`languageName.${SourceLanguage.French}`)} value={entry.french} />
        )}
        {pattern && sourceLanguage !== SourceLanguage.French && entry.frenchPattern && (
          <DebugRow label="French pattern" value={entry.frenchPattern} indent={1} />
        )}

        {/* Location */}
        <DebugRow label="Page" value={entry.page} />
        <DebugRow label="Section" value={entry.section} indent={1} />
        <DebugRow label="Group" value={entry.group} indent={1} />

        {/* Characteristics */}
        <DebugRow label="Field" value={entry.field} />
        <DebugRow label="Instance" value={entry.instance} indent={1} />
        <DebugRow label="Length" value={entry.length} indent={1} />
        <DebugRow label="Variant" value={entry.variant} indent={1} />
        <DebugRow label="Example number" value={entry.exampleNum} indent={1} />
        <DebugRow label="var1" value={entry.var1} indent={1} />
        <DebugRow label="var2" value={entry.var2} indent={1} />

        {/* ID */}
        <DebugRow label="XPath" value={entry.xpath} />
        <DebugRow label="External ID" value={entry.ext_id} indent={1} />
        <DebugRow label="Index" value={entry.index} indent={1} />
      </dl>
    </aside>
  );
}

type DebugRowProps = {
  label: string;
  indent?: number;
  value: string | number | boolean | undefined;
};
function DebugRow({ label, value, indent = 0 }: DebugRowProps) {
  const paddingLeft = `${indent * 2}em`;
  return (
    <div className="DebugHovercard__row">
      <dt style={{ paddingLeft, fontWeight: indent === 0 ? 'bold' : 'normal' }}>{label}</dt>
      <dd style={{ paddingLeft }}>
        {value === undefined || value === '' ? <em>empty</em> : String(value)}
      </dd>
    </div>
  );
}

export default DebugHovercard;
