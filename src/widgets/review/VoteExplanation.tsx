import useInterfaceTranslation from '@shared/useInterfaceTranslation';

const VoteExplanation: React.FC = () => {
  const { uitext } = useInterfaceTranslation();
  return (
    <div>
      {uitext('vote.howToVote')}
      <div className="grid grid-cols-4 w-fit gap-1 p-1 items-center">
        <div>{uitext('vote.actions')}:</div>
        <div className="p-0.5 rounded-sm bg-hashed-green">✔️ {uitext('vote.accept')}</div>
        <div className="p-0.5 rounded-sm bg-hashed-red">✘ {uitext('vote.reject')}</div>
        <div className="p-0.5 rounded-sm bg-white">💬 {uitext('vote.comment')}</div>
        <div>{uitext('vote.status')}:</div>
        <div className="p-0.5 rounded-sm bg-[var(--color-level-4)]/50">
          {uitext('vote.accepted')}
        </div>
        <div className="p-0.5 rounded-sm bg-[var(--color-level-1)]/50">
          {uitext('vote.rejected')}
        </div>
        <div className="p-0.5 rounded-sm bg-hashed">{uitext('vote.notVotedOn')}</div>
      </div>
      {uitext('vote.otherReviewActivities')}
    </div>
  );
};

export default VoteExplanation;
