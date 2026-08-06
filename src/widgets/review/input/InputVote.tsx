import { useCallback, useEffect, useState } from 'react';

import { DataEntry } from '@data/DataTypes';
import { useTargetDataContext, Vote } from '@data/TargetDataProvider';

import InputEditText from './InputEditText';

/**
 * The static translation is shown. When hovered over,
 * a hovercard shows below the cell with a click to approve,
 * a click to reject, a box to edit the translation and a box to add comments
 */
const InputVote: React.FC<{
  entry: DataEntry;
  inputWidth?: string;
}> = ({ entry, inputWidth }) => {
  const { getTranslationInfo, voteOnTranslation, editTranslationComment } = useTargetDataContext();
  const { vote, translation, source, comment } = getTranslationInfo(entry);
  let backgroundColor = 'transparent';
  if (vote === Vote.Accept) backgroundColor = 'var(--color-level-4)';
  if (vote === Vote.Reject) backgroundColor = 'var(--color-level-1)';
  const setVote = useCallback(
    (newVote: Vote) => voteOnTranslation(entry.index, vote === newVote ? Vote.Unknown : newVote),
    [entry.index, voteOnTranslation, vote],
  );
  const [showComments, setShowComments] = useState(false);
  const [currentComment, setCurrentComment] = useState(comment ?? '');
  useEffect(() => {
    setCurrentComment(comment ?? '');
  }, [comment]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div style={{ backgroundColor, width: inputWidth }}>
          {vote === Vote.Reject ? (
            <InputEditText entry={entry} inputWidth={inputWidth} disabled={vote !== Vote.Reject} />
          ) : (
            (translation ?? source)
          )}
        </div>
        <div>
          <button
            aria-label="Accept"
            onClick={() => setVote(Vote.Accept)}
            style={{
              padding: '0 0.25em',
              border: 'none',
              backgroundColor: vote === Vote.Accept ? 'var(--color-level-4)' : undefined,
            }}
          >
            ✔️
          </button>
          <button
            aria-label="Reject"
            onClick={() => setVote(Vote.Reject)}
            style={{
              padding: '0 0.25em',
              border: 'none',
              backgroundColor: vote === Vote.Reject ? 'var(--color-level-1)' : undefined,
            }}
          >
            ✘
          </button>
          <button
            aria-label="Comment"
            className={`${showComments ? 'selected' : ''}`}
            onClick={() => setShowComments((prev) => !prev)}
            style={{ padding: '0 0.25em', border: 'none' }}
          >
            💬
          </button>
        </div>
      </div>
      {showComments && (
        <textarea
          placeholder="Add comments"
          onBlur={() => editTranslationComment(entry.index, currentComment)}
          onChange={(e) => setCurrentComment(e.target.value)}
          className="border p-1 rounded w-full"
          value={currentComment}
          style={{ width: '100%' }}
        />
      )}
    </div>
  );
};

export default InputVote;
