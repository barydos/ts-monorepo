import { faker } from '@faker-js/faker/locale/en';

import { replaceVariablePlaceholders } from './replaceVariablePlaceholders';

describe('replaceVariablePlaceholders', () => {
  let varName: string;
  let json: object;

  beforeEach(() => {
    varName = faker.lorem.word().toUpperCase();
    json = { KEY: `{{ _.${varName} }}` };
  });

  it('should replace "_." from the JSON string', () => {
    const result = replaceVariablePlaceholders(JSON.stringify(json));
    expect(result).toStrictEqual({ KEY: `{{ ${varName} }}` });
  });

  it('should return the JSON string as is', () => {
    expect(replaceVariablePlaceholders(JSON.stringify({ KEY: varName }))).toStrictEqual({
      KEY: varName,
    });
  });
});
