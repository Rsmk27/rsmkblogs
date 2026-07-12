import { topicToSlug } from './generate-article.mjs';

describe('topicToSlug', () => {
  it('converts basic text to lowercase', () => {
    expect(topicToSlug('Hello')).toBe('hello');
  });

  it('converts spaces to hyphens', () => {
    expect(topicToSlug('Hello World')).toBe('hello-world');
  });

  it('strips special characters', () => {
    expect(topicToSlug('Hello! World@')).toBe('hello-world');
  });

  it('handles multiple sequential spaces and special characters', () => {
    expect(topicToSlug('Hello   World!!!')).toBe('hello-world');
  });

  it('removes leading and trailing hyphens', () => {
    expect(topicToSlug('---Hello World---')).toBe('hello-world');
    expect(topicToSlug('!Hello World!')).toBe('hello-world');
  });

  it('preserves alphanumeric characters', () => {
    expect(topicToSlug('ESP32 Guide 2024')).toBe('esp32-guide-2024');
  });

  it('handles empty strings', () => {
    expect(topicToSlug('')).toBe('');
  });

  it('handles strings that result in an empty slug (only special characters)', () => {
    expect(topicToSlug('!!! @@ ##')).toBe('');
  });
});
