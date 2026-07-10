import test from "node:test";
import assert from "node:assert/strict";
import { extractReturnedSlug, topicToSlug, extractArticleTitle } from "./generate-article.mjs";

test("extractReturnedSlug - should extract slug from meta tag", () => {
  const html = `
    <html>
      <head>
        <meta name="article-slug" content="my-test-slug">
      </head>
      <body></body>
    </html>
  `;
  const result = extractReturnedSlug(html);
  assert.equal(result, "my-test-slug");
});

test("extractReturnedSlug - should format slug using topicToSlug when extracted from meta tag", () => {
  const html = `
    <html>
      <head>
        <meta name="article-slug" content="My Test Slug!! ">
      </head>
      <body></body>
    </html>
  `;
  const result = extractReturnedSlug(html);
  assert.equal(result, "my-test-slug");
});

test("extractReturnedSlug - should fallback to extracting from h1 with blog-post-title class", () => {
  const html = `
    <html>
      <head></head>
      <body>
        <h1 class="blog-post-title">My Awesome Article Title</h1>
      </body>
    </html>
  `;
  const result = extractReturnedSlug(html);
  assert.equal(result, "my-awesome-article-title");
});

test("extractReturnedSlug - should format h1 title to slug", () => {
  const html = `
    <html>
      <head></head>
      <body>
        <h1 class="blog-post-title">  Some Title with <span>HTML</span> tags!  </h1>
      </body>
    </html>
  `;
  const result = extractReturnedSlug(html);
  assert.equal(result, "some-title-with-html-tags");
});

test("extractReturnedSlug - should fallback to extracting from title tag if no meta or h1", () => {
  const html = `
    <html>
      <head>
        <title>Another Great Post | RSMK Blogs</title>
      </head>
      <body></body>
    </html>
  `;
  const result = extractReturnedSlug(html);
  assert.equal(result, "another-great-post");
});

test("extractReturnedSlug - should format title tag to slug", () => {
  const html = `
    <html>
      <head>
        <title>  Another Great Post!! | RSMK Blog</title>
      </head>
      <body></body>
    </html>
  `;
  const result = extractReturnedSlug(html);
  assert.equal(result, "another-great-post");
});

test("extractReturnedSlug - should return fallback slug if no valid tags exist", () => {
  const html = `
    <html>
      <head></head>
      <body>
        <h1>Just a regular h1</h1>
      </body>
    </html>
  `;
  const result = extractReturnedSlug(html);
  assert.equal(result, "new-article");
});
