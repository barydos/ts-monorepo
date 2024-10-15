import { input } from '@inquirer/prompts';
import fs from 'fs';
import path from 'path';

import { getWorkspace } from '../helpers';
import { promptForCollections } from '../helpers/promptForCollections/promptForCollections';
import { promptForEnvironments } from '../helpers/promptForEnvironments/promptForEnvironments';
import { removeSecretValues } from '../helpers/removeSecretValues/removeSecretValues';
import { replaceVariablePlaceholders } from '../helpers/replaceVariablePlaceholders/replaceVariablePlaceholders';
import { InsomniaExport } from '../types';
import { formatDate, readExport } from '../utils';

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

  if (!requestedEnvironments.some((env) => env.name === 'Base Environment')) {
    extractedExport = replaceVariablePlaceholders(
      JSON.stringify(extractedExport),
    ) as InsomniaExport;
  }

  const datetimeString = formatDate(new Date());
  const defaultFilename = `extracted_insomnia_export_${datetimeString}.json`;

  let filename = '';
  let validFilename = false;

  while (!validFilename) {
    filename = await input({
      message: 'Optional custom filename?',
      default: defaultFilename,
    });

    filename = filename.trim();

    if (filename === '') {
      filename = defaultFilename;
    } else if (!filename.endsWith('.json')) {
      filename = `${filename}.json`;
    }

    if (fs.existsSync(filename)) {
      console.warn(`File already exists: "${path.resolve(filename)}"`);
      continue;
    }

    validFilename = true;
  }

  console.log(`Outputting to: ${filename}`);
  fs.writeFileSync(filename, JSON.stringify(extractedExport, null, 2));

  console.log('');
  console.log('Complete!');
};
