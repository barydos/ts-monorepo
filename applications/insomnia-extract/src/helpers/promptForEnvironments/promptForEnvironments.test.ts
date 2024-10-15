import { faker } from '@faker-js/faker/locale/en';
import { checkbox } from '@inquirer/prompts';

import { ERRORS } from '../../constants';
import { createMockEnvironmentResources, createMockInsomniaExport } from '../../mocks';
import { InsomniaEnvironmentResource, InsomniaExport } from '../../types';
import { promptForEnvironments } from './promptForEnvironments';

jest.mock('@inquirer/prompts', () => {
  return {
    ...jest.requireActual('@inquirer/prompts'),
    checkbox: jest.fn(),
  };
});

describe('promptForEnvironments', () => {
  let insomniaExport: InsomniaExport;
  let environmentResources: InsomniaEnvironmentResource[];
  let workspaceId: string;

  beforeEach(() => {
    workspaceId = faker.string.uuid();
    environmentResources = createMockEnvironmentResources(workspaceId);
    insomniaExport = createMockInsomniaExport(workspaceId);
    insomniaExport.resources = environmentResources;
  });

  it('should throw an error if the base environment is missing from the export', async () => {
    insomniaExport.resources = [];

    await expect(() => promptForEnvironments(insomniaExport, workspaceId)).rejects.toThrow(
      new Error(ERRORS.MISSING_BASE_ENVIRONMENT),
    );

    expect(checkbox).not.toHaveBeenCalled();
  });

  it('should return all the environments along with the base environment', async () => {
    const nonBaseEnvironmentsOptions = environmentResources
      .slice(1)
      .map((resource) => resource.name);
    (checkbox as jest.Mock).mockResolvedValueOnce(nonBaseEnvironmentsOptions);

    const result = await promptForEnvironments(insomniaExport, workspaceId);
    expect(checkbox).toHaveBeenCalled();
    expect(result).toStrictEqual(environmentResources);
  });

  it('should return only the selected environments along with the base environment', async () => {
    (checkbox as jest.Mock).mockResolvedValueOnce([
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      environmentResources[environmentResources.length - 1]!.name,
    ]);

    const result = await promptForEnvironments(insomniaExport, workspaceId);
    expect(checkbox).toHaveBeenCalled();
    expect(result).toStrictEqual([
      environmentResources[0],
      environmentResources[environmentResources.length - 1],
    ]);
  });
});
