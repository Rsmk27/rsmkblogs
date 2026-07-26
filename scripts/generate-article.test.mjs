import test from "node:test";
import assert from "node:assert";
import { inferCategory, sanitizeHtmlOutput, normalizeSlugUrls } from "./generate-article.mjs";

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


test("sanitizeHtmlOutput", (t) => {
  // Stripping ```html and closing ```
  assert.strictEqual(
    sanitizeHtmlOutput("```html\n<div>Hello</div>\n```"),
    "<div>Hello</div>"
  );

  // Stripping generic ``` blocks
  assert.strictEqual(
    sanitizeHtmlOutput("```\n<p>Test</p>\n```"),
    "<p>Test</p>"
  );

  // Case insensitivity
  assert.strictEqual(
    sanitizeHtmlOutput("```HTML\n<span>Span</span>\n```"),
    "<span>Span</span>"
  );

  // Extra whitespaces and linebreaks
  assert.strictEqual(
    sanitizeHtmlOutput("   ```html  \n\n  <h1>Title</h1> \n\n  ```   "),
    "<h1>Title</h1>"
  );

  // Plain text/HTML without markdown wrappers
  assert.strictEqual(
    sanitizeHtmlOutput("<h2>Subtitle</h2>"),
    "<h2>Subtitle</h2>"
  );

  // Multiple lines of HTML
  assert.strictEqual(
    sanitizeHtmlOutput("```html\n<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>\n```"),
    "<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>"
  );
});

test("normalizeSlugUrls", (t) => {
  const slug = "test-slug";

  // Test rel="canonical"
  const canonicalHtml = '<link rel="canonical" href="https://example.com/old.html">';
  const expectedCanonicalHtml = '<link rel="canonical" href="https://blogs.rsmk.me/blogs/test-slug.html">';
  assert.strictEqual(normalizeSlugUrls(canonicalHtml, slug), expectedCanonicalHtml);

  // Test property="og:url"
  const ogHtml = '<meta property="og:url" content="https://example.com/old.html">';
  const expectedOgHtml = '<meta property="og:url" content="https://blogs.rsmk.me/blogs/test-slug.html">';
  assert.strictEqual(normalizeSlugUrls(ogHtml, slug), expectedOgHtml);

  // Test property="twitter:url"
  const twitterHtml = '<meta property="twitter:url" content="https://example.com/old.html">';
  const expectedTwitterHtml = '<meta property="twitter:url" content="https://blogs.rsmk.me/blogs/test-slug.html">';
  assert.strictEqual(normalizeSlugUrls(twitterHtml, slug), expectedTwitterHtml);

  // Test all three in one snippet
  const combinedHtml = `
    <link rel="canonical" href="old-url">
    <meta property="og:url" content="old-url">
    <meta property="twitter:url" content="old-url">
  `;
  const expectedCombinedHtml = `
    <link rel="canonical" href="https://blogs.rsmk.me/blogs/test-slug.html">
    <meta property="og:url" content="https://blogs.rsmk.me/blogs/test-slug.html">
    <meta property="twitter:url" content="https://blogs.rsmk.me/blogs/test-slug.html">
  `;
  assert.strictEqual(normalizeSlugUrls(combinedHtml, slug), expectedCombinedHtml);

  // Test case insensitivity
  const mixedCaseHtml = '<link REL="canonical" HReF="old-url">';
  const expectedMixedCaseHtml = '<link REL="canonical" HReF="https://blogs.rsmk.me/blogs/test-slug.html">';
  assert.strictEqual(normalizeSlugUrls(mixedCaseHtml, slug), expectedMixedCaseHtml);

  // Test unmodified HTML
  const unmodifiedHtml = '<div>No links here</div>';
  assert.strictEqual(normalizeSlugUrls(unmodifiedHtml, slug), unmodifiedHtml);
});
