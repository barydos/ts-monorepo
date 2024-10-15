import { faker } from '@faker-js/faker/locale/en';
import { checkbox, confirm } from '@inquirer/prompts';

import {
  createMockEnvironmentResources,
  createMockInsomniaExport,
  createMockInsomniaResource,
} from '../../mocks';
import {
  InsomniaEnvironmentResource,
  InsomniaExport,
  InsomniaResource,
  InsomniaResourceType,
} from '../../types';
import { extractResources } from '../extractResources/extractResources';
import { promptForCollections } from './promptForCollections';

jest.mock('../extractResources/extractResources');
jest.mock('@inquirer/prompts', () => {
  return {
    ...jest.requireActual('@inquirer/prompts'),
    checkbox: jest.fn(),
    confirm: jest.fn(),
  };
});

describe('promptForCollections', () => {
  let insomniaExport: InsomniaExport;
  let environmentResources: InsomniaEnvironmentResource[];
  let workspaceId: string;

  let extractedResources: InsomniaResource[];

  beforeEach(() => {
    jest.resetAllMocks();

    workspaceId = faker.string.uuid();
    environmentResources = createMockEnvironmentResources(workspaceId);
    insomniaExport = createMockInsomniaExport(workspaceId);
    insomniaExport.resources = environmentResources;

    (checkbox as jest.Mock).mockImplementation();
    (confirm as jest.Mock).mockResolvedValueOnce(true);
    (extractResources as jest.Mock).mockResolvedValueOnce(extractedResources);
  });

  it('should prompt user if no collection found and exit safely', async () => {
    (confirm as jest.Mock).mockReset().mockResolvedValueOnce(false);
    jest.spyOn(process, 'exit').mockImplementation();

    insomniaExport.resources = [];

    await promptForCollections(insomniaExport, workspaceId);
    expect(process.exit).toHaveBeenCalledWith(0);
  });

  it('should prompt user if no collection found and continue', async () => {
    insomniaExport.resources = [];

    const result = await promptForCollections(insomniaExport, workspaceId);
    expect(result).toStrictEqual([]);
  });

  it('should extract resources from the selected collections', async () => {
    const collection = createMockInsomniaResource({
      _type: InsomniaResourceType.request_group,
      parentId: workspaceId,
    });
    insomniaExport.resources = [collection];

    const result = await promptForCollections(insomniaExport, workspaceId);
    expect(result).toStrictEqual(extractedResources);

    expect(confirm).not.toHaveBeenCalled;
    expect(checkbox).toHaveBeenCalled();
    expect((checkbox as jest.Mock).mock.calls[0][0].choices).toStrictEqual([
      { name: collection.name, value: collection.name },
    ]);
    expect(extractResources).toHaveBeenCalled();
  });
});
