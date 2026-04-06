import React from 'react';

const CheckRow: React.FC<
  React.PropsWithChildren<{ title: string; count: number; denominator?: number }>
> = ({ title, count, denominator, children }) => (
  <tr>
    <th>{title}</th>
    <td>
      {count}
      {denominator && ' / '}
      {denominator}
    </td>
    <td>{children}</td>
  </tr>
);

export default CheckRow;
