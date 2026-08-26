import useInterfaceTranslation from '@shared/useInterfaceTranslation';

const VoteExplanation: React.FC = () => {
  const { uitext } = useInterfaceTranslation();
  return (
    <div>
      {uitext('vote.howToVote')}
      <div className="grid grid-cols-5 w-fit gap-1 p-1 items-center text-center">
        {/* <div>{uitext('vote.actions')}:</div>
        <div className="p-0.5 rounded-sm bg-hashed-approve cursorVoteApprove">
          ✔️ {uitext('vote.accept')}
        </div>
        <div className="p-0.5 rounded-sm bg-hashed-reject cursorVoteReject">
          ✘ {uitext('vote.reject')}
        </div>
        <div className="p-0.5 rounded-sm bg-hashed-clear cursorVoteClear">
          🪌 {uitext('vote.clear')}
        </div> */}
        <div className="p-0.5">{uitext('vote.status')}:</div>
        <div className="p-0.5 rounded-sm bg-[var(--color-level-4)]/50">
          <div className="inline-block text-xs w-4">✔️</div>
          {uitext('vote.accepted')}
        </div>
        <div className="p-0.5 rounded-sm bg-[var(--color-level-1)]/50">
          <div className="inline-block text-xs w-4">✘</div>
          {uitext('vote.rejected')}
        </div>
        <div className="p-0.5 rounded-sm bg-hashed">{uitext('vote.notVotedOn')}</div>
        <div className="p-0.5 rounded-sm bg-white">💬 {uitext('vote.comment')}</div>
      </div>
      {uitext('vote.otherReviewActivities')}
    </div>
  );
};

export default VoteExplanation;
