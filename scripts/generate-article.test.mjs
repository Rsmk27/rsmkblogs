import test from "node:test";
import assert from "node:assert";
import { escapeHtml } from "./generate-article.mjs";

test("escapeHtml handles basic escaping", () => {
  assert.strictEqual(escapeHtml("hello"), "hello");
  assert.strictEqual(escapeHtml("a&b"), "a&amp;b");
  assert.strictEqual(escapeHtml("a<b"), "a&lt;b");
  assert.strictEqual(escapeHtml("a>b"), "a&gt;b");
  assert.strictEqual(escapeHtml('a"b'), "a&quot;b");
  assert.strictEqual(escapeHtml("a'b"), "a&#39;b");
});

test("escapeHtml handles multiple occurrences and combinations", () => {
  assert.strictEqual(
    escapeHtml("<script>alert('XSS & \"test\"')</script>"),
    "&lt;script&gt;alert(&#39;XSS &amp; &quot;test&quot;&#39;)&lt;/script&gt;"
  );
  assert.strictEqual(escapeHtml("&&&&"), "&amp;&amp;&amp;&amp;");
});

test("escapeHtml handles non-string inputs safely by stringifying", () => {
  assert.strictEqual(escapeHtml(123), "123");
  assert.strictEqual(escapeHtml(null), "null");
  assert.strictEqual(escapeHtml(undefined), "undefined");
});

test("escapeHtml handles empty string", () => {
  assert.strictEqual(escapeHtml(""), "");
});
