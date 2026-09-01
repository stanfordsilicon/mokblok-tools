import { type DataEntry } from '@data/DataTypes';
import useLanguageName from '@data/useLanguageName';

import { useURLParams } from '@settings/URLParams';

type Props = {
  entry: DataEntry;
  source: { translation: string; pattern?: string };
};

// TODO change how this is focused on
function DebugHovercard({ entry, source }: Props) {
  const { admin, sourceLanguage } = useURLParams();
  const pattern = source.pattern;
  const { getLanguageName } = useLanguageName();

  if (!admin) return null;

  return (
    <aside className="DebugHovercard" role="tooltip" aria-label="Source data debugging information">
      <div className="DebugHovercard__title">Source data debug</div>
      <div className="DebugHovercard__description">Click the row to keep the hovercard open.</div>

      <dl>
        {/* Translations */}
        <DebugRow label={getLanguageName(sourceLanguage).localized} value={source.translation} />
        {pattern && <DebugRow label="Pattern value" value={pattern} indent={1} />}
        {sourceLanguage !== 'en' && (
          <DebugRow label={getLanguageName('en').localized} value={entry.english} />
        )}
        {pattern && sourceLanguage !== 'en' && entry.englishPattern && (
          <DebugRow label={'English pattern'} value={entry.englishPattern} indent={1} />
        )}
        {sourceLanguage !== 'fr' && (
          <DebugRow label={getLanguageName('fr').localized} value={entry.french} />
        )}
        {pattern && sourceLanguage !== 'fr' && entry.frenchPattern && (
          <DebugRow label={'French pattern'} value={entry.frenchPattern} indent={1} />
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
        <DebugRow label="Worksheet" value={entry.worksheet ?? 'Not in worksheets'} indent={1} />
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
