import test from "node:test";
import assert from "node:assert";
import { inferCategory, topicToSlug } from "./generate-article.mjs";

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

test("topicToSlug - spaces", (t) => {
  assert.strictEqual(topicToSlug("Hello World"), "hello-world");
  assert.strictEqual(topicToSlug("Multiple   Spaces  Here"), "multiple-spaces-here");
});

test("topicToSlug - special characters", (t) => {
  assert.strictEqual(topicToSlug("Special && Characters!"), "special-characters");
  assert.strictEqual(topicToSlug("100% Guaranteed @Home"), "100-guaranteed-home");
});

test("topicToSlug - trailing and leading dashes", (t) => {
  assert.strictEqual(topicToSlug("  -hello- "), "hello");
  assert.strictEqual(topicToSlug("---multiple---dashes---"), "multiple-dashes");
});

test("topicToSlug - numbers and mixed case", (t) => {
  assert.strictEqual(topicToSlug("A1 B2!"), "a1-b2");
  assert.strictEqual(topicToSlug("Top 10 IoT Devices of 2024"), "top-10-iot-devices-of-2024");
});
