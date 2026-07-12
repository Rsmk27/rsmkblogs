import { test, describe } from 'node:test';
import assert from 'node:assert';
import { tokenizeForRelevance } from './generate-article.mjs';

describe('tokenizeForRelevance', () => {
  test('returns a Set of tokens', () => {
    const result = tokenizeForRelevance('hello world');
    assert.ok(result instanceof Set);
  });

  test('converts tokens to lowercase and trims them', () => {
    const result = tokenizeForRelevance(' Hello World ');
    assert.deepStrictEqual(Array.from(result).sort(), ['hello', 'world']);
  });

  test('filters out short words (length <= 2)', () => {
    const result = tokenizeForRelevance('a to the box ox dog');
    assert.deepStrictEqual(Array.from(result).sort(), ['box', 'dog']);
  });

  test('filters out stop words', () => {
    const text = 'the and for with from that this your into about using guide how what why new best more less over under versus vs practical hello world';
    const result = tokenizeForRelevance(text);
    // Only "hello" and "world" should remain after filtering out all those stop words
    assert.deepStrictEqual(Array.from(result).sort(), ['hello', 'world']);
  });

  test('handles punctuation and special characters by replacing them with space', () => {
    // Expected: lowercase, replace special chars, filter length > 2
    const result = tokenizeForRelevance('Hello, world! 100% pure... javascript-magic?');
    // Result tokens: hello, world, 100, pure, javascript-magic
    assert.deepStrictEqual(Array.from(result).sort(), ['100', 'hello', 'javascript-magic', 'pure', 'world']);
  });

  test('returns empty Set for empty strings, null, or undefined', () => {
    assert.strictEqual(tokenizeForRelevance('').size, 0);
    assert.strictEqual(tokenizeForRelevance(null).size, 0);
    assert.strictEqual(tokenizeForRelevance(undefined).size, 0);
  });

  test('handles multiple consecutive spaces and newlines', () => {
    const result = tokenizeForRelevance('super    cool\n\n\nstuff\t\there');
    assert.deepStrictEqual(Array.from(result).sort(), ['cool', 'here', 'stuff', 'super']);
  });

  test('handles duplicated words, keeping only unique tokens', () => {
    const result = tokenizeForRelevance('cats and dogs cats dogs');
    assert.deepStrictEqual(Array.from(result).sort(), ['cats', 'dogs']);
  });
});
