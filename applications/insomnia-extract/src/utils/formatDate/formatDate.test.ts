import { formatDate } from './formatDate';

describe('formatDate', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should return the date in the format YYYYMMDD_hhmmss', () => {
    const date = new Date(Date.parse('27 Feb 2009 22:32:59'));
    const result = formatDate(date);
    expect(result).toBe('20090227_223259');
  });

  it('should return the date in the format YYYYMMDD_hhmmss and zero pad where needed', () => {
    const date = new Date(Date.parse('1 Jan 1970 03:05:05'));
    const result = formatDate(date);
    expect(result).toBe('19700101_030505');
  });

  it('should use the current datetime by default if not provided', () => {
    const currentDate = new Date('30 Aug 2024 13:01:46');
    jest.setSystemTime(currentDate);

    const result = formatDate();
    expect(result).toBe('20240830_130146');
  });
});
