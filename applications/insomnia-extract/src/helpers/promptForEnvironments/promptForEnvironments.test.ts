import { faker } from '@faker-js/faker/locale/en';

import { createMockEnvironmentResources, createMockInsomniaExport } from '../../mocks';
import { InsomniaEnvironmentResource, InsomniaExport } from '../../types';
import { promptForEnvironments } from './promptForEnvironments';

jest.mock('@inquirer/prompts', () => {
  return {
    ...jest.requireActual('@inquirer/prompts'),
    checkbox: jest.fn(),
  };
});

describe('promptForEnvironments', () => {
  let insomniaExport: InsomniaExport;
  let environmentResources: InsomniaEnvironmentResource[];
  let workspaceId: string;

  beforeEach(() => {
    workspaceId = faker.string.uuid();
    environmentResources = createMockEnvironmentResources(workspaceId);
    insomniaExport = createMockInsomniaExport(workspaceId);
    insomniaExport.resources.push(...environmentResources);
  });

  it('should ', () => {
    promptForEnvironments(insomniaExport, workspaceId);
  });
});
