import test from "node:test";
import assert from "node:assert";
import { inferCategory, sanitizeHtmlOutput, extractArticleTitle } from "./generate-article.mjs";

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

test("extractArticleTitle", (t) => {
  // Test Case 1: Title extracted from <h1 class="blog-post-title"> successfully
  assert.strictEqual(
    extractArticleTitle('<html><body><h1 class="blog-post-title">My Awesome Article</h1></body></html>'),
    "My Awesome Article"
  );

  // Test Case 2: Title extracted from <h1> with nested tags, ensuring tags are stripped
  assert.strictEqual(
    extractArticleTitle('<h1 class="blog-post-title"><span>New</span> Tech <strong>Trends</strong></h1>'),
    "New Tech Trends"
  );

  // Test Case 3: Title extracted from <title> when no <h1> matches, ensuring "| RSMK Blog" suffix is removed
  assert.strictEqual(
    extractArticleTitle('<title>My Fallback Title | RSMK Blogs</title>'),
    "My Fallback Title"
  );
  assert.strictEqual(
    extractArticleTitle('<title>Another Title | RSMK Blog</title>'),
    "Another Title"
  );

  // Test Case 4: Title extracted from <title> without any suffix
  assert.strictEqual(
    extractArticleTitle('<title>Just A Title</title>'),
    "Just A Title"
  );

  // Test Case 5: Fallback to "New Article" when neither <h1 class="blog-post-title"> nor <title> is present
  assert.strictEqual(
    extractArticleTitle('<div><p>No title here</p></div>'),
    "New Article"
  );

  // Test Case 6: Multi-line title string extraction from <h1>
  assert.strictEqual(
    extractArticleTitle('<h1 class="blog-post-title">\n  Multi-line \n  Title\n</h1>'),
    "Multi-line \n  Title"
  );
});
