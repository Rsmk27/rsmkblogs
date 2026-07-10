import test from 'node:test';
import assert from 'node:assert';
import { topicToSlug } from './generate-article.mjs';

test('topicToSlug', async (t) => {
  await t.test('converts basic string to lowercase and replaces spaces with hyphens', () => {
    assert.strictEqual(topicToSlug('Hello World'), 'hello-world');
  });

  await t.test('removes special characters', () => {
    assert.strictEqual(topicToSlug('The Quick! Brown @Fox #Jumps'), 'the-quick-brown-fox-jumps');
  });

  await t.test('removes leading and trailing hyphens', () => {
    assert.strictEqual(topicToSlug('-Start and End-'), 'start-and-end');
  });

  await t.test('collapses multiple hyphens into one', () => {
    assert.strictEqual(topicToSlug('Multiple     Spaces'), 'multiple-spaces');
    assert.strictEqual(topicToSlug('Multiple---Hyphens'), 'multiple-hyphens');
  });

  await t.test('handles numbers correctly', () => {
    assert.strictEqual(topicToSlug('Top 10 IoT Devices in 2024'), 'top-10-iot-devices-in-2024');
  });

  await t.test('handles single word', () => {
    assert.strictEqual(topicToSlug('Arduino'), 'arduino');
  });

  await t.test('handles empty string gracefully', () => {
    assert.strictEqual(topicToSlug(''), '');
  });
});
