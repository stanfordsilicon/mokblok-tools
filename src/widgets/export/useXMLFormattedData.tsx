import { isWithinCoverageLevel } from '@data/CoverageLevel';
import { useDataContext } from '@data/DataContext';

import { useURLParams } from '@settings/URLParams';

import { addValueToXML, toXMLString } from './formatXML';

import type { XMLObject } from './formatXML';

const useXMLFormattedData = (): string => {
  const { coverageLevel } = useURLParams();
  const { findDataEntries, getTranslation } = useDataContext();

  const allEntries = findDataEntries({})
    // Only consider fields with an XPath and exampleNum of 0 (avoid exporting pattern examples, can only export patterns)
    .filter((f) => f.xpath && !parseInt(f.exampleNum));
  const ldml: XMLObject = {};

  // Construct the full tree
  allEntries.forEach((entry) => {
    // Skip fields that are above the selected coverage level
    if (!isWithinCoverageLevel(entry.level, coverageLevel)) return;

    const translation = getTranslation(entry, /* fallback */ false);
    if (!translation) return; // Skip fields without translations

    addValueToXML(ldml, entry.xpath, translation);
  });

  return toXMLString(ldml, '  ');
};

export default useXMLFormattedData;
