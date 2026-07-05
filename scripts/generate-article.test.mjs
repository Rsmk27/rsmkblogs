import test from "node:test";
import assert from "node:assert";
import { extractAnthropicText } from "./generate-article.mjs";

test("extractAnthropicText tests", async (t) => {
  await t.test("throws error if responseJson.content is not an array", () => {
    assert.throws(
      () => extractAnthropicText({}),
      /Anthropic API response did not include content blocks/
    );
  });

  await t.test("throws error if no text block is found", () => {
    assert.throws(
      () => extractAnthropicText({ content: [{ type: "image" }] }),
      /Anthropic API response did not include text output/
    );
  });

  await t.test("throws error if text block has empty/missing text property", () => {
    assert.throws(
      () => extractAnthropicText({ content: [{ type: "text" }] }),
      /Anthropic API response did not include text output/
    );
  });

  await t.test("extracts and trims text correctly", () => {
    const response = {
      content: [
        { type: "image", url: "..." },
        { type: "text", text: "  Hello World!  " }
      ]
    };
    const result = extractAnthropicText(response);
    assert.strictEqual(result, "Hello World!");
  });
});
