export enum InsomniaResourceType {
  environment = 'environment',
  export = 'export',
  request = 'request',
  request_group = 'request_group',
  workspace = 'workspace',
}

export interface InsomniaResource {
  _id: string;
  parentId: string;
  name: string;
  _type: InsomniaResourceType;
}

export interface InsomniaEnvironmentResource extends InsomniaResource {
  data: Record<string, string>;
  _type: InsomniaResourceType.environment;
}

export interface InsomniaExport {
  __export_date: string;
  __export_format: number;
  __export_source: string;
  _type: InsomniaResourceType.export;
  resources: InsomniaResource[];
}
