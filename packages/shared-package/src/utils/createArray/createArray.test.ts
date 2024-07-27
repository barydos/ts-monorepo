import { faker } from '@faker-js/faker';

import { createArray } from './createArray';

describe('createArray', () => {
  let size: number;

  beforeEach(() => {
    size = faker.number.int({ min: 0, max: 100 });
  });

  it('should create an array of specified size', () => {
    expect(createArray(size).length).toBe(size);
  });

  it('should create an array of specified size with a mapper function', () => {
    const callback = jest.fn();
    expect(createArray(size, callback).length).toBe(size);
    expect(callback).toHaveBeenCalled();
  });
});
