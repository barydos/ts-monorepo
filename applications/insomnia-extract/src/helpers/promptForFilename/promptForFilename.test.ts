import { faker } from '@faker-js/faker';
import { input } from '@inquirer/prompts';
import fs from 'fs';

import { formatDate } from '../../utils';
import { promptForFilename } from './promptForFilename';

jest.mock('@inquirer/prompts', () => {
  return {
    ...jest.requireActual('@inquirer/prompts'),
    input: jest.fn(),
  };
});

jest.mock('fs', () => {
  return {
    ...jest.requireActual('fs'),
    existsSync: jest.fn(),
  };
});

jest.mock('../../utils', () => {
  return {
    formatDate: jest.fn(),
  };
});

describe('promptForFilename', () => {
  let userInput: string;
  let defaultFilename: string;

  beforeEach(() => {
    userInput = faker.system.commonFileName('json');

    const mockDatetimeString = faker.lorem.word();
    (formatDate as jest.Mock).mockReturnValue(mockDatetimeString);
    defaultFilename = `extracted_insomnia_export_${mockDatetimeString}.json`;

    (input as jest.Mock).mockResolvedValueOnce(userInput);
    (fs.existsSync as jest.Mock).mockReset().mockReturnValueOnce(false);
  });

  it('should return the default filename is user does not provide an input', async () => {
    (input as jest.Mock).mockReset().mockResolvedValue('');

    const result = await promptForFilename();
    expect(result).toBe(defaultFilename);
  });

  it('should automatically append .json for filenames missing the file extension', async () => {
    (input as jest.Mock).mockReset().mockResolvedValue('missing-ext');

    const result = await promptForFilename();
    expect(result).toBe('missing-ext.json');
  });

  it('should prompt again for filename if provided filename already exists in filesystem', async () => {
    const acceptedFilename = faker.system.commonFileName('json');

    (fs.existsSync as jest.Mock).mockReset().mockReturnValueOnce(true).mockReturnValueOnce(false);
    (input as jest.Mock)
      .mockReset()
      .mockResolvedValueOnce(userInput)
      .mockResolvedValueOnce(acceptedFilename);

    const result = await promptForFilename();
    expect(result).toBe(acceptedFilename);
    expect(input).toHaveBeenCalledTimes(2);
  });

  it('should return the custom filename provided by the user input', async () => {
    const result = await promptForFilename();
    expect(result).toBe(userInput);
    expect(input).toHaveBeenCalledTimes(1);
  });
});
