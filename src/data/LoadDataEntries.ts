// Columns: Subject	Field	Instance	Length	Context	Example#	XPath	ExtID	English	English (pattern)	French	Level

import { parseCoverageLevel } from './CoverageLevel';

import type { DataPage, DataSection } from './DataSection';
import type { DataEntry } from './DataTypes';

export async function loadDataEntries(): Promise<DataEntry[] | void> {
  const filePath = '/dataentries.tsv';
  return await fetch(filePath)
    .then((res) => {
      const contentType = res.headers.get('content-type');
      if (contentType === 'text/html') {
        // the files should never be html
        console.error('File not found:', filePath);
        return '';
      }
      return res.text();
    })
    .then((tsv) => {
      const lines = tsv.split('\n');
      return lines.slice(1).map((line, index) => {
        const cells = line.split('\t').map((c) => c.trim());
        return {
          page: cells[0] as DataPage,
          section: cells[1] as DataSection,
          group: cells[2],
          field: cells[3],
          instance: cells[4],
          length: cells[5],
          variant: cells[6],
          exampleNum: cells[7],
          xpath: cells[8],
          ext_id: cells[9],
          english: cells[10],
          englishPattern: cells[11],
          french: cells[12],
          frenchPattern: cells[13],
          level: parseCoverageLevel(cells[14]),
          var1: Number(cells[15].replaceAll(',', '')) || undefined,
          var2: Number(cells[16].replaceAll(',', '')) || undefined,
          index,
        } as DataEntry;
      });
    })
    .catch((err) => console.error('Error loading TSV:', err));
}
