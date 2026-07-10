import { describe, it, expect } from 'vitest';
import { tokenizeForRelevance } from '../generate-article.mjs';

describe('tokenizeForRelevance', () => {
  it('should return a Set of tokens', () => {
    const result = tokenizeForRelevance("The quick brown fox jumps over the lazy dog");
    expect(result).toBeInstanceOf(Set);
  });

  it('should convert text to lowercase', () => {
    const result = Array.from(tokenizeForRelevance("Hello WORLD"));
    expect(result).toContain("hello");
    expect(result).toContain("world");
  });

  it('should filter out stop words', () => {
    const text = "this is a test about how to do something practical with new technology";
    const result = Array.from(tokenizeForRelevance(text));

    // Test that non-stopwords are kept
    expect(result).toContain("test");
    expect(result).toContain("something");
    expect(result).toContain("technology");

    // Test that stopwords are removed
    expect(result).not.toContain("this");
    expect(result).not.toContain("about");
    expect(result).not.toContain("how");
    expect(result).not.toContain("practical");
    expect(result).not.toContain("with");
    expect(result).not.toContain("new");
  });

  it('should filter out words shorter than 3 characters', () => {
    const result = Array.from(tokenizeForRelevance("a an big cat is on tv"));
    expect(result).not.toContain("a");
    expect(result).not.toContain("an");
    expect(result).not.toContain("is");
    expect(result).not.toContain("on");
    expect(result).not.toContain("tv");
    expect(result).toContain("big");
    expect(result).toContain("cat");
  });

  it('should remove special characters and punctuation', () => {
    const result = Array.from(tokenizeForRelevance("hello! this is a test... of the system, right?"));
    expect(result).toContain("hello");
    expect(result).toContain("test");
    expect(result).toContain("system");
    expect(result).toContain("right");
    expect(result).not.toContain("hello!");
    expect(result).not.toContain("test...");
  });

  it('should handle hyphenated words by keeping hyphens but replacing other non-alphanumeric chars with spaces', () => {
    const result = Array.from(tokenizeForRelevance("state-of-the-art tech-stack @home"));
    expect(result).toContain("state-of-the-art");
    expect(result).toContain("tech-stack");
    expect(result).toContain("home");
  });

  it('should handle null, undefined, or empty input gracefully', () => {
    expect(Array.from(tokenizeForRelevance(null))).toEqual([]);
    expect(Array.from(tokenizeForRelevance(undefined))).toEqual([]);
    expect(Array.from(tokenizeForRelevance(""))).toEqual([]);
    expect(Array.from(tokenizeForRelevance("     "))).toEqual([]);
  });

  it('should return unique tokens only', () => {
    const result = Array.from(tokenizeForRelevance("apple banana apple orange banana"));
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining(["apple", "banana", "orange"]));
  });
});
