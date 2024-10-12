import { faker } from '@faker-js/faker/locale/en';
import fs from 'fs';
import path from 'path';

import { readExport } from './readExport';

jest.mock('path', () => {
  return {
    ...jest.requireActual('path'),
    resolve: jest.fn(),
  };
});
jest.mock('fs', () => {
  return {
    ...jest.requireActual('fs'),
    readFileSync: jest.fn(),
  };
});

describe('readExport', () => {
  let filePath: string;
  let json: object;

  beforeEach(() => {
    filePath = faker.system.filePath();
    json = { some: 'value' };

    (path.resolve as jest.Mock).mockReturnValue(faker.system.filePath());
    (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(json));
  });

  it('should read and parse the export file as json', () => {
    const result = readExport(filePath);
    expect(result).toStrictEqual(json);
  });
});
