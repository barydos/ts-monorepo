import { checkbox } from '@inquirer/prompts';

import {
  InsomniaEnvironmentResource,
  InsomniaExport,
  InsomniaResourceType,
} from '../../types/insomnia.types';

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
    throw new Error('Missing base environment');
  }

  const subEnvironments = insomniaExport.resources.filter((resource) => {
    return (
      resource._type === InsomniaResourceType.environment &&
      resource.parentId === baseEnvironmentResource._id
    );
  }) as InsomniaEnvironmentResource[];

  const resourceChoices = subEnvironments.map((resource) => {
    const { name } = resource;
    return {
      name: name,
      value: name,
    };
  });

  const requestedResources = await checkbox({
    message: 'Select which environment(s) you would like to export:',
    choices: resourceChoices,
    loop: false,
  });

  const requestedSubEnvironments = subEnvironments.filter((resource) =>
    requestedResources.includes(resource.name),
  );

  return [baseEnvironmentResource, ...requestedSubEnvironments];
};
