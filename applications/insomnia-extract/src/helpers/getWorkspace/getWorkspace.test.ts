import { createMockInsomniaExport, createMockInsomniaResource } from '../../mocks';
import { InsomniaResourceType } from '../../types/insomnia.types';
import { getWorkspace } from './getWorkspace';

describe('getWorkspace', () => {
  const workspaceResource = createMockInsomniaResource({
    _type: InsomniaResourceType.workspace,
  });
  const otherResource = createMockInsomniaResource({
    _type: InsomniaResourceType.request_group,
  });

  const insomniaExport = createMockInsomniaExport(undefined, {
    resources: [workspaceResource, otherResource],
  });

  it('should return undefined if workspace resource does not exist', () => {
    const insomniaExportMissingWorkspace = structuredClone(insomniaExport);
    insomniaExportMissingWorkspace.resources = [otherResource];

    const result = getWorkspace(insomniaExportMissingWorkspace);
    expect(result).toBeUndefined();
  });

  it('should return the workspace resource if it exists', () => {
    const result = getWorkspace(insomniaExport);
    expect(result).toStrictEqual(workspaceResource);
  });
});
