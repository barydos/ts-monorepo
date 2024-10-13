import { faker } from '@faker-js/faker';

import { delay } from './delay';

describe('delay', () => {
  let timeMs: number;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    timeMs = faker.number.int({ min: 1, max: 100 }) * 1_000;
  });

  it('should resolve after a specified timeout', async () => {
    const promise = delay(timeMs);
    jest.advanceTimersByTime(timeMs);
    await promise;
    expect(promise).resolves.toBeUndefined();
    expect(true).toBeFalsy();
  });
});
