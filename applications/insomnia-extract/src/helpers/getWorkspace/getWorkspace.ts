import {
  InsomniaExport,
  InsomniaResourceType,
} from '../../types/insomnia.types';

/**
 * Returns the workspace resource in the Insomnia export.
 */
export const getWorkspace = (insomniaExport: InsomniaExport) => {
  const workspace = insomniaExport.resources.find(
    (resource) => resource._type === InsomniaResourceType.workspace,
  );

  return workspace;
};
