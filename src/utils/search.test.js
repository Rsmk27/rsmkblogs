import test from 'node:test';
import assert from 'node:assert/strict';
import { filterSearchResults, SEARCH_INDEX } from './search.js';

test('filterSearchResults', async (t) => {
  await t.test('returns empty array when query is empty or whitespace', () => {
    assert.deepEqual(filterSearchResults('', SEARCH_INDEX), []);
    assert.deepEqual(filterSearchResults('   ', SEARCH_INDEX), []);
    assert.deepEqual(filterSearchResults(null, SEARCH_INDEX), []);
  });

  await t.test('matches by title (case-insensitive)', () => {
    const results = filterSearchResults('PLC Systems', SEARCH_INDEX);
    assert.ok(results.length > 0);
    assert.equal(results[0].title, "Industrial PLC Systems & Ladder Logic Architecture");

    const lowercaseResults = filterSearchResults('plc systems', SEARCH_INDEX);
    assert.deepEqual(results, lowercaseResults);
  });

  await t.test('matches by category (case-insensitive)', () => {
    const results = filterSearchResults('Industrial Automation', SEARCH_INDEX);
    assert.ok(results.length > 0);
    // There are a few articles with this category
    assert.ok(results.every(item => item.category === 'Industrial Automation'));
  });

  await t.test('matches by tags (case-insensitive)', () => {
    const results = filterSearchResults('Zigbee', SEARCH_INDEX);
    assert.equal(results.length, 1);
    assert.equal(results[0].title, 'Smart Home Automation Systems Architecture');
  });

  await t.test('returns empty array when no matches found', () => {
    const results = filterSearchResults('nonexistent_gibberish_query', SEARCH_INDEX);
    assert.deepEqual(results, []);
  });
});
