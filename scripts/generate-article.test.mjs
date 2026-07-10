import test from "node:test";
import assert from "node:assert";
import { estimateReadMinutes } from "./generate-article.mjs";

test("estimateReadMinutes calculates correct time for regular content", (t) => {
  // 180 words is 1 minute, but minimum is 4 minutes.
  // 720 words should be exactly 4 minutes.
  const words720 = Array(720).fill("word").join(" ");
  assert.strictEqual(estimateReadMinutes(words720), "4 min read");

  // 721 words should bump up to 5 minutes.
  const words721 = Array(721).fill("word").join(" ");
  assert.strictEqual(estimateReadMinutes(words721), "5 min read");
});

test("estimateReadMinutes handles empty string", (t) => {
  assert.strictEqual(estimateReadMinutes(""), "4 min read");
});

test("estimateReadMinutes handles content with only HTML tags", (t) => {
  const htmlOnly = "<div><p><span></span></p></div>";
  assert.strictEqual(estimateReadMinutes(htmlOnly), "4 min read");
});

test("estimateReadMinutes handles content with less than minimum threshold", (t) => {
  const words100 = Array(100).fill("word").join(" ");
  assert.strictEqual(estimateReadMinutes(words100), "4 min read");
});

test("estimateReadMinutes extracts content only from div.blog-content if present", (t) => {
  const insideDiv = Array(720).fill("word").join(" ");
  const outsideDiv = Array(500).fill("outside").join(" ");

  const html = `
    <html>
      <body>
        <div class="sidebar">${outsideDiv}</div>
        <div class="blog-content">${insideDiv}</div>
        <div class="footer">${outsideDiv}</div>
      </body>
    </html>
  `;

  // If it extracts only the insideDiv (720 words), it should be 4 minutes.
  // If it includes outsideDiv (720 + 1000 = 1720 words), it would be Math.ceil(1720/180) = 10 minutes.
  assert.strictEqual(estimateReadMinutes(html), "4 min read");
});

test("estimateReadMinutes handles multiple whitespaces, newlines, and tabs", (t) => {
  // Create 721 words separated by various whitespaces to ensure it's still 5 minutes.
  const wordsList = Array(721).fill("word");
  const joinedWithSpaces = wordsList.join("  \n \t  \n");

  assert.strictEqual(estimateReadMinutes(joinedWithSpaces), "5 min read");
});
