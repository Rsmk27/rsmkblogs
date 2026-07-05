import test from "node:test";
import assert from "node:assert";
import { sanitizeHtmlOutput } from "./generate-article.mjs";

test("sanitizeHtmlOutput", async (t) => {
  await t.test("removes standard ```html blocks", () => {
    const input = "```html\n<div>Hello</div>\n```";
    const expected = "<div>Hello</div>";
    assert.strictEqual(sanitizeHtmlOutput(input), expected);
  });

  await t.test("removes standard ``` blocks without language", () => {
    const input = "```\n<div>Hello</div>\n```";
    const expected = "<div>Hello</div>";
    assert.strictEqual(sanitizeHtmlOutput(input), expected);
  });

  await t.test("handles plain text without blocks", () => {
    const input = "<div>Hello</div>";
    const expected = "<div>Hello</div>";
    assert.strictEqual(sanitizeHtmlOutput(input), expected);
  });

  await t.test("is case insensitive for HTML tag", () => {
    const input = "```HTML\n<div>Hello</div>\n```";
    const expected = "<div>Hello</div>";
    assert.strictEqual(sanitizeHtmlOutput(input), expected);
  });

  await t.test("handles extra whitespace after the tags", () => {
    const input = "```html    \n<div>Hello</div>\n    ```";
    const expected = "<div>Hello</div>";
    assert.strictEqual(sanitizeHtmlOutput(input), expected);
  });

  await t.test("trims whitespace from the content", () => {
    const input = "```html\n   <div>Hello</div>   \n```";
    const expected = "<div>Hello</div>";
    assert.strictEqual(sanitizeHtmlOutput(input), expected);
  });

  await t.test("handles empty string", () => {
    assert.strictEqual(sanitizeHtmlOutput(""), "");
  });

  await t.test("handles whitespace-only string", () => {
    assert.strictEqual(sanitizeHtmlOutput("   \n   "), "");
  });
});
