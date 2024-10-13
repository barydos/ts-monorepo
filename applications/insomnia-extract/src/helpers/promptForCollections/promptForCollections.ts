import { checkbox, confirm } from '@inquirer/prompts';

import {
  InsomniaExport,
  InsomniaResourceType,
} from '../../types/insomnia.types';
import { extractResources } from '../extractResources/extractResources';

/**
 * Prompt user to extract the desired collections and environments from the workspace.
 * @param insomniaExport The export file from Insomnia.
 */
export const promptForCollections = async (
  insomniaExport: InsomniaExport,
  workspaceId: string,
) => {
  const collectionResources = insomniaExport.resources.filter((resource) => {
    return (
      resource._type === InsomniaResourceType.request_group &&
      resource.parentId === workspaceId
    );
  });

  if (!collectionResources.length) {
    const confirmation = await confirm({
      message: 'No collection found, continue?',
    });

    if (!confirmation) {
      process.exit(0);
    }

    return [];
  }

  const collectionOptions = collectionResources.map((resource) => {
    const { name } = resource;
    return {
      name: name,
      value: name,
    };
  });

  const selectedCollections = await checkbox({
    message: 'Select which collection(s) you would like to export',
    choices: collectionOptions,
    loop: false,
  });

  return extractResources(insomniaExport.resources, selectedCollections);
};
