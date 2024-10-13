import path from 'path';

import { getWorkspace } from '../helpers';
import { promptForCollections } from '../helpers/promptForCollections/promptForCollections';
import { promptForEnvironments } from '../helpers/promptForEnvironments/promptForEnvironments';
import { InsomniaExport } from '../types';
import { readExport } from '../utils';

/**
 * The program to extract the desired subset of the exported Insomnia resources.
 */
export const app = async () => {
  // TODO: read file from user input instead
  const jsonFilePath = path.resolve(
    // 'fixtures/extracted_insomnia_export_20240919_103031.json',
    'fixtures/Insomnia_2024-10-13.json',
  );

  let insomniaExport: InsomniaExport;
  try {
    insomniaExport = readExport(jsonFilePath) as InsomniaExport;
  } catch (err) {
    console.error(err);
    throw new Error('Could not read Insomnia export file');
  }

  const workspaceResource = getWorkspace(insomniaExport);
  if (!workspaceResource) {
    throw new Error('Missing workspace resource');
  }

  const requestedCollections = await promptForCollections(
    insomniaExport,
    workspaceResource._id,
  );
  console.log(requestedCollections);
  const requestedEnvironments = await promptForEnvironments(
    insomniaExport,
    workspaceResource._id,
  );
  console.log(requestedEnvironments);
};
