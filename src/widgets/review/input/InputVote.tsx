import { useCallback, useEffect, useState, type PointerEvent } from 'react';

import { DataEntry } from '@data/DataTypes';
import { useTargetDataContext, Vote } from '@data/TargetDataProvider';

import { useVoteDragContext } from './VoteDragContext';

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
  const { beginVoteGesture, dragVoteTo, consumeSuppressedClick } = useVoteDragContext();
  const { vote, translation, source, comment } = getTranslationInfo(entry) ?? {};

  const setVote = useCallback(
    (newVote: Vote) =>
      editTranslation(entry.index, { vote: vote === newVote ? Vote.Unknown : newVote }),
    [entry.index, editTranslation, vote],
  );
  const applyVote = useCallback(
    (newVote: Vote) => editTranslation(entry.index, { vote: newVote }),
    [editTranslation, entry.index],
  );
  const [showComments, setShowComments] = useState(false);
  const [currentComment, setCurrentComment] = useState(comment ?? '');
  useEffect(() => {
    setCurrentComment(comment ?? '');
  }, [comment]);

  // Voting interactions
  const nextVote = vote === Vote.Accept ? Vote.Reject : Vote.Accept;
  const handleVotePointerDown = useCallback(() => {
    beginVoteGesture(nextVote, () => applyVote(nextVote));
  }, [applyVote, beginVoteGesture, nextVote]);
  const handleVoteClick = useCallback(() => {
    if (consumeSuppressedClick()) return;
    setVote(nextVote);
  }, [consumeSuppressedClick, setVote, nextVote]);
  const handleVotePointerEnter = useCallback(() => {
    dragVoteTo((dragVote) => applyVote(dragVote));
  }, [applyVote, dragVoteTo]);
  const handleVotePointerDownEvent = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      handleVotePointerDown();
    },
    [handleVotePointerDown],
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <div
          className={
            'truncate text-ellipsis cursor-pointer rounded-sm px-1 select-none' +
            (vote === Vote.Accept ? ' bg-[var(--color-level-4)]/50' : '') +
            (vote === Vote.Reject ? ' bg-[var(--color-level-1)]/50' : '') +
            (vote === Vote.Unknown ? ' bg-hashed' : '') +
            (nextVote === Vote.Accept ? ' cursorVoteApprove' : ' cursorVoteReject')
          }
          title={translation ?? source}
          style={{ width: inputWidth ?? '100%' }}
          role="button"
          onClick={handleVoteClick}
          onPointerDown={handleVotePointerDownEvent}
          onPointerEnter={handleVotePointerEnter}
        >
          {translation ?? source}
        </div>
        <button
          data-testid="comment-button"
          aria-label="Comment"
          className={'mr-4' + `${showComments ? ' selected' : ''}`}
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
