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

  const insomniaExport = createMockInsomniaExport({
    resources: [workspaceResource, otherResource],
  });

  it('should return undefined if workspace resource does not exist', () => {
    const result = getWorkspace(insomniaExport);
    expect(result).toStrictEqual(workspaceResource);
  });
});
