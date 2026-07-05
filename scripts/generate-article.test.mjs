import test from 'node:test';
import assert from 'node:assert';
import { extractMetaDescription } from './generate-article.mjs';

test('extractMetaDescription', async (t) => {
  await t.test('returns extracted content when meta description exists', () => {
    const html = '<html><head><meta name="description" content="This is a test description"></head><body></body></html>';
    const result = extractMetaDescription(html);
    assert.strictEqual(result, 'This is a test description');
  });

  await t.test('returns default fallback when meta description does not exist', () => {
    const html = '<html><head><title>No Description</title></head><body></body></html>';
    const result = extractMetaDescription(html);
    assert.strictEqual(result, 'A new article from RSMK on engineering, embedded systems, and future technologies.');
  });

  await t.test('handles whitespace around meta tags correctly', () => {
    const html = '<html><head><meta   name="description"    content="Whitespace test"   /></head><body></body></html>';
    const result = extractMetaDescription(html);
    assert.strictEqual(result, 'Whitespace test');
  });

  await t.test('is case insensitive for the meta description tag', () => {
    const html = '<html><head><MeTa NaMe="DeScRiPtIoN" CoNtEnT="Case insensitive test"></head><body></body></html>';
    const result = extractMetaDescription(html);
    assert.strictEqual(result, 'Case insensitive test');
  });

  await t.test('trims whitespace from extracted content', () => {
    const html = '<html><head><meta name="description" content="   Trimming test   "></head><body></body></html>';
    const result = extractMetaDescription(html);
    assert.strictEqual(result, 'Trimming test');
  });
});
