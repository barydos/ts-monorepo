import { checkbox } from '@inquirer/prompts';

import { createMockEnvironmentResources } from '../../mocks';
import { InsomniaEnvironmentResource } from '../../types';
import { removeSecretValues } from './removeSecretValues';

jest.mock('@inquirer/prompts', () => {
  return {
    ...jest.requireActual('@inquirer/prompts'),
    checkbox: jest.fn(),
  };
});

describe('removeSecretValues', () => {
  let insomniaResources: InsomniaEnvironmentResource[];

  beforeEach(() => {
    jest.resetAllMocks();

    insomniaResources = createMockEnvironmentResources();

    // Blank spaces are not permitted by "checkbox", so "Base Environment" becomes "BaseEnvironment"
    (checkbox as jest.Mock).mockResolvedValueOnce(
      insomniaResources.map((resource) => resource.name.replace(/ /g, '')),
    );
  });

  it('should immediately return if input is empty', async () => {
    const emptyInput: InsomniaEnvironmentResource[] = [];
    await removeSecretValues(emptyInput);

    expect(emptyInput).toStrictEqual([]);
    expect(checkbox).not.toHaveBeenCalled();
  });

  it('should return without modifying any environment if none selected', async () => {
    (checkbox as jest.Mock).mockReset().mockResolvedValueOnce([]);
    await removeSecretValues(insomniaResources);

    expect(insomniaResources).toStrictEqual(insomniaResources);
    expect(checkbox).toHaveBeenCalledTimes(1);
  });

  it('should return without modifying any environment variables if none found in environment', async () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    insomniaResources[1]!.data = {};
    (checkbox as jest.Mock).mockReset().mockResolvedValueOnce([insomniaResources[1]?.name]);
    await removeSecretValues(insomniaResources);

    expect(insomniaResources).toStrictEqual(insomniaResources);
    expect(checkbox).toHaveBeenCalledTimes(1);
  });

  it('should return without modifying any environment variables despite having selected some environments', async () => {
    // Mock no variable selectd within the environments
    (checkbox as jest.Mock).mockImplementation(() => []);
    await removeSecretValues(insomniaResources);

    expect(insomniaResources).toStrictEqual(insomniaResources);
    // One call to select environments, then one for each environment to select variable to hide
    expect(checkbox).toHaveBeenCalledTimes(insomniaResources.length + 1);
  });

  it('should modify some of the environment variables of the selected environments', async () => {
    // Mock all variable values to be hidden
    insomniaResources.forEach((environment) => {
      (checkbox as jest.Mock).mockResolvedValueOnce(Object.keys(environment.data));
    });

    await removeSecretValues(insomniaResources);

    expect(insomniaResources).toStrictEqual(insomniaResources);
    // One call to select environments, then one for each environment to select variable to hide
    expect(checkbox).toHaveBeenCalledTimes(insomniaResources.length + 1);

    insomniaResources.forEach((resource) => {
      const areValuesBlank = Object.values(resource.data).every((val) => val === '');
      expect(areValuesBlank).toBe(true);
    });
  });
});
