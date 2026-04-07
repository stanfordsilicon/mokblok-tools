// Columns: Subject	Field	Instance	Length	Context	Example#	XPath	ExtID	English	English (pattern)	French	Level

import type { DataField } from './DataTypes';

export async function loadDatafields(): Promise<DataField[] | void> {
  const filePath = 'datafields.tsv';
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
          field: cells[1],
          instance: cells[2],
          length: cells[3],
          variant: cells[4],
          exampleNum: cells[5],
          xpath: cells[6],
          ext_id: cells[7],
          english: cells[8],
          englishPattern: cells[9],
          french: cells[10],
          level: cells[11],
          index,
        } as DataField;
      });
    })
    .catch((err) => console.error('Error loading TSV:', err));
}
