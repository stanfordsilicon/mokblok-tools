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
  const { getTranslationInfo, editTranslation } = useTargetDataContext();
  const { vote, translation, source, comment } = getTranslationInfo(entry) ?? {};

  const setVote = useCallback(
    (newVote: Vote) =>
      editTranslation(entry.index, { vote: vote === newVote ? Vote.Unknown : newVote }),
    [entry.index, editTranslation, vote],
  );
  const [showComments, setShowComments] = useState(false);
  const [currentComment, setCurrentComment] = useState(comment ?? '');
  useEffect(() => {
    setCurrentComment(comment ?? '');
  }, [comment]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div
          className="truncate text-ellipsis"
          title={translation ?? source}
          style={{ width: inputWidth }}
        >
          {vote === Vote.Reject ? (
            <InputEditText entry={entry} inputWidth={inputWidth} disabled={vote !== Vote.Reject} />
          ) : (
            (translation ?? source)
          )}
        </div>
        <div>
          <button
            data-testid="accept-button"
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
            data-testid="reject-button"
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
            data-testid="comment-button"
            aria-label="Comment"
            className={`${showComments ? 'selected' : ''}`}
            onClick={() => setShowComments((prev) => !prev)}
            style={{
              padding: '0 0.25em',
              border: 'none',
              backgroundColor: !showComments && currentComment ? 'var(--color-level-5)' : undefined,
            }}
          >
            💬
          </button>
        </div>
      </div>
      {showComments && (
        <textarea
          data-testid="comment-input"
          placeholder="Add comments"
          onBlur={() => editTranslation(entry.index, { comment: currentComment })}
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
