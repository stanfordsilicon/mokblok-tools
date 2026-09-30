import { useURLParams } from '@settings/URLParams';

import { Button } from '@shared/shadcn/ui/button';

import downloadSvgAsPng from './downloadSvgAsPng';

import type DemoID from './DemoID';

const DownloadDemoButton: React.FC<{
  demoID: DemoID;
}> = ({ demoID }) => {
  const { targetLanguage } = useURLParams();
  const onClick = () => {
    const svg = document.getElementById(demoID) as SVGSVGElement | null;
    if (!svg) {
      console.error(`SVG with ID ${demoID} not found`);
      return;
    }

    downloadSvgAsPng(svg, demoID, targetLanguage, { scale: 3 });
  };

  return (
    <Button variant="outline" size="icon-xs" onClick={onClick}>
      ⬇
    </Button>
  );
};

export default DownloadDemoButton;
