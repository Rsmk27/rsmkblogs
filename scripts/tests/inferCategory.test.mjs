import test from "node:test";
import assert from "node:assert";
import { inferCategory } from "../generate-article.mjs";

test("inferCategory - Green Energy", (t) => {
  // Topics matching "solar", "energy", "ev"
  assert.strictEqual(inferCategory("Solar power is great", ""), "Green Energy");
  assert.strictEqual(inferCategory("New energy source", ""), "Green Energy");
  assert.strictEqual(inferCategory("EV battery technology", ""), "Green Energy");

  // Primary tag matching "green"
  assert.strictEqual(inferCategory("Any topic", "green tech"), "Green Energy");

  // Edge cases - ensuring "device" (contains ev) doesn't falsely trigger
  assert.notStrictEqual(inferCategory("Building an IoT device", ""), "Green Energy");
});

test("inferCategory - IoT", (t) => {
  // Topics matching "iot" (word boundary), "esp32", "esp8266", "mqtt"
  assert.strictEqual(inferCategory("Building an IoT project", ""), "IoT");
  assert.strictEqual(inferCategory("Programming ESP32", ""), "IoT");
  assert.strictEqual(inferCategory("Using ESP8266", ""), "IoT");
  assert.strictEqual(inferCategory("Understanding MQTT", ""), "IoT");

  // Primary tag matching "iot"
  assert.strictEqual(inferCategory("Any topic", "IoT sensors"), "IoT");

  // Edge cases - "idiot" (contains iot) shouldn't trigger, though iot word boundary prevents it
  assert.notStrictEqual(inferCategory("What an idiot", ""), "IoT");
});

test("inferCategory - Careers", (t) => {
  // Topics matching "career"
  assert.strictEqual(inferCategory("Engineering careers", ""), "Careers");

  // Primary tag matching "career"
  assert.strictEqual(inferCategory("Finding a job", "Career Advice"), "Careers");
});

test("inferCategory - Future Tech", (t) => {
  // Topics matching "quantum", "ai" (word boundary)
  assert.strictEqual(inferCategory("Quantum computing", ""), "Future Tech");
  assert.strictEqual(inferCategory("AI and machine learning", ""), "Future Tech");

  // Primary tag matching "future"
  assert.strictEqual(inferCategory("What the future holds", "Future Tech"), "Future Tech");

  // Edge cases - ensuring "training" (contains ai) doesn't falsely trigger
  assert.notStrictEqual(inferCategory("training a model", ""), "Future Tech");
});

test("inferCategory - Embedded Systems (Default)", (t) => {
  assert.strictEqual(inferCategory("Learning C++", ""), "Embedded Systems");
  assert.strictEqual(inferCategory("Random topic", "Random tag"), "Embedded Systems");
});

test("inferCategory - Edge cases", (t) => {
  // Null or missing primary tag
  assert.strictEqual(inferCategory("Learning C++", null), "Embedded Systems");
  assert.strictEqual(inferCategory("Learning C++", undefined), "Embedded Systems");

  // Empty strings
  assert.strictEqual(inferCategory("", ""), "Embedded Systems");

  // Unusual capitalization
  assert.strictEqual(inferCategory("SoLaR pOwEr", ""), "Green Energy");
  assert.strictEqual(inferCategory("random", "GrEeN"), "Green Energy");
});
