import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from 'react';

import { Vote } from '@data/TargetDataProvider';

type VoteDragContextType = {
  beginVoteGesture(vote: Vote, applyOriginVote: () => void): void;
  dragVoteTo(applyVote: (vote: Vote) => void): void;
  consumeSuppressedClick(): boolean;
};

const VoteDragContext = createContext<VoteDragContextType>({
  beginVoteGesture: () => {},
  dragVoteTo: () => {},
  consumeSuppressedClick: () => false,
});

export function useVoteDragContext() {
  return useContext(VoteDragContext);
}

export const VoteDragProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const activeVoteRef = useRef<Vote | null>(null);
  const originApplyRef = useRef<(() => void) | null>(null);
  const isDraggingRef = useRef(false);
  const suppressNextClickRef = useRef(false);

  const endVoteGesture = useCallback(() => {
    activeVoteRef.current = null;
    originApplyRef.current = null;
    isDraggingRef.current = false;
    document.body.classList.remove('VoteDragActive');
  }, []);

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

  const beginVoteGesture = useCallback((vote: Vote, applyOriginVote: () => void) => {
    activeVoteRef.current = vote;
    originApplyRef.current = applyOriginVote;
    isDraggingRef.current = false;
    document.body.classList.add('VoteDragActive');
  }, []);

  const dragVoteTo = useCallback((applyVote: (vote: Vote) => void) => {
    const activeVote = activeVoteRef.current;
    if (activeVote === null) return;
    if (!isDraggingRef.current) {
      isDraggingRef.current = true;
      suppressNextClickRef.current = true;
      originApplyRef.current?.();
      originApplyRef.current = null;
    }
    applyVote(activeVote);
  }, []);

  const consumeSuppressedClick = useCallback(() => {
    if (!suppressNextClickRef.current) return false;
    suppressNextClickRef.current = false;
    return true;
  }, []);

  const value = useMemo(
    () => ({
      beginVoteGesture,
      dragVoteTo,
      consumeSuppressedClick,
    }),
    [beginVoteGesture, consumeSuppressedClick, dragVoteTo],
  );

  return <VoteDragContext.Provider value={value}>{children}</VoteDragContext.Provider>;
};
