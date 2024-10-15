import { checkbox } from '@inquirer/prompts';

import { InsomniaEnvironmentResource } from '../../types/insomnia.types';

/**
 * Returns the environment resources with values optionally removed.
 * @param environmentResources The Insomnia resources of type 'environment'.
 */
export const removeSecretValues = async (
  insomniaResources: InsomniaEnvironmentResource[],
): Promise<void> => {
  if (insomniaResources.length === 0) {
    return;
  }

  const environmentChoices = insomniaResources.map((resource) => {
    const { name } = resource;
    return {
      name: name,
      value: name,
    };
  });

  const environmentsToUpdate = await checkbox({
    choices: environmentChoices,
    message: 'Select the environment(s) which contain secrets to remove',
  });

  if (environmentsToUpdate.length === 0) {
    return;
  }

  const environmentResourcesToUpdate = insomniaResources.filter((resource) =>
    environmentsToUpdate.includes(resource.name),
  );
  for (const environment of environmentResourcesToUpdate) {
    const { name, data } = environment;

    const environmentVariables = Object.keys(data);
    const environmentVariableChoices = environmentVariables.map((key) => {
      return {
        name: key,
        value: key,
      };
    });

    const promptMessage = `[${name}] Please select which values you'd like to remove:`;
    const variablesToUpdate = await checkbox({
      message: promptMessage,
      choices: environmentVariableChoices,
      loop: false,
    });

    for (const variable of variablesToUpdate) {
      data[variable] = '';
    }
  }
};
