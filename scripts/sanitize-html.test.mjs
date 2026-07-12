import test from 'node:test';
import assert from 'node:assert';
import { sanitizeHtmlOutput } from './generate-article.mjs';

test('sanitizeHtmlOutput', async (t) => {
  await t.test('removes trailing and leading ```html and ```', () => {
    const input = '```html\n<div>Test</div>\n```';
    const output = sanitizeHtmlOutput(input);
    assert.strictEqual(output, '<div>Test</div>');
  });

  await t.test('removes trailing and leading ``` and ```', () => {
    const input = '```\n<div>Test</div>\n```';
    const output = sanitizeHtmlOutput(input);
    assert.strictEqual(output, '<div>Test</div>');
  });

  await t.test('does not modify valid html without markdown block', () => {
    const input = '<div>Test</div>';
    const output = sanitizeHtmlOutput(input);
    assert.strictEqual(output, '<div>Test</div>');
  });

  await t.test('handles uppercase markdown blocks (case insensitive)', () => {
    const input = '```HTML\n<div>Test</div>\n```';
    const output = sanitizeHtmlOutput(input);
    assert.strictEqual(output, '<div>Test</div>');
  });

  await t.test('trims whitespace around content', () => {
    const input = '```html\n\n  <div>Test</div>  \n\n```';
    const output = sanitizeHtmlOutput(input);
    assert.strictEqual(output, '<div>Test</div>');
  });

  await t.test('handles trailing backticks that are missing whitespace', () => {
    const input = '```html\n<div>Test</div>```';
    const output = sanitizeHtmlOutput(input);
    assert.strictEqual(output, '<div>Test</div>');
  });

  await t.test('handles text with backticks that do not start or end the string', () => {
    const input = '<div>Code: ```js console.log() ```</div>';
    const output = sanitizeHtmlOutput(input);
    assert.strictEqual(output, '<div>Code: ```js console.log() ```</div>');
  });

  await t.test('throws TypeError if text is null', () => {
    assert.throws(() => sanitizeHtmlOutput(null), TypeError);
  });

  await t.test('throws TypeError if text is undefined', () => {
    assert.throws(() => sanitizeHtmlOutput(undefined), TypeError);
  });
});
