import useLanguageName from '@data/useLanguageName';

import { useURLParams } from './URLParams';

function SourceLanguageLabel() {
  const { sourceLanguage } = useURLParams();
  const { getLanguageName } = useLanguageName();
  const langNames = getLanguageName(sourceLanguage);
  return langNames.endonym ?? langNames.localizedName ?? langNames.code;
}

export function SourceLanguageHeader({
  className,
  colSpan,
}: {
  className?: string;
  colSpan?: number;
}) {
  return (
    <th className={className} colSpan={colSpan}>
      <SourceLanguageLabel />
    </th>
  );
}

export default SourceLanguageLabel;
