import { describe, it } from 'node:test';
import assert from 'node:assert';
import { normalizeSlugUrls } from '../scripts/generate-article.mjs';

describe('normalizeSlugUrls', () => {
    it('should replace canonical url', () => {
        const html = '<link rel="canonical" href="https://example.com/old.html" />';
        const result = normalizeSlugUrls(html, 'new-slug');
        assert.equal(result, '<link rel="canonical" href="https://blogs.rsmk.me/blogs/new-slug.html" />');
    });

    it('should replace og:url', () => {
        const html = '<meta property="og:url" content="https://example.com/old.html" />';
        const result = normalizeSlugUrls(html, 'new-slug');
        assert.equal(result, '<meta property="og:url" content="https://blogs.rsmk.me/blogs/new-slug.html" />');
    });

    it('should replace twitter:url', () => {
        const html = '<meta property="twitter:url" content="https://example.com/old.html" />';
        const result = normalizeSlugUrls(html, 'new-slug');
        assert.equal(result, '<meta property="twitter:url" content="https://blogs.rsmk.me/blogs/new-slug.html" />');
    });

    it('should handle all replacements in a full document', () => {
        const html = `
<!DOCTYPE html>
<html>
<head>
    <link rel="canonical" href="old-url" />
    <meta property="og:url" content="old-url" />
    <meta property="twitter:url" content="old-url" />
</head>
<body></body>
</html>`;
        const result = normalizeSlugUrls(html, 'new-slug');
        assert.ok(result.includes('<link rel="canonical" href="https://blogs.rsmk.me/blogs/new-slug.html" />'));
        assert.ok(result.includes('<meta property="og:url" content="https://blogs.rsmk.me/blogs/new-slug.html" />'));
        assert.ok(result.includes('<meta property="twitter:url" content="https://blogs.rsmk.me/blogs/new-slug.html" />'));
        assert.ok(!result.includes('old-url'));
    });

    it('should be case insensitive for attributes', () => {
        const html = '<link REL="canonical" HREF="https://example.com/old.html" />';
        const result = normalizeSlugUrls(html, 'new-slug');
        assert.equal(result, '<link REL="canonical" HREF="https://blogs.rsmk.me/blogs/new-slug.html" />');
    });

    it('should leave unrelated html untouched', () => {
        const html = '<div class="content"><a href="https://example.com">Link</a></div>';
        const result = normalizeSlugUrls(html, 'new-slug');
        assert.equal(result, html);
    });

    it('should handle missing quotes (though regex expects quotes)', () => {
        // Current regex requires quotes, let's verify behavior
        const html = '<link rel="canonical" href=https://example.com/old.html />';
        const result = normalizeSlugUrls(html, 'new-slug');
        // Unmodified since regex fails
        assert.equal(result, html);
    });

    it('should handle extra whitespace', () => {
        const html = '<link rel="canonical"    href="https://example.com/old.html" />';
        const result = normalizeSlugUrls(html, 'new-slug');
        assert.equal(result, '<link rel="canonical"    href="https://blogs.rsmk.me/blogs/new-slug.html" />');
    });
});
