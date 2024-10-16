import fs from 'fs';
import path from 'path';

import { ERRORS, INSOMNIA_STRINGS } from '../constants';
import {
  getWorkspace,
  promptForCollections,
  promptForEnvironments,
  promptForFilename,
  removeSecretValues,
  replaceVariablePlaceholders,
} from '../helpers';
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
    throw new Error(ERRORS.EXPORT_READ_FAILURE);
  }

  const workspaceResource = getWorkspace(insomniaExport);
  if (!workspaceResource) {
    throw new Error(ERRORS.MISSING_WORKSPACE);
  }

  const requestedCollections = await promptForCollections(insomniaExport, workspaceResource._id);
  const requestedEnvironments = await promptForEnvironments(insomniaExport, workspaceResource._id);

  if (requestedEnvironments.length) {
    await removeSecretValues(requestedEnvironments);
  }

  let extractedExport = structuredClone(insomniaExport);
  extractedExport.resources = [
    workspaceResource,
    ...requestedCollections,
    ...requestedEnvironments,
  ];

  if (requestedEnvironments.length) {
    if (requestedEnvironments.every((env) => env.name !== INSOMNIA_STRINGS.baseEnvironment)) {
      extractedExport = replaceVariablePlaceholders(
        JSON.stringify(extractedExport),
      ) as InsomniaExport;
    }
  }

  const filename = await promptForFilename();

  console.log(`Outputting to: ${filename}`);
  fs.writeFileSync(filename, JSON.stringify(extractedExport, null, 2));

  console.log('');
  console.log('Complete!');
};
