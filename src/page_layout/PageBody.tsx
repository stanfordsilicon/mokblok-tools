import { useURLParams } from '@settings/URLParams';

import StepView from '../widgets/StepView';

const PageBody: React.FC = () => {
  const { step } = useURLParams();

  return (
    <div
      data-testid="PageBody"
      style={{
        overflow: 'auto',
        padding: '1em',
        display: 'flex',
        flex: 1,
        position: 'relative',
        fontSize: '0.8em',
      }}
    >
      <StepView step={step} />
    </div>
  );
};

export default PageBody;
