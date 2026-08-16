import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';

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
  const { beginVoteGesture, isVoteGestureActive, queue, vote: dragVote } = useVoteDragContext();
  const { vote, translation, source, comment } = getTranslationInfo(entry) ?? {};

  const applyVote = useCallback(
    (newVote: Vote) => editTranslation(entry.index, { vote: newVote }),
    [editTranslation, entry.index],
  );
  const [showComments, setShowComments] = useState(false);
  const [currentComment, setCurrentComment] = useState(comment ?? '');
  const hasComment = currentComment.trim().length > 0 || (comment ?? '').trim().length > 0;
  useEffect(() => {
    setCurrentComment(comment ?? '');
  }, [comment]);

  const handleVotePointerEnter = useCallback(() => queue.add(entry.index), [queue, entry.index]);
  const handleVotePointerDown = useCallback(
    (newVote: Vote) => (event: PointerEvent<HTMLButtonElement>) => {
      event.preventDefault();
      beginVoteGesture(newVote, entry.index, (queuedVote) => applyVote(queuedVote));
    },
    [applyVote, beginVoteGesture, entry.index],
  );
  const handleVoteClick = useCallback((newVote: Vote) => () => applyVote(newVote), [applyVote]);

  const saveComment = useCallback(() => {
    editTranslation(entry.index, { comment: currentComment });
  }, [currentComment, editTranslation, entry.index]);
  const saveAndCloseComment = useCallback(() => {
    saveComment();
    setShowComments(false);
  }, [saveComment]);
  const handleCommentKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key !== 'Enter' || event.shiftKey) return;
      event.preventDefault();
      saveAndCloseComment();
    },
    [saveAndCloseComment],
  );

  // If the input width is too small, we'll expand it
  if (inputWidth == null) inputWidth = '100%';
  else if (inputWidth.includes('em')) {
    const widthValue = parseFloat(inputWidth.split('em')[0]);
    if (widthValue < 8) inputWidth = '8em';
  }

  const inputVoteSurfaceClasses = useMemo(() => {
    let classes =
      'InputVoteSurface relative truncate text-ellipsis rounded-sm px-1 select-none overflow-hidden';
    if (isVoteGestureActive && queue.has(entry.index))
      classes += ' InputVoteSurfaceHoverSuppressed';

    if (queue.has(entry.index)) {
      classes += ' bg-hashed';
      if (dragVote === Vote.Accept) classes += ' bg-hashed-green cursorVoteApprove';
      else if (dragVote === Vote.Reject) classes += ' bg-hashed-red cursorVoteReject';
    }

    if (vote === Vote.Accept) classes += ' bg-[var(--color-level-4)]/50';
    else if (vote === Vote.Reject) classes += ' bg-[var(--color-level-1)]/50';
    else if (vote === Vote.Unknown) classes += ' bg-hashed';

    return classes;
  }, [isVoteGestureActive, vote, queue, entry.index, dragVote]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div
          className={inputVoteSurfaceClasses}
          title={translation ?? source}
          style={{ width: inputWidth }}
          onPointerEnter={handleVotePointerEnter}
        >
          {translation ?? source}
          {hasComment && !showComments && <span className="InputVoteCommentMarker">💬</span>}
          <div className="InputVoteOverlay " aria-hidden="true">
            <button
              type="button"
              data-testid="accept-button"
              className={
                'InputVoteButton  bg-hashed bg-hashed-green' +
                (vote !== Vote.Reject ? ' InputVoteButtonAccept' : '')
              }
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
              className={
                'InputVoteButton bg-hashed-red' +
                (vote !== Vote.Accept ? ' InputVoteButtonReject' : '')
              }
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
              className={
                'InputVoteButton bg-hashed' +
                `${showComments ? ' selected' : ''}` +
                (comment ? ' InputVoteButtonHasComment' : '')
              }
              onClick={() => setShowComments((prev) => !prev)}
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
          onBlur={saveComment}
          onChange={(e) => setCurrentComment(e.target.value)}
          onKeyDown={handleCommentKeyDown}
          className="border p-1 rounded w-full"
          value={currentComment}
          style={{ width: '100%' }}
        />
      )}
    </div>
  );
};

export default InputVote;
