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

  const applyVote = useCallback(
    (newVote: Vote) => editTranslation(entry.index, { vote: newVote }),
    [editTranslation, entry.index],
  );
  const [showComments, setShowComments] = useState(false);
  const [currentComment, setCurrentComment] = useState(comment ?? '');
  useEffect(() => {
    setCurrentComment(comment ?? '');
  }, [comment]);
  const handleVotePointerEnter = useCallback(() => {
    dragVoteTo((dragVote) => applyVote(dragVote));
  }, [applyVote, dragVoteTo]);
  const handleVotePointerDown = useCallback(
    (newVote: Vote) => (event: PointerEvent<HTMLButtonElement>) => {
      event.preventDefault();
      beginVoteGesture(newVote, () => applyVote(newVote));
    },
    [applyVote, beginVoteGesture],
  );
  const handleVoteClick = useCallback(
    (newVote: Vote) => () => {
      if (consumeSuppressedClick()) return;
      applyVote(newVote);
    },
    [applyVote, consumeSuppressedClick],
  );

  // If the input width is too small, we'll expand it
  if (inputWidth == null) inputWidth = '100%';
  else if (inputWidth.includes('em')) {
    const widthValue = parseFloat(inputWidth.split('em')[0]);
    if (widthValue < 8) inputWidth = '8em';
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div
          className={
            'InputVoteSurface relative truncate text-ellipsis rounded-sm px-1 select-none overflow-hidden' +
            (vote === Vote.Accept ? ' bg-[var(--color-level-4)]/50' : '') +
            (vote === Vote.Reject ? ' bg-[var(--color-level-1)]/50' : '') +
            (vote === Vote.Unknown ? ' bg-hashed' : '')
          }
          title={translation ?? source}
          style={{ width: inputWidth }}
          onPointerEnter={handleVotePointerEnter}
        >
          {translation ?? source}
          <div className="InputVoteOverlay " aria-hidden="true">
            <button
              type="button"
              data-testid="accept-button"
              className="InputVoteHalf InputVoteHalfAccept cursor-drag  -cursorVoteApprove bg-[var(--color-level-4)] bg-hashed"
              aria-label="Accept"
              onClick={handleVoteClick(Vote.Accept)}
              onPointerDown={handleVotePointerDown(Vote.Accept)}
              onPointerEnter={handleVotePointerEnter}
            >
              ✔️
            </button>
            <button
              type="button"
              data-testid="reject-button"
              className="InputVoteHalf InputVoteHalfReject cursor-drag -cursorVoteReject bg-[var(--color-level-1)] bg-hashed"
              aria-label="Reject"
              onClick={handleVoteClick(Vote.Reject)}
              onPointerDown={handleVotePointerDown(Vote.Reject)}
              onPointerEnter={handleVotePointerEnter}
            >
              ✘
            </button>
            <button
              data-testid="comment-button"
              aria-label="Comment"
              className={'InputVoteHalf ' + `${showComments ? ' selected' : ''}`}
              onClick={() => setShowComments((prev) => !prev)}
              style={
                {
                  // padding: '0 0.25em',
                  // border: 'none',
                  // backgroundColor:
                  //   !showComments && currentComment ? 'var(--color-level-5)' : undefined,
                }
              }
            >
              💬
            </button>
          </div>
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
