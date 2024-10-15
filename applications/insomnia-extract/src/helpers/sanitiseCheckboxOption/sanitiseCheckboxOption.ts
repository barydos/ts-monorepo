/**
 * Sanitise string as checkbox options from '@inquirer/prompts' do not permit spaces.
 */
export const sanitiseCheckboxOption = (value: string) => value.replace(/\s/g, '');
