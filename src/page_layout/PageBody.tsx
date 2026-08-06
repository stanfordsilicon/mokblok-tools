import { useURLParams } from '@settings/URLParams';

import StepView from '../widgets/StepView';

const PageBody: React.FC = () => {
  const { step } = useURLParams();

  return (
    <div
      data-testid="PageBody"
      className="relative flex-1 overflow-auto rounded-[2rem] border border-(--silicon-line) bg-white/85 p-4 text-[0.82rem] shadow-[0_18px_40px_rgba(74,53,48,0.08)] backdrop-blur-sm sm:p-6"
    >
      <StepView step={step} />
    </div>
  );
};

export default PageBody;
