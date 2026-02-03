import { createContext, useContext, useMemo, useState } from 'react';

import type { RowData } from './DataTypes';
import {
  getDaysOfWeekData,
  getMonthsData,
  type DayOfWeekData,
  type MonthData,
} from './ExtractData';

export type DataContextType = {
  setRows: (lines: RowData[]) => void;
  rowsByExtID: Record<string, RowData>;
  monthsData: MonthData[];
  daysOfWeekData: DayOfWeekData[];
};

export const DataContext = createContext<DataContextType | undefined>({
  setRows: () => {},
  rowsByExtID: {},
  monthsData: [],
  daysOfWeekData: [],
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

  const rowsByExtID = useMemo(
    () =>
      rows.reduce(
        (acc, line) => {
          acc[line.ext_id] = line;
          return acc;
        },
        {} as Record<string, RowData>,
      ),
    [rows],
  );
  const monthsData = useMemo(() => getMonthsData(rowsByExtID), [rowsByExtID]);
  const daysOfWeekData = useMemo(() => getDaysOfWeekData(rowsByExtID), [rowsByExtID]);

  const dataContext: DataContextType = {
    setRows: setRows,
    rowsByExtID,
    monthsData,
    daysOfWeekData,
  };

  return <DataContext.Provider value={dataContext}>{children}</DataContext.Provider>;
};
