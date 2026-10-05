import { useCallback, useMemo } from 'react';

import { useDemoDataContext } from '@data/target/DemoDataProvider';
import { Vote } from '@data/target/types';

import StepName from '@settings/StepName';
import { useURLParams } from '@settings/URLParams';

import DemoID from './DemoID';

const DemoVoteButton: React.FC<{ demoID: DemoID }> = ({ demoID }) => {
  const { step } = useURLParams();
  const vote = useDemoDataContext((state) => state.demoVotes[demoID]);
  const setDemoVote = useDemoDataContext((state) => state.setDemoVote);

  const toggleDemoVote = useCallback(() => {
    setDemoVote(demoID, (prev) => getNextVote(prev));
  }, [demoID, setDemoVote]);

  const buttonClassName = useMemo(() => {
    let classes = 'size-6 text-center align-middle rounded relative cursor-pointer';

    if (vote === Vote.Accept) classes += ' bg-[var(--color-level-4)]/50';
    else if (vote === Vote.Reject) classes += ' bg-[var(--color-level-1)]/50';
    else classes += ' bg-hashed';

    return classes;
  }, [vote]);

  const overlayClassName = useMemo(() => {
    let classes = 'absolute size-full transition-opacity opacity-0 hover:opacity-100';

    if (vote === Vote.Accept) classes += ' bg-hashed-reject';
    else if (vote === Vote.Reject) classes += ' bg-hashed-clear';
    else classes += ' bg-hashed-approve';

    return classes;
  }, [vote]);

  if (step !== StepName.Vote) return null;

  return (
    <div className={buttonClassName} onClick={toggleDemoVote}>
      <div className={overlayClassName} />
      {vote === Vote.Accept && '✔️'}
      {vote === Vote.Reject && '✘'}
      {!vote && '?'}
    </div>
  );
};

function getNextVote(currentVote?: Vote): Vote {
  if (!currentVote) return Vote.Accept;
  if (currentVote === Vote.Accept) return Vote.Reject;
  return Vote.Unknown;
}

export default DemoVoteButton;
