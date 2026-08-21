import { PreloadableXMLLanguages } from '../settings/selectors/TargetLanguageOptions';

import parseInheritance from './parseInheritance';

/**
 * Loads and XML for the ground truth of the data for a locale.
 * 
 * Outputs an ojbect array of xpath to string values.
 * 
 * For example...
<ldml>
	<localeDisplayNames>
		<localeDisplayPattern>
			<localePattern>{0} ({1})</localePattern>
		</localeDisplayPattern>
	</localeDisplayNames>
	<layout>
		<orientation>
			<characterOrder>left-to-right</characterOrder>
			<lineOrder>top-to-bottom</lineOrder>
		</orientation>
	</layout>
</ldml>
 *
 * Becomes:
    * "/ldml/localeDisplayNames/localeDisplayPattern/localePattern": "{0} ({1})",
    * "/ldml/layout/orientation/characterOrder": "left-to-right",
    * "/ldml/layout/orientation/lineOrder": "top-to-bottom" }
 */
export async function loadCLDRXML(locale: string): Promise<Record<string, string>> {
  if (!PreloadableXMLLanguages.includes(locale)) return {};

  return fetch(`/cldr_xml/${locale}.xml`)
    .catch((error) => {
      console.error(`Error fetching XML for locale ${locale}:`, error);
      throw error;
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch XML for locale ${locale}: ${response.statusText}`);
      }
      return response.text();
    })
    .then((xmlString) => xmlToObject(xmlString));
}

function xmlToObject(xmlString: string): Record<string, string> {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, 'application/xml');
  const result: Record<string, string> = {};

  function traverse(node: Element, path: string) {
    let currentPath = `${path}/${node.nodeName}`;
    if (node.attributes) {
      /**
       * Adds attribute as bracket statements
       * //ldml/characterLabels/characterLabelPattern[@type="scripts"]: "scripts — {0}"
       * //ldml/characterLabels/characterLabelPattern[@type="strokes"][@count="one"]: "{0} stroke"
       * //ldml/characterLabels/characterLabelPattern[@type="strokes"][@count="other"]: "{0} strokes"
       */
      Array.from(node.attributes).forEach((attr) => {
        if (attr.name === 'draft') return; // Don't withhold translations based on the draft level, eg. 'provisional' or 'unconfirmed'.
        currentPath += `[@${attr.name}="${attr.value}"]`;
      });
    }
    if (node.children.length === 0 && node.textContent) {
      result[currentPath] = node.textContent.trim();
    } else {
      Array.from(node.children).forEach((child) => traverse(child as Element, currentPath));
    }
  }

  traverse(xmlDoc.documentElement, '/');
  return result;
}

export async function loadCLDRXMLWithInheritance(locale: string): Promise<Record<string, string>> {
  if (locale === 'en-Latf') return await loadCLDRXMLWithInheritance('en');
  const localeXML = await loadCLDRXML(locale).then(parseInheritance);
  const rootXML = await loadCLDRXML('root');
  return { ...rootXML, ...localeXML };
}
