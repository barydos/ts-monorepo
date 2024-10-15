import { createArray } from '@barydos/shared-libs';
import { faker } from '@faker-js/faker/locale/en';

import { ERRORS } from '../../constants';
import { createMockInsomniaResource } from '../../mocks';
import { InsomniaResource } from '../../types';
import { getSubResources } from '../getSubResources/getSubResources';
import { extractResources } from './extractResources';

jest.mock('../getSubResources/getSubResources');

describe('extractResources', () => {
  let resourceNames: string[];
  let resources: InsomniaResource[];

  beforeEach(() => {
    jest.resetAllMocks();

    resourceNames = createArray(faker.number.int({ min: 1, max: 5 }), () => faker.lorem.word());
    resources = resourceNames.map((name) => createMockInsomniaResource({ name }));

    (getSubResources as jest.Mock).mockReturnValue([]);
  });

  it('should return an empty array if input resources is empty', () => {
    resources.length = 0;

    const result = extractResources(resources, resourceNames);
    expect(result).toStrictEqual([]);
    expect(getSubResources).not.toHaveBeenCalled();
  });

  it('should return an empty array if resource names is empty', () => {
    resourceNames.length = 0;

    const result = extractResources(resources, resourceNames);
    expect(result).toStrictEqual([]);
    expect(getSubResources).not.toHaveBeenCalled();
  });

  it('should throw an error if root resource cannot be found', () => {
    const invalidResourceName = 'invalid-resource';
    expect(() => extractResources(resources, [invalidResourceName])).toThrow(
      new Error(`${ERRORS.EXTRACT_RESOURCE_ERROR}: "${invalidResourceName}"`),
    );
  });

  it('should only return the root resource if no child resources are found', () => {
    const result = extractResources(resources, resourceNames);
    expect(result.length).toBe(resources.length);
    expect(getSubResources).toHaveBeenCalledTimes(resources.length);
  });

  it('should return the root resource along with its child resources(e.g. subfolders)', () => {
    (getSubResources as jest.Mock)
      .mockReset()
      .mockReturnValueOnce([createMockInsomniaResource()])
      .mockReturnValueOnce([createMockInsomniaResource(), createMockInsomniaResource()])
      .mockReturnValue([]);

    const result = extractResources(resources, resourceNames);
    expect(result.length).toBe(resources.length + 3);
  });
});
