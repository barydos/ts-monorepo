import { faker } from '@faker-js/faker/locale/en';

import { sanitiseCheckboxOption } from './sanitiseCheckboxOption';

describe('sanitisecheckboxOption', () => {
  let input: string;

  beforeEach(() => {
    input = faker.lorem.words();
  });

  it('should remove all spaces from string', () => {
    expect(sanitiseCheckboxOption(input)).toBe(input.split(' ').join(''));
  });

  it('should return the same string as there are no spaces to begin with', () => {
    input = faker.lorem.word();
    expect(sanitiseCheckboxOption(input)).toBe(input);
  });
});
