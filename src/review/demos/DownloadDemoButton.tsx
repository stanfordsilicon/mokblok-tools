import { TargetLanguage } from '../../data/DataTypes';
import useStoredParams from '../../page/useStoredParams';
import type DemoID from './DemoID';

const DownloadDemoButton: React.FC<{
  demoID: DemoID;
}> = ({ demoID }) => {
  const { value: targetLanguage } = useStoredParams<TargetLanguage>(
    'targetLanguage',
    TargetLanguage.English,
  );
  const onClick = () => {
    const svg = document.getElementById(demoID) as SVGSVGElement | null;
    if (!svg) {
      console.error(`SVG with ID ${demoID} not found`);
      return;
    }

    downloadSvgAsPng(svg, demoID, targetLanguage, {
      scale: 3,
    });
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

function downloadSvgAsPng(
  svg: SVGSVGElement,
  demoID: DemoID,
  language: TargetLanguage,
  options?: {
    scale?: number; // e.g. 2 or 3 for high DPI
  },
) {
  const scale = options?.scale ?? 2;

  const serializer = new XMLSerializer();
  let source = serializer.serializeToString(svg);

  // Ensure namespaces (critical)
  if (!source.includes('xmlns="http://www.w3.org/2000/svg"')) {
    source = source.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  }

  // This doesn't work, something isn't working when loading images
  if (source.includes('<image')) {
    source = source.replace('<image href="./', `<image href="/public/`);
  }

  const svgBlob = new Blob([source], {
    type: 'image/svg+xml;charset=utf-8',
  });

  const url = URL.createObjectURL(svgBlob);
  const img = new Image();

  // Important for Safari + Firefox
  img.crossOrigin = 'anonymous';

  img.onload = () => {
    const bbox = svg.getBoundingClientRect();

    const canvas = document.createElement('canvas');
    canvas.width = bbox.width * scale;
    canvas.height = bbox.height * scale;

    const ctx = canvas.getContext('2d')!;
    ctx.scale(scale, scale);

    ctx.drawImage(img, 0, 0, bbox.width, bbox.height);

    canvas.toBlob((blob) => {
      if (!blob) return;

      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${language}_${demoID}.png`;
      a.click();
      URL.revokeObjectURL(a.href);
    }, 'image/png');

    URL.revokeObjectURL(url);
  };

  img.src = url;
}

export default DownloadDemoButton;
