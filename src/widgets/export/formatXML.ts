export interface XMLObject {
  [key: string]: XMLObject | string;
}

export function addValueToXML(ldml: XMLObject, xpath: string, value: string) {
  // Sometimes paths have slashes in names, eg. `zone[@type="Africa/Abidjan"]`.
  // To handle this, we can split on slashes that are not within brackets.
  // The regex will split on slashes that are not followed by a closing bracket,
  // which should work for most cases.
  const pathParts = xpath.replace('//ldml/', '').split(/\/(?![^[]*\])/); // Split on slashes that are not within brackets

  let currentLevel = ldml;
  pathParts.forEach((part, index) => {
    const isLastPart = index === pathParts.length - 1;
    if (isLastPart) {
      currentLevel[part] = value; // Set the value at the leaf node
    } else {
      if (!currentLevel[part]) currentLevel[part] = {} as XMLObject;

      if (typeof currentLevel[part] === 'string')
        return console.warn(`Unexpected string value at ${part} while processing ${xpath}`);
      currentLevel = currentLevel[part] as XMLObject; // Move into the next level
    }
  });
}

// Convert the tree to an XML string
export function toXMLString(obj: XMLObject, indent = ''): string {
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
        return `${indent}<${tagWithAttributes}>\n${toXMLString(value, indent + '  ')}\n${indent}</${tagName}>`;
      }
    })
    .join('\n');
}
