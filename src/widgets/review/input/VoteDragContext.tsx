import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { useTargetDataContext, Vote } from '@data/TargetDataProvider';

type VoteDragContextType = {
  beginVoteGesture(vote: Vote, entryIndex: number): void;
  isVoteGestureActive: boolean;
  vote: Vote;

  queue: {
    add(entryIndex: number): void;
    has(entryIndex: number): boolean;
    clear(): void;
  };
};

const VoteDragContext = createContext<VoteDragContextType>({
  beginVoteGesture: () => {},
  isVoteGestureActive: false,
  vote: Vote.Unknown,

  queue: {
    add: () => {},
    has: () => false,
    clear: () => {},
  },
});

export function useVoteDragContext() {
  return useContext(VoteDragContext);
}

export const VoteDragProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { editTranslations } = useTargetDataContext();

  const [isVoteGestureActive, setIsVoteGestureActive] = useState(false);
  const [currentVote, setCurrentVote] = useState<Vote>(Vote.Unknown);

  const [queue, setQueue] = useState(new Set<number>());
  const addToQueue = useCallback(
    (entryIndex: number) => {
      if (currentVote !== Vote.Unknown) setQueue((prevQueue) => new Set(prevQueue).add(entryIndex));
    },
    [currentVote],
  );
  const hasInQueue = useCallback((entryIndex: number) => queue.has(entryIndex), [queue]);
  const clearQueue = useCallback(() => {
    setQueue(new Set());
    setCurrentVote(Vote.Unknown);
  }, []);

  const endVoteGesture = useCallback(() => {
    setIsVoteGestureActive(false);

    editTranslations(Array.from(queue), { vote: currentVote });
    clearQueue();
    setCurrentVote(Vote.Unknown);
  }, [queue, clearQueue, editTranslations, currentVote]);

  useEffect(() => {
    window.addEventListener('pointerup', endVoteGesture);
    window.addEventListener('pointercancel', endVoteGesture);
    window.addEventListener('blur', endVoteGesture);
    return () => {
      window.removeEventListener('pointerup', endVoteGesture);
      window.removeEventListener('pointercancel', endVoteGesture);
      window.removeEventListener('blur', endVoteGesture);
    };
  }, [endVoteGesture]);

  const beginVoteGesture = useCallback((vote: Vote, entryIndex: number) => {
    setIsVoteGestureActive(true);

    setCurrentVote(vote);
    setQueue(new Set([entryIndex]));
  }, []);

  const value = useMemo(
    () => ({
      beginVoteGesture,
      isVoteGestureActive,
      vote: currentVote,

      queue: {
        add: addToQueue,
        has: hasInQueue,
        clear: clearQueue,
      },
    }),
    [beginVoteGesture, isVoteGestureActive, addToQueue, hasInQueue, clearQueue, currentVote],
  );

  return <VoteDragContext.Provider value={value}>{children}</VoteDragContext.Provider>;
};
