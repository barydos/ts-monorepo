import { delay } from 'shared-package';

import { wait } from './wait';

jest.mock('shared-package');

describe('wait', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    jest.spyOn(global, 'setTimeout');
    jest.spyOn(console, 'log');
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should wait for 5 seconds', async () => {
    await wait();
    expect(delay).toHaveBeenCalledWith(5_000);
    expect(console.log).toHaveBeenCalledWith('-- Waiting 5 seconds..');
  });
});
