import path from 'path';

import { InsomniaExport } from '../types/insomnia.types';
import { readExport } from '../utils';

/**
 * The program to extract the desired subset of the exported Insomnia resources.
 */
export const app = async () => {
  // TODO: read file from user input instead
  const jsonFilePath = path.resolve(
    'fixtures/extracted_insomnia_export_20240919_103031.json',
  );

  try {
    const insomniaExport = readExport(jsonFilePath) as InsomniaExport;
    console.log(insomniaExport);
  } catch (err) {
    console.error(err);
    throw new Error('Could not read Insomnia export file');
  }
};
