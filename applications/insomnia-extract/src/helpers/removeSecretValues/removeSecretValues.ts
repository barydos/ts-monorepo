import { checkbox } from '@inquirer/prompts';

import { ERRORS } from '../../constants';
import { InsomniaEnvironmentResource } from '../../types/insomnia.types';
import { sanitiseCheckboxOption } from '../sanitiseCheckboxOption/sanitiseCheckboxOption';

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
      value: sanitiseCheckboxOption(name),
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
    environmentsToUpdate.includes(sanitiseCheckboxOption(resource.name)),
  );

  for (const environment of environmentResourcesToUpdate) {
    const { name, data } = environment;

    const environmentVariables = Object.keys(data);

    if (!environmentVariables.length) {
      console.log(`${ERRORS.NO_ENVIRONMENT_VARIABLES}: "${name}"`);
      console.log('');
      continue;
    }

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
