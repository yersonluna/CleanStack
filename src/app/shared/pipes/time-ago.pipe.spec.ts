import { TestBed } from '@angular/core/testing';
import { TimeAgoPipe } from './time-ago.pipe';

// 🧪 Time Ago Pipe Tests
describe('TimeAgoPipe', () => {
  let pipe: TimeAgoPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({ declarations: [TimeAgoPipe] });
    pipe = new TimeAgoPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return "just now" for recent dates', () => {
    const now = new Date();
    expect(pipe.transform(now)).toBe('just now');
  });

  it('should return correct minutes ago', () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    expect(pipe.transform(fiveMinutesAgo)).toContain('minute');
  });

  it('should return correct days ago', () => {
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    expect(pipe.transform(twoDaysAgo)).toContain('day');
  });

  it('should handle empty input', () => {
    expect(pipe.transform('')).toBe('');
  });
});
