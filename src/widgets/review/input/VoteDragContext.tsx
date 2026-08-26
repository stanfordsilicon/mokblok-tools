import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { useTargetDataContext, Vote } from '@data/TargetDataProvider';

type VoteDragContextType = {
  beginVoteGesture(vote: Vote, id: string): void;
  isVoteGestureActive: boolean;
  vote: Vote | undefined;

  queue: {
    add(id: string): void;
    has(id: string): boolean;
    clear(): void;
  };
};

const VoteDragContext = createContext<VoteDragContextType>({
  beginVoteGesture: () => {},
  isVoteGestureActive: false,
  vote: undefined,

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
  const [currentVote, setCurrentVote] = useState<Vote | undefined>(undefined);

  const [queue, setQueue] = useState(new Set<string>());
  const addToQueue = useCallback(
    (id: string) => {
      if (currentVote !== undefined) setQueue((prevQueue) => new Set(prevQueue).add(id));
    },
    [currentVote],
  );
  const hasInQueue = useCallback((id: string) => queue.has(id), [queue]);
  const clearQueue = useCallback(() => {
    setQueue(new Set());
    setCurrentVote(undefined);
  }, []);

  const endVoteGesture = useCallback(() => {
    setIsVoteGestureActive(false);

    editTranslations(Array.from(queue), { vote: currentVote });
    clearQueue();
    setCurrentVote(undefined);
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

  const beginVoteGesture = useCallback((vote: Vote, id: string) => {
    setIsVoteGestureActive(true);

    setCurrentVote(vote);
    setQueue(new Set([id]));
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
