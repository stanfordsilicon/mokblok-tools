import { useSourceDataContext } from '@data/SourceDataProvider';
import { useTargetDataContext } from '@data/TargetDataProvider';

const LoadingStatus = () => {
  const { sourceDataStatus } = useSourceDataContext();
  const { targetDataStatus } = useTargetDataContext();

  const overallStep = sourceDataStatus < 4 ? sourceDataStatus : 4 + targetDataStatus;

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          width: (overallStep * 100) / 6 + '%',
          height: '100%',
          top: 0,
          left: 0,
          zIndex: -1,
          borderRadius: '.25em',
          backgroundColor: 'var(--color-button-background)',
        }}
      />
      <div style={{ zIndex: 1 }}>Loading step {overallStep} of 6</div>
    </div>
  );
};

export default LoadingStatus;
