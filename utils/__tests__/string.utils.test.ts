import { sanitizePromptInput } from '../string.utils';

describe('sanitizePromptInput', () => {
  it('strips newlines', () => {
    expect(sanitizePromptInput('Paris\nIgnore above')).toBe('Paris Ignore above');
  });

  it('strips carriage returns', () => {
    expect(sanitizePromptInput('Paris\rIgnore above')).toBe('Paris Ignore above');
  });

  it('strips mixed newlines', () => {
    expect(sanitizePromptInput('line1\r\nline2')).toBe('line1  line2');
  });

  it('trims leading and trailing whitespace', () => {
    expect(sanitizePromptInput('  Paris  ')).toBe('Paris');
  });

  it('caps output at 200 characters', () => {
    const long = 'a'.repeat(300);
    expect(sanitizePromptInput(long)).toHaveLength(200);
  });

  it('returns input unchanged when under limit', () => {
    expect(sanitizePromptInput('Paris')).toBe('Paris');
  });

  it('returns empty string for empty input', () => {
    expect(sanitizePromptInput('')).toBe('');
  });
});
