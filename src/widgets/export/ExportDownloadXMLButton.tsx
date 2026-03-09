import { useCallback } from 'react';

import { useSettings } from '@settings/Settings';

const ExportDownloadXMLButton: React.FC<{ filename: string; xmlContent: string }> = ({
  filename,
  xmlContent,
}) => {
  const { targetLanguage } = useSettings();

  const handleDownload = useCallback(() => {
    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${targetLanguage}-${filename}.xml`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [filename, xmlContent, targetLanguage]);

  return (
    <button
      onClick={handleDownload}
      style={{ marginLeft: '0.5em', padding: '0.2em 0.5em', cursor: 'pointer' }}
    >
      ⬇
    </button>
  );
};

export default ExportDownloadXMLButton;
