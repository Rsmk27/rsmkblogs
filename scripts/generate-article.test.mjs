import test from "node:test";
import assert from "node:assert";
import { buildImageQuery } from "./generate-article.mjs";

test("buildImageQuery", async (t) => {
  await t.test("formats simple topics correctly", () => {
    assert.strictEqual(
      buildImageQuery("smart home automation"),
      "electronics,smart,home,automation"
    );
  });

  await t.test("converts uppercase to lowercase", () => {
    assert.strictEqual(
      buildImageQuery("Arduino Uno Tutorial"),
      "electronics,arduino,uno,tutorial"
    );
  });

  await t.test("removes non-alphanumeric characters but keeps dashes", () => {
    assert.strictEqual(
      buildImageQuery("ESP32 & IoT: The Future!"),
      "electronics,esp32,iot,the,future"
    );
    assert.strictEqual(
      buildImageQuery("lithium-ion batteries"),
      "electronics,lithium-ion,batteries"
    );
  });

  await t.test("handles multiple spaces and trims padding", () => {
    assert.strictEqual(
      buildImageQuery("  green   energy   solutions  "),
      "electronics,green,energy,solutions"
    );
  });

  await t.test("limits output to 6 words plus electronics", () => {
    assert.strictEqual(
      buildImageQuery("this is a very long topic name that exceeds the limit"),
      "electronics,this,is,a,very,long,topic"
    );
  });

  await t.test("handles purely symbolic input gracefully", () => {
    assert.strictEqual(
      buildImageQuery("!!! @@@ ###"),
      "electronics"
    );
  });

  await t.test("handles empty string", () => {
    assert.strictEqual(
      buildImageQuery(""),
      "electronics"
    );
  });
});
