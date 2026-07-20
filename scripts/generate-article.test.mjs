import test from "node:test";
import assert from "node:assert";
import { inferCategory, escapeHtml } from "./generate-article.mjs";

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

test("escapeHtml", (t) => {
  // Happy path
  assert.strictEqual(escapeHtml("hello world"), "hello world");

  // Special characters individually
  assert.strictEqual(escapeHtml("apples & oranges"), "apples &amp; oranges");
  assert.strictEqual(escapeHtml("5 < 10"), "5 &lt; 10");
  assert.strictEqual(escapeHtml("10 > 5"), "10 &gt; 5");
  assert.strictEqual(escapeHtml('say "hello"'), "say &quot;hello&quot;");
  assert.strictEqual(escapeHtml("it's mine"), "it&#39;s mine");

  // Multiple special characters
  assert.strictEqual(
    escapeHtml('<a href="test&id=1">It\'s</a>'),
    "&lt;a href=&quot;test&amp;id=1&quot;&gt;It&#39;s&lt;/a&gt;"
  );

  // Non-string inputs
  assert.strictEqual(escapeHtml(123), "123");
  assert.strictEqual(escapeHtml(null), "null");
  assert.strictEqual(escapeHtml(undefined), "undefined");
});
