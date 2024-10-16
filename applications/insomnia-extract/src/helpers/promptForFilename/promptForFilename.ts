import { input } from '@inquirer/prompts';
import fs from 'fs';
import path from 'path';

import { formatDate } from '../../utils';

/**
 * Prompts user to provide a json filename which does not already exist in the filesystem.
 */
export const promptForFilename = async () => {
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

  return filename;
};
