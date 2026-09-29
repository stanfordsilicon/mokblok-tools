import { useURLParams } from '@settings/URLParams';

import { Button } from '@shared/shadcn/ui/button';
import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import DemoID from './DemoID';
import downloadSvgAsPng from './downloadSvgAsPng';

const DownloadAllDemos: React.FC = () => {
  const { targetLanguage } = useURLParams();
  const { uitext } = useInterfaceTranslation();
  const onClick = () => {
    Object.values(DemoID).forEach((demoID) => {
      const svg = document.getElementById(demoID) as SVGSVGElement | null;
      if (!svg) {
        // Not visible
        // console.error(`SVG with ID ${demoID} not found`);
        return;
      }

      downloadSvgAsPng(svg, demoID, targetLanguage, { scale: 3 });
    });
  };

  return (
    <Button variant="outline" onClick={onClick}>
      {uitext('review.downloadAllDemos')} ⬇
    </Button>
  );
};

export default DownloadAllDemos;
