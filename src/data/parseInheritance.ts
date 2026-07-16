/**
 * Translators can often say a value should come from a prior value -- sometimes this means "fall back to different"
 * value in the same language, sometimes it means "fall back to the parent language".
 *
 * For example "era-narrow" can fall back to "era-abbr" (eg. AD or BC), but a language can also say
 * "fall back to the parent language" eg. there is no "AD" concept in this language, use the parent.
 *
 * These substitutions are performed sequentially until a non-↑↑↑ value is found.
 */
const inheritanceSubstitutions: [string, string][] = [
  ['eraNarrow', 'eraAbbr'],
  ['eraAbbr', 'eraNames'],
  ['-narrow"]', '-short"]'], // eg. <field type="dayOfYear-narrow"> to <field type="dayOfYear-short">
  ['-short"]', '"]'], // eg.        <field type="dayOfYear-short">  to <field type="dayOfYear">

  // Checking between standalone and format versions happens multiple times because
  // it can happen in either order
  ['[@type="stand-alone"]', '[@type="format"]'],
  ['[@type="format"]', '[@type="stand-alone"]'],

  ['[@type="narrow"]', '[@type="short"]'],
  ['[@type="stand-alone"]', '[@type="format"]'],
  ['[@type="format"]', '[@type="stand-alone"]'],

  ['[@type="short"]', '[@type="abbreviated"]'],
  ['[@type="stand-alone"]', '[@type="format"]'],
  ['[@type="format"]', '[@type="stand-alone"]'],

  ['[@type="abbreviated"]', '[@type="long"]'],
  ['[@type="long"]', '[@type="wide"]'],
  ['[@alt="variant"]', ''],
];

function parseInheritance(data: Record<string, string>): Record<string, string> {
  const entries = Object.entries(data);

  // When entries have `↑↑↑` as the value, they are inheriting the data from something else
  // TODO get better inheritance logic from CLDR, this is a hacky solution for now
  const substitutedEntries = entries.map(([key, value]) => {
    if (value === '↑↑↑') {
      let substituteKey = key;
      inheritanceSubstitutions.forEach(([substitution, replacement]) => {
        if (substituteKey.includes(substitution) && value === '↑↑↑') {
          const newSubstituteKey = substituteKey.replace(substitution, replacement);
          if (data[newSubstituteKey] !== undefined) {
            // Update the key even if the new value is still `↑↑↑`
            substituteKey = newSubstituteKey;
            value = data[substituteKey];
          }
        }
      });
    }
    return [key, value];
  });

  // Otherwise remove values with a ↑↑↑ so it inherits from the parent locale
  const filteredEntries = substitutedEntries.filter(([, value]) => value !== '↑↑↑');
  return Object.fromEntries(filteredEntries);
}

export default parseInheritance;
