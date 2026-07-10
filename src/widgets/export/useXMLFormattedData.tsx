import { isWithinCoverageLevel } from '@data/CoverageLevel';
import { useDataContext } from '@data/DataContext';

import { useURLParams } from '@settings/URLParams';

// type XMLObject = Record<string, XMLObject | string>;
interface XMLObject {
  [key: string]: XMLObject | string;
}

const useXMLFormattedData = (): string => {
  const { findDataEntries, getTranslation } = useDataContext();
  const { coverageLevel } = useURLParams();
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

    // Sometimes paths have slashes in names, eg. `zone[@type="Africa/Abidjan"]`.
    // To handle this, we can split on slashes that are not within brackets.
    // The regex will split on slashes that are not followed by a closing bracket,
    // which should work for most cases.
    const pathParts = entry.xpath.replace('//ldml/', '').split(/\/(?![^[]*\])/); // Split on slashes that are not within brackets

    let currentLevel = ldml;
    pathParts.forEach((part, index) => {
      const isLastPart = index === pathParts.length - 1;
      if (isLastPart) {
        currentLevel[part] = translation; // Set the translation at the leaf node
      } else {
        if (!currentLevel[part]) currentLevel[part] = {} as XMLObject;

        if (typeof currentLevel[part] === 'string')
          return console.warn(`Unexpected string value at ${part} while processing ${entry.xpath}`);
        currentLevel = currentLevel[part] as XMLObject; // Move into the next level
      }
    });
  });

  // Convert the tree to an XML string
  const xmlString = (obj: XMLObject, indent = ''): string => {
    return Object.entries(obj)
      .map(([key, value]) => {
        const tagWithAttributes = key
          .replace(/\[@([A-Za-z]+)="([a-zA-Z0-9_\-/]+)"\]/g, ' $1="$2"') // convert attributes to XML format
          .replace(/\[@([a-z]+)="(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)"\]/gu, ' $1="$2"'); // Handle emoji attributes
        const tagName = tagWithAttributes.split(' ')[0]; // Get the base tag name for indentation
        if (typeof value === 'string') {
          const escapedValue = value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
          return `${indent}<${tagWithAttributes}>${escapedValue}</${tagName}>`;
        } else {
          return `${indent}<${tagWithAttributes}>\n${xmlString(value, indent + '  ')}\n${indent}</${tagName}>`;
        }
      })
      .join('\n');
  };

  return `${xmlString(ldml, '  ')}`;
};

export default useXMLFormattedData;
