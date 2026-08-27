import { useCallback, useMemo, useState } from 'react';

import type { DataEntry } from '@data/DataTypes';
import { useTargetDataContext, Vote } from '@data/target-data/TargetDataProvider';

import CommentBox from './CommentBox';
import CommentMarker from './CommentMarker';
import InputVotingOverlay from './InputVotingOverlay';
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
  const { getTranslationInfo } = useTargetDataContext();
  const { isVoteGestureActive, queue, vote: dragVote } = useVoteDragContext();
  const { vote, edit, translation, source, comment } = getTranslationInfo(entry) ?? {};

  const addToQueue = useCallback(() => queue.add(entry.id), [queue, entry.id]);
  const [showComment, setShowComment] = useState(false);
  const hasComment = (comment ?? '').trim().length > 0;

  // If the input width is too small, we'll expand it
  if (inputWidth == null) inputWidth = '100%';
  else if (inputWidth.includes('em')) {
    const widthValue = parseFloat(inputWidth.split('em')[0]);
    if (widthValue < 8) inputWidth = '8em';
  }

  const inputVoteSurfaceClasses = useMemo(() => {
    let classes =
      'InputVoteSurface relative truncate text-ellipsis rounded-sm px-1 select-none overflow-hidden cursor-grab';
    if (isVoteGestureActive && queue.has(entry.id)) classes += ' InputVoteSurfaceHoverSuppressed';

    if (queue.has(entry.id)) {
      classes += ' bg-hashed';
      if (dragVote === Vote.Accept) classes += ' bg-hashed-approve cursor-vote-approve ';
      else if (dragVote === Vote.Reject) classes += ' bg-hashed-reject cursor-vote-reject ';
      else if (dragVote === Vote.Unknown) classes += ' bg-hashed-clear cursor-vote-clear ';
    }

    if (vote === Vote.Accept) classes += ' bg-[var(--color-level-4)]/50';
    else if (vote === Vote.Reject) classes += ' bg-[var(--color-level-1)]/50';
    else if (vote === Vote.Unknown) classes += ' bg-hashed';

    return classes;
  }, [isVoteGestureActive, vote, queue, entry.id, dragVote]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div
          data-testid="voting-surface"
          className={inputVoteSurfaceClasses}
          title={edit ?? translation ?? source}
          style={{ width: inputWidth }}
          onPointerEnter={addToQueue}
        >
          <div className="inline-block text-xs align-bottom w-4">
            {vote === Vote.Accept && '✔️'}
            {vote === Vote.Reject && '✘'}
            {vote === Vote.Unknown && ' '}
          </div>
          {edit ?? translation ?? source}
          {hasComment && <CommentMarker />}
          <InputVotingOverlay
            entry={entry}
            addToQueue={addToQueue}
            currentVote={vote}

            hasComment={hasComment}
            showComment={showComment}
            setShowComment={setShowComment}
          />
        </div>
      </div>
      {showComment && <CommentBox entry={entry} onCommentFinish={() => setShowComment(false)} />}
    </div>
  );
};

export default InputVote;
