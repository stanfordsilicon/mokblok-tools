import React, { useMemo } from 'react';

import { useTargetDataContext, Vote } from '@data/TargetDataProvider';

const ChangesSummary: React.FC = () => {
  const { translations } = useTargetDataContext();
  const editedTranslations = useMemo(() => {
    return Object.values(translations)
      .filter(
        (info) =>
          info.edit != null ||
          info.vote === Vote.Accept ||
          info.vote === Vote.Reject ||
          info.comment != null,
      )
      .map((info) => (
        <div key={info.index}>
          {info.translation ?? info.source}
          {info.edit != null && <span> -&gt; {info.edit}</span>}
          {info.vote === Vote.Accept && <span> (Accepted)</span>}
          {info.vote === Vote.Reject && <span> (Rejected)</span>}
          {info.comment != null && <span> (Comment: {info.comment})</span>}
        </div>
      ));
  }, [translations]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
      <h3>Changes Summary</h3>
      {editedTranslations.length > 0 ? (
        <div>{editedTranslations}</div>
      ) : (
        <div>No changes made.</div>
      )}
    </div>
  );
};

export default ChangesSummary;
