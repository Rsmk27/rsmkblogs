import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildArticleTemplate } from './generate-article.mjs';

describe('buildArticleTemplate', () => {
  it('should correctly transform all target tags with placeholders', () => {
    const inputHtml = `
      <html>
        <head>
          <meta name="description" content="Old Description">
          <meta name="keywords" content="old, tags">
          <link rel="canonical" href="https://old.com/article">
          <meta property="og:url" content="https://old.com/article">
          <meta property="og:title" content="Old Title | RSMK">
          <meta property="og:description" content="Old OG Description">
          <meta property="twitter:url" content="https://old.com/article">
          <meta property="twitter:title" content="Old Twitter Title | RSMK">
          <meta property="twitter:description" content="Old Twitter Description">
          <title>Old Title | RSMK Blogs</title>
        </head>
        <body>
          <article>
            <div>
              <div class="blog-post-meta">
                  <span>Old Tag</span> &bull; <span>Old Date</span>
              </div>
              <h1 class="blog-post-title">Old H1 Title</h1>
              <div class="blog-content">
                  <p>Old content here...</p>
              </div>
            </div>
          </article>
        </body>
      </html>
    `;

    const expectedHtml = `
      <html>
        <head>
          <meta name="description" content="META_DESCRIPTION" />
    <meta name="article-slug" content="ARTICLE_SLUG">
          <meta name="keywords" content="TAG_1, TAG_2, TAG_3">
          <link rel="canonical" href="https://blogs.rsmk.me/blogs/ARTICLE_SLUG.html">
          <meta property="og:url" content="https://blogs.rsmk.me/blogs/ARTICLE_SLUG.html">
          <meta property="og:title" content="ARTICLE_TITLE | RSMK Blogs">
          <meta property="og:description" content="META_DESCRIPTION">
          <meta property="twitter:url" content="https://blogs.rsmk.me/blogs/ARTICLE_SLUG.html">
          <meta property="twitter:title" content="ARTICLE_TITLE | RSMK Blogs">
          <meta property="twitter:description" content="META_DESCRIPTION">
          <title>ARTICLE_TITLE | RSMK Blogs</title>
        </head>
        <body>
          <article>
            <div>
              <div class="blog-post-meta">
                        <span>TAG_1</span> &bull; <span>ARTICLE_DATE</span>
                    </div>
              <h1 class="blog-post-title">ARTICLE_TITLE</h1>
              <div class="blog-content">
                    ARTICLE_BODY
                </div>
            </div>
        </article>
        </body>
      </html>
    `;

    const result = buildArticleTemplate(inputHtml);

    // Check key replacements directly for robustness
    assert.match(result, /<meta name="description" content="META_DESCRIPTION" \/>/);
    assert.match(result, /<meta name="article-slug" content="ARTICLE_SLUG">/);
    assert.match(result, /<meta name="keywords" content="TAG_1, TAG_2, TAG_3">/);
    assert.match(result, /<link rel="canonical" href="https:\/\/blogs\.rsmk\.me\/blogs\/ARTICLE_SLUG\.html">/);
    assert.match(result, /<meta property="og:url" content="https:\/\/blogs\.rsmk\.me\/blogs\/ARTICLE_SLUG\.html">/);
    assert.match(result, /<meta property="og:title" content="ARTICLE_TITLE \| RSMK Blogs">/);
    assert.match(result, /<meta property="og:description" content="META_DESCRIPTION">/);
    assert.match(result, /<meta property="twitter:url" content="https:\/\/blogs\.rsmk\.me\/blogs\/ARTICLE_SLUG\.html">/);
    assert.match(result, /<meta property="twitter:title" content="ARTICLE_TITLE \| RSMK Blogs">/);
    assert.match(result, /<meta property="twitter:description" content="META_DESCRIPTION">/);
    assert.match(result, /<title>ARTICLE_TITLE \| RSMK Blogs<\/title>/);
    assert.match(result, /<span>TAG_1<\/span> &bull; <span>ARTICLE_DATE<\/span>/);
    assert.match(result, /<h1 class="blog-post-title">ARTICLE_TITLE<\/h1>/);
    assert.match(result, /<div class="blog-content">\s*ARTICLE_BODY\s*<\/div>\s*<\/div>\s*<\/article>/);

    // Ensure old content is gone
    assert.doesNotMatch(result, /Old Description/);
    assert.doesNotMatch(result, /old, tags/);
    assert.doesNotMatch(result, /Old Title/);
    assert.doesNotMatch(result, /Old content here/);
  });

  it('should not modify HTML when target tags are missing', () => {
    const inputHtml = `
      <html>
        <head>
        </head>
        <body>
          <p>Nothing to replace here</p>
        </body>
      </html>
    `;
    const result = buildArticleTemplate(inputHtml);
    assert.equal(result, inputHtml);
  });

  it('should handle multiline and whitespace variations in tags', () => {
    const inputHtml = `
      <html>
        <head>
          <meta
            name="description"
            content="Old Description"
          >
          <title>Old Title</title>
        </head>
      </html>
    `;

    const result = buildArticleTemplate(inputHtml);
    assert.match(result, /<meta name="description" content="META_DESCRIPTION" \/>/);
    assert.match(result, /<meta name="article-slug" content="ARTICLE_SLUG">/);
    assert.match(result, /<title>ARTICLE_TITLE \| RSMK Blogs<\/title>/);
    assert.doesNotMatch(result, /Old Description/);
    assert.doesNotMatch(result, /Old Title/);
  });
});
