import React, { useMemo } from 'react';

import { useTargetDataContext, Vote } from '@data/target/TargetDataProvider';
import { TranslationInfo } from '@data/target/types';

const ChangesSummary: React.FC = () => {
  const { getTranslations } = useTargetDataContext();
  const editedTranslations = useMemo(() => {
    return getTranslations()
      .filter(
        (info) =>
          info.edit != null ||
          info.vote === Vote.Accept ||
          info.vote === Vote.Reject ||
          info.comment != null,
      )
      .sort((a, b) => a.id.localeCompare(b.id))
      .sort((a, b) => getResultRank(b) - getResultRank(a))
      .map((info) => (
        <div key={info.id}>
          <div className="inline-block w-4">
            {info.vote === Vote.Accept && '✔️'}
            {info.vote === Vote.Reject && '✘'}
          </div>
          {info.translation ?? info.source}
          {info.edit != null && <span> -&gt; {info.edit}</span>}
          {info.comment != null && <span> (Comment: {info.comment})</span>}
        </div>
      ));
  }, [getTranslations]);

  return (
    <div className="flex flex-col gap-2">
      <h3>Changes Summary</h3>
      {editedTranslations.length > 0 ? (
        <div>{editedTranslations}</div>
      ) : (
        <div>No changes made.</div>
      )}
    </div>
  );
};

function getResultRank(edit: TranslationInfo) {
  if (edit.edit != null) return 3;
  if (edit.vote === Vote.Reject) return 2;
  if (edit.vote === Vote.Accept) return 1;
  return 0;
}

export default ChangesSummary;
