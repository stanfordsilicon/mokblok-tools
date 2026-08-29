import useLanguageName from '@data/useLanguageName';

import { useURLParams } from './URLParams';

function TargetLanguageLabel() {
  const { getLanguageName } = useLanguageName();
  const { targetLanguage } = useURLParams();
  const langNames = getLanguageName(targetLanguage);
  return langNames.endonym;
}

export function TargetLanguageHeader({
  className,
  colSpan,
}: {
  className?: string;
  colSpan?: number;
}) {
  return (
    <th className={className} colSpan={colSpan}>
      <TargetLanguageLabel />
    </th>
  );
}

export default TargetLanguageLabel;
