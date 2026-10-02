import { useCallback, useContext, useMemo } from 'react';

import { TargetDataContext, Vote } from '@data/target/TargetDataProvider';

import DemoID from './DemoID';

const DemoVoteButton: React.FC<{ demoID: DemoID }> = ({ demoID }) => {
  const { demoVotes, setDemoVote } = useContext(TargetDataContext);

  const toggleDemoVote = useCallback(() => {
    setDemoVote(demoID, (prev) => getNextVote(prev));
  }, [demoID, setDemoVote]);
  const vote = demoVotes[demoID];

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
