import assert from "node:assert";
import { describe, it } from "node:test";
import { ensureMetaSlug } from "./generate-article.mjs";

describe("ensureMetaSlug", () => {
  it("should replace existing article-slug meta tag (case-insensitive)", () => {
    const html1 = `<html><head><meta name="article-slug" content="old-slug"></head><body></body></html>`;
    const html2 = `<html><head><MeTa  NaMe="article-slug"  ConTenT="old-slug" ></head><body></body></html>`;
    const expected = `<html><head><meta name="article-slug" content="new-slug"></head><body></body></html>`;

    assert.strictEqual(ensureMetaSlug(html1, "new-slug"), expected);
    assert.strictEqual(ensureMetaSlug(html2, "new-slug"), expected);
  });

  it("should insert article-slug meta tag into head if missing", () => {
    const html = `<html><head><title>Test</title></head><body></body></html>`;
    const expected = `<html><head>\n    <meta name="article-slug" content="new-slug"><title>Test</title></head><body></body></html>`;

    assert.strictEqual(ensureMetaSlug(html, "new-slug"), expected);
  });

  it("should insert article-slug meta tag into head if missing (case-insensitive head)", () => {
    const html = `<html><HeAd><title>Test</title></head><body></body></html>`;
    const expected = `<html><head>\n    <meta name="article-slug" content="new-slug"><title>Test</title></head><body></body></html>`;

    assert.strictEqual(ensureMetaSlug(html, "new-slug"), expected);
  });

  it("should do nothing if no head and no meta tag exists", () => {
    const html = `<html><body><div>No head tag</div></body></html>`;

    assert.strictEqual(ensureMetaSlug(html, "new-slug"), html);
  });
});
