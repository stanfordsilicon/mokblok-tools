import { useCallback } from 'react';

import { useURLParams } from '@settings/URLParams';

const ExportDownloadXMLButton: React.FC<{ filename: string; xmlContent: string }> = ({
  filename,
  xmlContent,
}) => {
  const { targetLanguage } = useURLParams();

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
    <button className="ml-2 text-sm" onClick={handleDownload}>
      ⬇
    </button>
  );
};

export default ExportDownloadXMLButton;
