import { createArray } from '@barydos/shared-libs';
import { faker } from '@faker-js/faker/locale/en';

import { createMockInsomniaResource } from '../../mocks';
import { InsomniaResource } from '../../types';
import { getSubResources } from './getSubResources';

describe('getSubResources', () => {
  let resources: InsomniaResource[];
  let parentId: string;

  beforeEach(() => {
    resources = createArray(faker.number.int({ min: 1, max: 5 }), createMockInsomniaResource);
    parentId = faker.string.uuid();
  });

  it('should return an empty array if no sub-resources found', () => {
    parentId = 'invalid-parent-id';
    expect(getSubResources(resources, parentId)).toStrictEqual([]);
  });

  it('should recursively look for any child resources', () => {
    /* eslint-disable @typescript-eslint/no-non-null-assertion */

    // Setup 3 resources with the associated parent ID
    const subResources = createArray(3, createMockInsomniaResource, { parentId });

    // Setup 2 child resources of one of the above resources
    const subSubResources = createArray(2, createMockInsomniaResource, {
      parentId: subResources[1]!._id,
    });

    resources.push(...subResources, ...subSubResources);

    const result = getSubResources(resources, parentId);
    expect(result.length).toBe(5);

    /* eslint-enable @typescript-eslint/no-non-null-assertion */
  });
});
