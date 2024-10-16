/**
 * Removes the reference to the base environment.
 * Insomnia exports contain the base environment which include syntax such as {{ _.VAR }}.
 * @returns The export with {{ _.VAR }} converted to {{ VAR}}.
 */
export const replaceVariablePlaceholders = (insomniaExport: string): object => {
  const regex = /(?!<=\\":\\"\{\{ )_\./g;

  const replacedString = insomniaExport.replace(regex, '');
  return JSON.parse(replacedString);
};
