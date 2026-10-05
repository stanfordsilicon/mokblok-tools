import { useTargetDataStore } from '@data/target/TargetDataProvider';

import { Button } from '@shared/shadcn/ui/button';

const ClearSubmissionsButton: React.FC = () => {
  const clearAllTranslations = useTargetDataStore((state) => state.clearAllTranslations);

  return (
    <Button
      variant="destructive"
      onClick={() => {
        const userConfirmed = confirm(
          'You are about to clear all submitted translations. Continue?',
        );
        if (userConfirmed) clearAllTranslations();
      }}
    >
      Clear Submissions
    </Button>
  );
};

export default ClearSubmissionsButton;
