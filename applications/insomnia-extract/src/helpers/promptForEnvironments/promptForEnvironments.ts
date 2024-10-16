import { checkbox } from '@inquirer/prompts';

import { ERRORS } from '../../constants';
import {
  InsomniaEnvironmentResource,
  InsomniaExport,
  InsomniaResourceType,
} from '../../types/insomnia.types';
import { sanitiseCheckboxOption } from '../sanitiseCheckboxOption/sanitiseCheckboxOption';

/**
 * Prompt user to extract the desired collections and environments from the workspace.
 * @param insomniaExport The export file from Insomnia.
 */
export const promptForEnvironments = async (
  insomniaExport: InsomniaExport,
  workspaceId: string,
): Promise<InsomniaEnvironmentResource[]> => {
  const baseEnvironmentResource = insomniaExport.resources.find((resource) => {
    return resource._type === InsomniaResourceType.environment && resource.parentId === workspaceId;
  }) as InsomniaEnvironmentResource | undefined;

  if (!baseEnvironmentResource) {
    throw new Error(ERRORS.MISSING_BASE_ENVIRONMENT);
  }

  const subEnvironments = insomniaExport.resources.filter((resource) => {
    return (
      resource._type === InsomniaResourceType.environment &&
      resource.parentId === baseEnvironmentResource._id
    );
  }) as InsomniaEnvironmentResource[];

  const resourceChoices = [baseEnvironmentResource, ...subEnvironments].map((resource) => {
    const { name } = resource;
    return {
      name: name,
      value: sanitiseCheckboxOption(name),
    };
  });

  const requestedResources = await checkbox({
    message: 'Select which environment(s) you would like to export:',
    choices: resourceChoices,
    loop: false,
  });

  const requestedSubEnvironments = [baseEnvironmentResource, ...subEnvironments].filter(
    (resource) => requestedResources.includes(sanitiseCheckboxOption(resource.name)),
  );

  return requestedSubEnvironments;
};
