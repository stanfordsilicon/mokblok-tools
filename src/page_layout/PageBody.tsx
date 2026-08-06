import { useURLParams } from '@settings/URLParams';

import StepView from '../widgets/StepView';

const PageBody: React.FC = () => {
  const { step } = useURLParams();

  return (
    <div
      data-testid="PageBody"
      className="relative flex-1 overflow-auto rounded-[2rem] border border-(--silicon-line) bg-white/85 p-4 text-sm backdrop-blur-sm sm:p-6 shadow-sm"
    >
      <StepView step={step} />
    </div>
  );
};

export default PageBody;
