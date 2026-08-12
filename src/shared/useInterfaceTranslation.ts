import { useTranslation } from 'react-i18next';

// Renaming the function to useInterfaceTranslation to avoid confusion
// with the main purpose of the app getting new translations
function useInterfaceTranslation() {
  const { t } = useTranslation();
  return { uitext: t };
}

export default useInterfaceTranslation;
