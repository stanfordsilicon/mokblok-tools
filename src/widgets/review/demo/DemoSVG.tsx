import React from 'react';

import DemoID from './DemoID';

type Props = {
  id: DemoID;
  width: number;
  height: number;
};

const DemoSVG: React.FC<React.PropsWithChildren<Props>> = ({ id, width, height, children }) => {
  const screenX = 10;
  const screenY = 40;
  const outerWidth = width + screenX * 2;
  const outerHeight = height + 70;
  const gradientID = `phone-shell-gradient-${id}`;

  return (
    <svg
      id={id}
      width={outerWidth}
      height={outerHeight}
      viewBox={`0 0 ${outerWidth} ${outerHeight}`}
    >
      <defs>
        <linearGradient id={gradientID} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3a2b2a" />
          <stop offset="62%" stopColor="#171313" />
          <stop offset="100%" stopColor="#332022" />
        </linearGradient>
      </defs>

      {/* Mobile device shell, included in the downloaded image. */}
      <rect
        x="1"
        y="1"
        width={outerWidth - 2}
        height={outerHeight - 2}
        fill={`url(#${gradientID})`}
        rx="30"
        ry="30"
        stroke="#1d1717"
        strokeWidth="2"
      />

      <g id="frontcamera" transform={`translate(${outerWidth / 2}, 20)`}>
        <rect x="-36" y="-8" width="72" height="16" fill="#111" rx="3" />
        <circle cx="0" cy="0" r="5" fill="#222" />
        <circle cx="0" cy="0" r="3" fill="#111" />
      </g>

      <g fill="rgba(255, 255, 255, 0.9)" fontFamily="sans-serif" fontWeight="bold" fontSize="12px">
        <text x="30" y="25">
          {/* // get the index of hte demo */}#
          {Object.values(DemoID).findIndex((value) => value === id) + 1}
        </text>
        <text x={outerWidth - 60} y="25">
          ●●● 🪫
        </text>
      </g>
      <rect x={screenX} y={screenY} width={width} height={height} fill="#fff" rx="26" ry="26" />

      <g transform={`translate(${screenX},${screenY})`}>
        {children}

        {/* Watermark text */}
        <g
          id="watermark"
          transform={`translate(${width / 2}, ${height / 2}) rotate(-45)`}
          fill="rgba(128, 128, 128, 0.1)"
          style={{
            textAnchor: 'middle',
            fontFamily: 'sans-serif',
            fontSize: 24,
            fontWeight: 'bold',
            pointerEvents: 'none',
          }}
        >
          <text y={-30}>Stanford SILICON</text>
          <text y={0}>DRAFT {new Date().toISOString().split('T')[0]}</text>
          <text y={30}>DO NOT CIRCULATE</text>
        </g>
      </g>
      <rect
        x={outerWidth / 2 - 32}
        y={outerHeight - 16}
        width="64"
        height="4"
        fill="rgba(255, 255, 255, 0.5)"
        rx="2"
      />
    </svg>
  );
};

export default DemoSVG;
