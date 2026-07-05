import test from "node:test";
import assert from "node:assert";
import fs from "node:fs";

// Create a test module from the main script
const scriptContent = fs.readFileSync(new URL("generate-article.mjs", import.meta.url), "utf8");
const fnMatch = scriptContent.match(/function contentTypeToExtension\(contentType\) \{[\s\S]*?\n\}/);
const fnString = fnMatch ? fnMatch[0] : "";

// Evaluate the function in the current scope to test it
const contentTypeToExtension = new Function(`return ${fnString}`)();

test("contentTypeToExtension", async (t) => {
  await t.test("returns jpg for jpeg content types", () => {
    assert.strictEqual(contentTypeToExtension("image/jpeg"), "jpg");
    assert.strictEqual(contentTypeToExtension("image/jpg"), "jpg");
  });

  await t.test("returns png for png content types", () => {
    assert.strictEqual(contentTypeToExtension("image/png"), "png");
  });

  await t.test("returns webp for webp content types", () => {
    assert.strictEqual(contentTypeToExtension("image/webp"), "webp");
  });

  await t.test("handles missing/null/undefined content types", () => {
    assert.strictEqual(contentTypeToExtension(), "jpg");
    assert.strictEqual(contentTypeToExtension(null), "jpg");
    assert.strictEqual(contentTypeToExtension(""), "jpg");
  });

  await t.test("handles uppercase/mixed case content types", () => {
    assert.strictEqual(contentTypeToExtension("IMAGE/PNG"), "png");
    assert.strictEqual(contentTypeToExtension("Image/Jpeg"), "jpg");
  });

  await t.test("falls back to jpg for unknown content types", () => {
    assert.strictEqual(contentTypeToExtension("image/gif"), "jpg");
    assert.strictEqual(contentTypeToExtension("application/json"), "jpg");
  });
});
