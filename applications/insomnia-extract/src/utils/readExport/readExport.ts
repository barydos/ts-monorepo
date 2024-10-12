import fs from 'fs';
import path from 'path';

/**
 * Read the JSON export file.
 */
export const readExport = (jsonFilePath: string): object => {
  const resolvedFilePath = path.resolve(jsonFilePath);
  const jsonFile = fs.readFileSync(resolvedFilePath, 'utf-8');
  const jsonData = JSON.parse(jsonFile);

  return jsonData;
};
