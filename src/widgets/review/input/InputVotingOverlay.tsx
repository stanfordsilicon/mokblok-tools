import { PointerEvent, useCallback } from 'react';

import type { DataEntry } from '@data/DataTypes';
import { Vote } from '@data/TargetDataProvider';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import { useVoteDragContext } from './VoteDragContext';

type Props = {
  entry: DataEntry;
  addToQueue: () => void;
  currentVote?: Vote;

  hasComment?: boolean;
  showComment: boolean;
  setShowComment: React.Dispatch<React.SetStateAction<boolean>>;
};

const InputVotingOverlay: React.FC<Props> = ({
  entry,
  addToQueue,
  currentVote,

  hasComment,
  showComment,
  setShowComment,
}) => {
  const { uitext } = useInterfaceTranslation();
  const buttonBaseClass = 'bg-hashed hover:brightness-125 text-center';
  const { beginVoteGesture } = useVoteDragContext();

  const startVoting = useCallback(
    (newVote: Vote) => (event: PointerEvent<HTMLElement>) => {
      event.preventDefault();
      beginVoteGesture(newVote, entry.index);
    },
    [beginVoteGesture, entry.index],
  );

  return (
    <div
      className="InputVoteOverlay grid grid-cols-3 inset-0 absolute w-full transition-opacity cursor-grab"
      aria-hidden="true"
    >
      <div
        data-testid="accept-button"
        aria-label={uitext('vote.accept')}
        title={uitext('vote.accept')}
        className={
          buttonBaseClass + (currentVote !== Vote.Reject ? ' bg-[var(--color-level-4)]' : '')
        }
        onPointerDown={startVoting(Vote.Accept)}
        onPointerEnter={addToQueue}
      >
        ✔️
      </div>
      <div
        data-testid="reject-button"
        aria-label={uitext('vote.reject')}
        title={uitext('vote.reject')}
        className={
          buttonBaseClass + (currentVote !== Vote.Accept ? ' bg-[var(--color-level-1)]' : '')
        }
        onPointerDown={startVoting(Vote.Reject)}
        onPointerEnter={addToQueue}
      >
        ✘
      </div>
      <div
        data-testid="comment-button"
        aria-label={uitext('vote.comment')}
        title={uitext('vote.comment')}
        className={
          buttonBaseClass +
          ' cursor-pointer' +
          `${showComment ? ' bg-[var(--color-level-6)]/50' : ''}` +
          (hasComment ? ' bg-[var(--color-level-6)]' : '')
        }
        onClick={() => setShowComment((prev) => !prev)}
      >
        💬
      </div>
    </div>
  );
};

export default InputVotingOverlay;
