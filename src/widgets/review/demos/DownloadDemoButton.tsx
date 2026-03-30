import { useSettings } from '@settings/Settings';

import downloadSvgAsPng from './downloadSvgAsPng';

import type DemoID from './DemoID';

const DownloadDemoButton: React.FC<{
  demoID: DemoID;
}> = ({ demoID }) => {
  const { targetLanguage } = useSettings();
  const onClick = () => {
    const svg = document.getElementById(demoID) as SVGSVGElement | null;
    if (!svg) {
      console.error(`SVG with ID ${demoID} not found`);
      return;
    }

    downloadSvgAsPng(svg, demoID, targetLanguage, { scale: 3 });
  };

  return (
    <button
      onClick={onClick}
      style={{ marginLeft: '0.5em', padding: '0.2em 0.5em', cursor: 'pointer' }}
    >
      ⬇
    </button>
  );
};

export default DownloadDemoButton;
