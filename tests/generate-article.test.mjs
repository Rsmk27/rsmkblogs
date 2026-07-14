import test from "node:test";
import assert from "node:assert";
import { scoreTopicRelevance, tokenizeForRelevance } from "../scripts/generate-article.mjs";

test("scoreTopicRelevance edge cases", async (t) => {
  await t.test("returns 0 for empty strings", () => {
    assert.strictEqual(scoreTopicRelevance("", ""), 0);
    assert.strictEqual(scoreTopicRelevance("something", ""), 0);
    assert.strictEqual(scoreTopicRelevance("", "something"), 0);
  });

  await t.test("returns 0 when words are only stop words", () => {
    assert.strictEqual(scoreTopicRelevance("the and for", "the with from"), 0);
    assert.strictEqual(scoreTopicRelevance("what why how", "best more less"), 0);
  });

  await t.test("returns 0 when words are too short (< 3 characters)", () => {
    assert.strictEqual(scoreTopicRelevance("a to is", "be in on"), 0);
  });

  await t.test("returns 1 for exact matches ignoring case and special characters", () => {
    assert.strictEqual(scoreTopicRelevance("React JS", "React.js!"), 1); // Only "react" will be kept since "js" is <= 2 chars
    // machine-learning becomes one token because hyphen is not removed by replace(/[^a-z0-9\s-]/g, " ")
    // so we should test words without hyphen to see exact matches
    assert.strictEqual(scoreTopicRelevance("Machine Learning", "machine learning!"), 1);
  });

  await t.test("returns partial score for partial overlap", () => {
    assert.strictEqual(scoreTopicRelevance("artificial intelligence", "artificial network"), 0.5);
    assert.strictEqual(scoreTopicRelevance("web development tutorial", "frontend development guide"), 1/3);
  });

  await t.test("handles multiple occurrences correctly", () => {
    // Topic: 'data' 'science'
    // Candidate: 'data' 'data' 'data'
    // Overlap: candidate has 'data', so it overlaps 1/2 of topic words
    assert.strictEqual(scoreTopicRelevance("data science", "data data data"), 0.5);
  });
});
