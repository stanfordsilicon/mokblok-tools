import React from 'react';

import type DemoID from './DemoID';

type Props = {
  id: DemoID;
  width: number;
  height: number;
};

const DemoSVG: React.FC<React.PropsWithChildren<Props>> = ({ id, width, height, children }) => {
  return (
    <svg id={id} width={width + 20} height={height + 20}>
      <rect x="10" y="10" width={width} height={height} fill="#777" rx="10" ry="10" />
      <rect
        x="1"
        y="1"
        width={width}
        height={height}
        fill="#fff"
        rx="10"
        ry="10"
        stroke="#ccc"
        strokeWidth="2"
      />
      {/* Move 1px diagonally so we can have a nice border without needing to worry about stroke width or clipping */}
      <g transform="translate(1,1)">{children}</g>
    </svg>
  );
};

export default DemoSVG;
