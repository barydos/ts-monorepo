import { createArray } from '@barydos/shared-libs';
import { faker } from '@faker-js/faker/locale/en';

import {
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

export const createMockInsomniaExport = (
  partial: Partial<InsomniaExport> = {},
): InsomniaExport => {
  const resources = createArray(faker.number.int({ min: 1, max: 5 }), () =>
    createMockInsomniaResource(),
  );

  return {
    _type: InsomniaResourceType.export,
    __export_format: 4,
    __export_date: new Date().toUTCString(),
    __export_source: 'insomnia.desktop.app:v2021.5.0',
    resources,
    ...partial,
  };
};
