import { InsomniaResource } from '../../types';

/**
 * Return child resources recursively, if found.
 */
export const getSubResources = (
  insomniaResources: InsomniaResource[],
  parentId: string,
): InsomniaResource[] => {
  const resources: InsomniaResource[] = [];

  const childResources = insomniaResources.filter((resource) => resource.parentId === parentId);

  for (const resource of childResources) {
    const id = resource._id;
    resources.push(resource, ...getSubResources(insomniaResources, id));
  }

  return resources;
};
