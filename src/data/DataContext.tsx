import { createContext, useContext, useMemo, useState } from 'react';

import type { RowData } from './DataTypes';

export type DataContextType = {
  setRows: (lines: RowData[]) => void;
  rowsByExtID: Record<string, RowData>;
};

export const DataContext = createContext<DataContextType | undefined>({
  setRows: () => {},
  rowsByExtID: {},
});

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useDataContext must be used within a DataProvider');
  return context;
};

export const DataProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [rows, setRows] = useState<RowData[]>([]);

  const rowsByExtID = useMemo(() => {
    return rows.reduce(
      (acc, line) => {
        acc[line.ext_id] = line;
        return acc;
      },
      {} as Record<string, RowData>,
    );
  }, [rows]);

  const dataContext: DataContextType = {
    setRows: setRows,
    rowsByExtID,
  };

  return <DataContext.Provider value={dataContext}>{children}</DataContext.Provider>;
};
