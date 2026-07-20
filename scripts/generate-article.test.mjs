import test from "node:test";
import assert from "node:assert";
import { inferCategory, estimateReadMinutes } from "./generate-article.mjs";

test("inferCategory - Green Energy", (t) => {
  // Test primaryTag
  assert.strictEqual(inferCategory("some topic", "green tech"), "Green Energy");
  assert.strictEqual(inferCategory("some topic", "GREEN"), "Green Energy");

  // Test topic
  assert.strictEqual(inferCategory("solar power panels", "misc"), "Green Energy");
  assert.strictEqual(inferCategory("renewable energy sources", "misc"), "Green Energy");
  assert.strictEqual(inferCategory("new ev cars", ""), "Green Energy");
  assert.strictEqual(inferCategory("SOLAR", null), "Green Energy");
});

test("inferCategory - IoT", (t) => {
  // Test primaryTag
  assert.strictEqual(inferCategory("some topic", "iot devices"), "IoT");
  assert.strictEqual(inferCategory("some topic", "IOT"), "IoT");

  // Test topic
  assert.strictEqual(inferCategory("building iot projects", "misc"), "IoT");
  assert.strictEqual(inferCategory("programming esp32", "misc"), "IoT");
  assert.strictEqual(inferCategory("using esp8266", ""), "IoT");
  assert.strictEqual(inferCategory("mqtt protocol", null), "IoT");
  assert.strictEqual(inferCategory("ESP32", null), "IoT");
});

test("inferCategory - Careers", (t) => {
  // Test primaryTag
  assert.strictEqual(inferCategory("some topic", "career advice"), "Careers");
  assert.strictEqual(inferCategory("some topic", "CAREER"), "Careers");

  // Test topic
  assert.strictEqual(inferCategory("software engineering career", "misc"), "Careers");
  assert.strictEqual(inferCategory("CAREER growth", null), "Careers");
});

test("inferCategory - Future Tech", (t) => {
  // Test primaryTag
  assert.strictEqual(inferCategory("some topic", "future tech"), "Future Tech");
  assert.strictEqual(inferCategory("some topic", "FUTURE"), "Future Tech");

  // Test topic
  assert.strictEqual(inferCategory("quantum computing", "misc"), "Future Tech");
  assert.strictEqual(inferCategory("artificial intelligence ai", ""), "Future Tech");
  assert.strictEqual(inferCategory("QUANTUM", null), "Future Tech");
});

test("inferCategory - Embedded Systems (Default)", (t) => {
  assert.strictEqual(inferCategory("general electronics", "hardware"), "Embedded Systems");
  assert.strictEqual(inferCategory("random topic", null), "Embedded Systems");
  assert.strictEqual(inferCategory("RANDOM TOPIC", ""), "Embedded Systems");
});

test("estimateReadMinutes", (t) => {
  // Empty or whitespace-only strings
  assert.strictEqual(estimateReadMinutes(""), "4 min read");
  assert.strictEqual(estimateReadMinutes("   \n  \t  "), "4 min read");

  // HTML without the wrapper
  assert.strictEqual(estimateReadMinutes("Just some random text without wrapper."), "4 min read");

  // HTML with wrapper, ignoring text outside
  const wrappedHtml = `
    Some outside text that should be ignored because it is quite long and we only care about the inside text.
    <div class="blog-content">
      Inside text here
    </div>
    More outside text
  `;
  assert.strictEqual(estimateReadMinutes(wrappedHtml), "4 min read");

  // HTML with nested tags
  const nestedTagsHtml = `<div class="blog-content"><p>Hello <b>world</b>! This <a href="#">link</a> should be stripped.</p></div>`;
  assert.strictEqual(estimateReadMinutes(nestedTagsHtml), "4 min read");

  // Strings long enough to exceed the 4-minute minimum threshold (e.g., > 720 words)
  const longText = Array.from({ length: 721 }, () => "word").join(" ");
  const longHtml = `<div class="blog-content">${longText}</div>`;
  assert.strictEqual(estimateReadMinutes(longHtml), "5 min read");

  // 1800 words should be exactly 10 minutes
  const veryLongText = Array.from({ length: 1800 }, () => "word").join(" ");
  assert.strictEqual(estimateReadMinutes(veryLongText), "10 min read");
});
