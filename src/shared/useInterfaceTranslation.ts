import { useT } from 'next-i18next/client';

// Renaming the function to useInterfaceTranslation to avoid confusion
// with the main purpose of the app getting new translations
function useInterfaceTranslation() {
  const t = useT();
  return t;
}

export default useInterfaceTranslation;
