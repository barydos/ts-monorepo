import { createArray } from '@barydos/shared-libs';
import { faker } from '@faker-js/faker';
import fs from 'fs';

import { ERRORS } from '../constants';
import {
  getWorkspace,
  promptForCollections,
  promptForEnvironments,
  promptForFilename,
  removeSecretValues,
  replaceVariablePlaceholders,
} from '../helpers';
import {
  createMockEnvironmentResources,
  createMockInsomniaExport,
  createMockInsomniaResource,
} from '../mocks';
import {
  InsomniaEnvironmentResource,
  InsomniaExport,
  InsomniaResource,
  InsomniaResourceType,
} from '../types';
import { readExport } from '../utils';
import { app } from './app';

jest.mock('@inquirer/prompts', () => {
  return {
    ...jest.requireActual('@inquirer/prompts'),
    input: jest.fn(),
  };
});

jest.mock('fs', () => {
  return {
    ...jest.requireActual('fs'),
    writeFileSync: jest.fn(),
  };
});

jest.mock('../helpers', () => {
  return {
    getWorkspace: jest.fn(),
    promptForEnvironments: jest.fn(),
    promptForCollections: jest.fn(),
    promptForFilename: jest.fn(),
    removeSecretValues: jest.fn(),
    replaceVariablePlaceholders: jest.fn(),
  };
});

jest.mock('../utils', () => {
  return {
    readExport: jest.fn(),
  };
});

describe('app', () => {
  let workspaceId: string;
  let insomniaExport: InsomniaExport;

  let workspace: InsomniaResource;
  let collections: InsomniaResource[];
  let environments: InsomniaEnvironmentResource[];

  let replacedExport: InsomniaExport;
  let outputExport: InsomniaExport;
  let outputFilename: string;

  beforeEach(() => {
    jest.resetAllMocks();

    workspaceId = faker.string.uuid();
    insomniaExport = createMockInsomniaExport(workspaceId);

    workspace = insomniaExport.resources[0] as InsomniaResource;
    collections = createArray(2, createMockInsomniaResource, {
      parentId: workspaceId,
      _type: InsomniaResourceType.request_group,
    });
    environments = createMockEnvironmentResources(workspaceId);

    replacedExport = createMockInsomniaExport(workspaceId);
    outputExport = {
      ...insomniaExport,

      resources: [workspace, ...collections, ...environments],
    };
    outputFilename = faker.system.commonFileName('json');

    (readExport as jest.Mock).mockReturnValueOnce(insomniaExport);
    (getWorkspace as jest.Mock).mockReturnValueOnce(insomniaExport.resources[0]);
    (promptForCollections as jest.Mock).mockResolvedValueOnce(collections);
    (promptForEnvironments as jest.Mock).mockResolvedValueOnce(environments);
    (promptForFilename as jest.Mock).mockResolvedValueOnce(outputFilename);
    (replaceVariablePlaceholders as jest.Mock).mockReturnValueOnce(replacedExport);
  });

  it('should throw an error if export file cannot be read', async () => {
    (readExport as jest.Mock).mockReset().mockImplementation(() => {
      throw new Error();
    });

    expect(() => app()).rejects.toThrow(new Error(ERRORS.EXPORT_READ_FAILURE));
  });

  it('should throw an error if workspace resource is missing from export file', async () => {
    (getWorkspace as jest.Mock).mockReset().mockReturnValue(undefined);

    expect(() => app()).rejects.toThrow(new Error(ERRORS.MISSING_WORKSPACE));
  });

  it('should not try to remove secret values if no environments selected', async () => {
    (promptForEnvironments as jest.Mock).mockReset().mockResolvedValueOnce([]);
    outputExport = {
      ...insomniaExport,
      resources: [workspace, ...collections],
    };

    await app();
    expect(removeSecretValues).not.toHaveBeenCalled();
    expect(replaceVariablePlaceholders).not.toHaveBeenCalled();
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      outputFilename,
      JSON.stringify(outputExport, null, 2),
    );
  });

  it('should replace _. syntax if base environment is not selected', async () => {
    const environmentsNoBase = createMockEnvironmentResources().slice(1);

    (promptForEnvironments as jest.Mock).mockReset().mockResolvedValueOnce(environmentsNoBase);
    outputExport = {
      ...insomniaExport,
      resources: [workspace, ...collections, ...environmentsNoBase],
    };

    await app();
    expect(removeSecretValues).toHaveBeenCalled();
    expect(replaceVariablePlaceholders).toHaveBeenCalled();
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      outputFilename,
      JSON.stringify(replacedExport, null, 2),
    );
  });

  it('should not replace _. syntax if base environment is selected', async () => {
    await app();
    expect(removeSecretValues).toHaveBeenCalled();
    expect(replaceVariablePlaceholders).not.toHaveBeenCalled();
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      outputFilename,
      JSON.stringify(outputExport, null, 2),
    );
  });
});
