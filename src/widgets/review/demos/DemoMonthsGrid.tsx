import { useEffect, useRef } from 'react';

import { useDataContext } from '@data/DataContext';

import DemoID from './DemoID';

const DemoMonthsGrid: React.FC = () => {
  const { monthsData } = useDataContext();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = 'demos/months_grid.png';
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      monthsData.forEach((month, index) => {
        const x = (index % 4) * 55 + 60;
        const y = Math.floor(index / 4) * 65 + 100;
        const text = month.abbreviated?.translated ?? '';
        ctx.fillText(text, x, y);
      });
    };
  }, [monthsData]);

  return <canvas id={DemoID.MonthsGrid} ref={canvasRef} width={300} height={300} />;
};

export default DemoMonthsGrid;
