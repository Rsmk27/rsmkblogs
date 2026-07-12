import test from "node:test";
import assert from "node:assert";
import { escapeHtml } from "../scripts/generate-article.mjs";

test("escapeHtml functionality", async (t) => {
  await t.test("should return unchanged string if no special characters exist", () => {
    assert.strictEqual(escapeHtml("Hello World"), "Hello World");
    assert.strictEqual(escapeHtml("12345"), "12345");
  });

  await t.test("should escape ampersand (&)", () => {
    assert.strictEqual(escapeHtml("Tom & Jerry"), "Tom &amp; Jerry");
  });

  await t.test("should escape less than (<) and greater than (>)", () => {
    assert.strictEqual(escapeHtml("<div>"), "&lt;div&gt;");
  });

  await t.test("should escape double quotes (\")", () => {
    assert.strictEqual(escapeHtml('Hello "World"'), "Hello &quot;World&quot;");
  });

  await t.test("should escape single quotes (')", () => {
    assert.strictEqual(escapeHtml("It's a test"), "It&#39;s a test");
  });

  await t.test("should escape combinations of special characters", () => {
    const input = `<script>alert("XSS & 'injection'")</script>`;
    const expected = `&lt;script&gt;alert(&quot;XSS &amp; &#39;injection&#39;&quot;)&lt;/script&gt;`;
    assert.strictEqual(escapeHtml(input), expected);
  });

  await t.test("should handle non-string inputs by converting to string", () => {
    assert.strictEqual(escapeHtml(123), "123");
    assert.strictEqual(escapeHtml(true), "true");
    assert.strictEqual(escapeHtml(null), "null");
    assert.strictEqual(escapeHtml(undefined), "undefined");
  });
});
