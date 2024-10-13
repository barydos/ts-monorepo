import { createArray } from '@barydos/shared-libs';
import { faker } from '@faker-js/faker/locale/en';

import {
  InsomniaEnvironmentResource,
  InsomniaExport,
  InsomniaResource,
  InsomniaResourceType,
} from '../types/insomnia.types';

export const createMockInsomniaResource = (
  partial: Partial<InsomniaResource> = {},
): InsomniaResource => {
  return {
    _id: faker.string.uuid(),
    _type: faker.helpers.enumValue(InsomniaResourceType),
    name: faker.lorem.word(),
    parentId: faker.string.uuid(),
    ...partial,
  };
};

export const createMockBaseEnvironment = (
  partial: Partial<InsomniaResource> = {},
) => {
  return {
    ...createMockInsomniaResource({
      _type: InsomniaResourceType.environment,
      name: 'Base Environment',
    }),
    ...partial,
  };
};

export const createMockEnvironment = (
  partial: Partial<InsomniaEnvironmentResource> = {},
): InsomniaEnvironmentResource => {
  const data = partial.data ?? {
    API_URL: faker.lorem.word(),
    API_KEY: faker.lorem.word(),
  };

  return {
    ...createMockInsomniaResource({ _type: InsomniaResourceType.environment }),
    data,
    ...partial,
  } as InsomniaEnvironmentResource;
};

export const createMockEnvironmentResources = (
  workspaceId?: string,
): InsomniaEnvironmentResource[] => {
  workspaceId = workspaceId ?? faker.string.uuid();

  const baseEnvironment = createMockBaseEnvironment({ parentId: workspaceId });
  return [
    ...createArray(faker.number.int({ min: 1, max: 5 }), () =>
      createMockEnvironment({ parentId: baseEnvironment._id }),
    ),
    baseEnvironment,
  ];
};
export const createMockInsomniaExport = (
  workspaceId?: string,
  partial: Partial<InsomniaExport> = {},
): InsomniaExport => {
  const mockInsomniaWorkspace = createMockInsomniaResource({
    _id: workspaceId,
    _type: InsomniaResourceType.workspace,
  });

  const typesExclWorkspace = Object.values(
    InsomniaResourceType,
  ) as InsomniaResourceType[];
  const resources = createArray(faker.number.int({ min: 1, max: 5 }), () => {
    const type = faker.helpers.arrayElement(typesExclWorkspace);
    return createMockInsomniaResource({ _type: type });
  });

  return {
    _type: InsomniaResourceType.export,
    __export_format: 4,
    __export_date: new Date().toUTCString(),
    __export_source: 'insomnia.desktop.app:v2021.5.0',
    resources: [...resources, mockInsomniaWorkspace],
    ...partial,
  };
};
