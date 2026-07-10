// Columns: Subject	Field	Instance	Length	Context	Example#	XPath	ExtID	English	English (pattern)	French	Level

import { parseCoverageLevel } from './CoverageLevel';

import type { DataEntry } from './DataTypes';

export async function loadDataEntries(): Promise<DataEntry[] | void> {
  const filePath = 'dataentries.tsv';
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
          subject: cells[0],
          group: cells[1],
          field: cells[2],
          instance: cells[3],
          length: cells[4],
          variant: cells[5],
          exampleNum: cells[6],
          xpath: cells[7],
          ext_id: cells[8],
          english: cells[9],
          englishPattern: cells[10],
          french: cells[11],
          frenchPattern: cells[12],
          level: parseCoverageLevel(cells[13]),
          var1: Number(cells[14].replaceAll(',', '')) || undefined,
          var2: Number(cells[15].replaceAll(',', '')) || undefined,
          index,
        } as DataEntry;
      });
    })
    .catch((err) => console.error('Error loading TSV:', err));
}
