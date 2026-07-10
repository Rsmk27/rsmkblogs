import { describe, it } from 'node:test';
import assert from 'node:assert';
import { extractArticleTitle } from '../generate-article.mjs';

describe('extractArticleTitle', () => {
    it('should extract title from <h1 class="blog-post-title">', () => {
        const html = '<h1 class="blog-post-title">My Great Article</h1>';
        assert.strictEqual(extractArticleTitle(html), 'My Great Article');
    });

    it('should ignore other h1 classes and use <title>', () => {
        const html = '<title>Another Article</title><h1 class="other">Not Title</h1>';
        assert.strictEqual(extractArticleTitle(html), 'Another Article');
    });

    it('should strip HTML tags inside matched h1', () => {
        const html = '<h1 class="blog-post-title">My <b>Great</b> Article</h1>';
        assert.strictEqual(extractArticleTitle(html), 'My Great Article');
    });

    it('should correctly fallback to <title> if no h1 class="blog-post-title" is present', () => {
        const html = '<title>Title Fallback</title>';
        assert.strictEqual(extractArticleTitle(html), 'Title Fallback');
    });

    it('should strip " | RSMK Blog" suffix from the <title> tag', () => {
        const html = '<title>Title Suffix | RSMK Blog</title>';
        assert.strictEqual(extractArticleTitle(html), 'Title Suffix');
    });

    it('should strip " | RSMK Blogs" suffix from the <title> tag', () => {
        const html = '<title>Title Suffix | RSMK Blogs</title>';
        assert.strictEqual(extractArticleTitle(html), 'Title Suffix');
    });

    it('should handle case insensitivity and whitespace around suffix in <title> tag', () => {
        const html = '<title>Title Suffix   |rsmk   blog</title>';
        assert.strictEqual(extractArticleTitle(html), 'Title Suffix');
    });

    it('should return "New Article" when neither h1 nor title are present', () => {
        const html = '<div>Just some content</div>';
        assert.strictEqual(extractArticleTitle(html), 'New Article');
    });

    it('should extract from complex HTML string', () => {
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Ignored Title | RSMK Blog</title>
            </head>
            <body>
                <header>
                    <h1 class="blog-post-title">  The <span>Real</span> Title  </h1>
                </header>
            </body>
            </html>
        `;
        assert.strictEqual(extractArticleTitle(html), 'The Real Title');
    });
});
