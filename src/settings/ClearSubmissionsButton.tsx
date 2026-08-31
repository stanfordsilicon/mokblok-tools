import { useTargetDataContext } from '@data/target/TargetDataProvider';

const ClearSubmissionsButton: React.FC = () => {
  const { clearAllTranslations } = useTargetDataContext();

  return (
    <button
      onClick={() => {
        const userConfirmed = confirm(
          'You are about to clear all submitted translations. Continue?',
        );
        if (userConfirmed) clearAllTranslations();
      }}
    >
      Clear Submissions
    </button>
  );
};

export default ClearSubmissionsButton;
