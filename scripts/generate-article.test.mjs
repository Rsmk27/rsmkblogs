import test from "node:test";
import assert from "node:assert";
import { extractPrimaryTag } from "./generate-article.mjs";

test("extractPrimaryTag extracts a single tag", () => {
  const html = '<meta name="keywords" content="javascript">';
  assert.strictEqual(extractPrimaryTag(html), "javascript");
});

test("extractPrimaryTag extracts the first tag from multiple comma-separated tags", () => {
  const html = '<meta name="keywords" content="javascript, web development, coding">';
  assert.strictEqual(extractPrimaryTag(html), "javascript");
});

test("extractPrimaryTag returns null when meta keywords is missing", () => {
  const html = '<html><head><title>Test</title></head><body>Hello</body></html>';
  assert.strictEqual(extractPrimaryTag(html), null);
});

test("extractPrimaryTag returns null when content is empty", () => {
  const html = '<meta name="keywords" content="">';
  assert.strictEqual(extractPrimaryTag(html), null);
});

test("extractPrimaryTag returns null when content is only whitespace or empty commas", () => {
  const html = '<meta name="keywords" content=" ,  ,, ">';
  assert.strictEqual(extractPrimaryTag(html), null);
});

test("extractPrimaryTag handles variations in spacing, case, and self-closing tags", () => {
  const html = '<META   name="keywords"    content="Tag1, Tag2" />';
  assert.strictEqual(extractPrimaryTag(html), "Tag1");
});

test("extractPrimaryTag trims whitespace around the primary tag", () => {
  const html = '<meta name="keywords" content="  padded tag  , another tag">';
  assert.strictEqual(extractPrimaryTag(html), "padded tag");
});
