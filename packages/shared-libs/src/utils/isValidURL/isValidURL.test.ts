import { faker } from '@faker-js/faker/locale/en';

import { isValidURL } from './isValidURL';

describe('isValidURL', () => {
  let url: string;

  beforeEach(() => {
    jest.spyOn(console, 'error');
    url = faker.internet.url();
  });
  it('should return true if the URL is valid', () => {
    expect(isValidURL(url)).toBe(true);
    expect(console.error).not.toHaveBeenCalled();
  });

  it('should return false if the URL is not valid', () => {
    const invalidUrl = faker.lorem.word();
    expect(isValidURL(invalidUrl)).toBe(false);
    expect(console.error).toHaveBeenCalled();
  });

  it('should return false if the URL is not valid and not log the error', () => {
    jest.spyOn(console, 'error');
    expect(isValidURL(faker.lorem.word(), true)).toBe(false);
    expect(console.error).not.toHaveBeenCalled();
  });
});
