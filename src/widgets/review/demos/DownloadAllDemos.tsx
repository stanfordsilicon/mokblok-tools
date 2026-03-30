import { useSettings } from '@settings/Settings';

import DemoID from './DemoID';
import downloadSvgAsPng from './downloadSvgAsPng';

const DownloadAllDemos: React.FC = () => {
  const { targetLanguage } = useSettings();
  const onClick = () => {
    Object.values(DemoID).forEach((demoID) => {
      const svg = document.getElementById(demoID) as SVGSVGElement | null;
      if (!svg) {
        console.error(`SVG with ID ${demoID} not found`);
        return;
      }

      downloadSvgAsPng(svg, demoID, targetLanguage, { scale: 3 });
    });
  };

  return (
    <button
      onClick={onClick}
      style={{ marginLeft: '0.5em', padding: '0.2em 0.5em', cursor: 'pointer' }}
    >
      Download all demos ⬇
    </button>
  );
};

export default DownloadAllDemos;
