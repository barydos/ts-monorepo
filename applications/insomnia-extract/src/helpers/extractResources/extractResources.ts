import { ERRORS } from '../../constants';
import { InsomniaResource } from '../../types/insomnia.types';
import { getSubResources } from '../getSubResources/getSubResources';

/**
 * Returns the desired subset of resources.
 * @param insomniaResources The total resources
 * @param resourceNames The names of the resources to be extracted.
 */
export const extractResources = (
  insomniaResources: InsomniaResource[],
  resourceNames: string[],
): InsomniaResource[] => {
  const resources: InsomniaResource[] = [];

  if (!insomniaResources.length) {
    return resources;
  }

  for (const name of resourceNames) {
    const resourceToTraverse = insomniaResources.find((resource) => resource.name === name);
    if (!resourceToTraverse) {
      throw new Error(`${ERRORS.EXTRACT_RESOURCE_ERROR}: "${name}"`);
    }

    resources.push(resourceToTraverse);
    resources.push(...getSubResources(insomniaResources, resourceToTraverse._id));
  }

  return resources;
};
