import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const topicsFile = path.join(__dirname, "topics.json");
const usedTopicsFile = path.join(__dirname, "used-topics.json");
const blogsDir = path.join(rootDir, "blogs");
const articleTemplateSourceFile = path.join(blogsDir, "arduino-uno.html");
const blogIndexCandidates = [
  path.join(rootDir, "blogs.html"),
  path.join(rootDir, "index.html"),
  path.join(rootDir, "blogs", "index.html")
];

const anthropicEndpoint = "https://api.anthropic.com/v1/messages";
const anthropicModel = "claude-sonnet-4-20250514";

function formatLongDate(date = new Date()) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric"
  }).format(date);
}

function formatShortDate(date = new Date()) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric"
  }).format(date);
}

function topicToSlug(topic) {
  return topic
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function loadEnvLocal() {
  const envLocalPath = path.join(rootDir, ".env.local");
  if (!(await exists(envLocalPath))) {
    return;
  }

  const envContent = await fs.readFile(envLocalPath, "utf8");
  for (const rawLine of envContent.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");
    if (separatorIndex <= 0) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

async function readJsonArray(filePath, fallback = []) {
  if (!(await exists(filePath))) {
    return fallback;
  }

  const raw = await fs.readFile(filePath, "utf8");
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    throw new Error(`${path.basename(filePath)} must be a JSON array.`);
  }
  return parsed;
}

async function writeJson(filePath, data) {
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

async function chooseTopic() {
  const topics = await readJsonArray(topicsFile);
  if (!topics.length) {
    throw new Error("topics.json is empty. Add at least one topic.");
  }

  let usedTopics = await readJsonArray(usedTopicsFile, []);
  let unusedTopics = topics.filter((topic) => !usedTopics.includes(topic));

  if (!unusedTopics.length) {
    usedTopics = [];
    unusedTopics = [...topics];
    await writeJson(usedTopicsFile, usedTopics);
    console.log("All topics were used. Reset scripts/used-topics.json.");
  }

  const randomIndex = Math.floor(Math.random() * unusedTopics.length);
  return {
    topic: unusedTopics[randomIndex],
    usedTopics
  };
}

function buildArticleTemplate(html) {
  let template = html;

  template = template.replace(
    /<meta\s+name="description"[\s\S]*?content="[^"]*"\s*\/?\s*>/i,
    '<meta name="description" content="META_DESCRIPTION" />\n    <meta name="article-slug" content="ARTICLE_SLUG">'
  );

  template = template.replace(
    /<meta\s+name="keywords"[\s\S]*?content="[^"]*"\s*\/?\s*>/i,
    '<meta name="keywords" content="TAG_1, TAG_2, TAG_3">'
  );

  template = template.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?\s*>/i,
    '<link rel="canonical" href="https://blogs.rsmk.me/blogs/ARTICLE_SLUG.html">'
  );

  template = template.replace(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?\s*>/i,
    '<meta property="og:url" content="https://blogs.rsmk.me/blogs/ARTICLE_SLUG.html">'
  );

  template = template.replace(
    /<meta\s+property="og:title"[\s\S]*?content="[^"]*"\s*\/?\s*>/i,
    '<meta property="og:title" content="ARTICLE_TITLE | RSMK Blogs">'
  );

  template = template.replace(
    /<meta\s+property="og:description"[\s\S]*?content="[^"]*"\s*\/?\s*>/i,
    '<meta property="og:description" content="META_DESCRIPTION">'
  );

  template = template.replace(
    /<meta\s+property="twitter:url"\s+content="[^"]*"\s*\/?\s*>/i,
    '<meta property="twitter:url" content="https://blogs.rsmk.me/blogs/ARTICLE_SLUG.html">'
  );

  template = template.replace(
    /<meta\s+property="twitter:title"[\s\S]*?content="[^"]*"\s*\/?\s*>/i,
    '<meta property="twitter:title" content="ARTICLE_TITLE | RSMK Blogs">'
  );

  template = template.replace(
    /<meta\s+property="twitter:description"[\s\S]*?content="[^"]*"\s*\/?\s*>/i,
    '<meta property="twitter:description" content="META_DESCRIPTION">'
  );

  template = template.replace(
    /<title>[\s\S]*?<\/title>/i,
    '<title>ARTICLE_TITLE | RSMK Blogs</title>'
  );

  template = template.replace(
    /<div class="blog-post-meta">[\s\S]*?<\/div>/i,
    '<div class="blog-post-meta">\n                        <span>TAG_1</span> &bull; <span>ARTICLE_DATE</span>\n                    </div>'
  );

  template = template.replace(
    /<h1 class="blog-post-title">[\s\S]*?<\/h1>/i,
    '<h1 class="blog-post-title">ARTICLE_TITLE</h1>'
  );

  template = template.replace(
    /<div class="blog-content">[\s\S]*?<\/div>\s*<\/div>\s*<\/article>/i,
    '<div class="blog-content">\n                    ARTICLE_BODY\n                </div>\n            </div>\n        </article>'
  );

  return template;
}

async function buildPrompt(topic, articleTemplateHTML, todayFormatted) {
  return `You are writing a blog article for a personal portfolio website of an Electrical & Electronics Engineering student who builds IoT, embedded systems, and green tech projects.

Write a complete, self-contained HTML article page about: "${topic}"

Rules:
- Return ONLY the raw HTML - no markdown, no code fences, no explanation
- The article should be 600-900 words of body content
- Use clear headings (h2, h3), paragraphs, and optionally a simple bullet list
- The audience is engineering students, makers, and tech enthusiasts
- Tone: clear, practical, slightly conversational
- Include this exact tag in the head for machine parsing: <meta name="article-slug" content="ARTICLE_SLUG">

Use EXACTLY this HTML structure (copy the structure, fill in the content):

${articleTemplateHTML}

Where:
- ARTICLE_TITLE = the full article title
- ARTICLE_DATE = today's date formatted as "Month DD, YYYY" (today is ${todayFormatted})
- TAG_1, TAG_2, TAG_3 = 2-3 relevant topic tags
- ARTICLE_SLUG = a url-friendly slug for this article (lowercase, hyphens only)
- ARTICLE_BODY = the full article HTML content (h2, h3, p, ul/li tags only - no inline styles)
- META_DESCRIPTION = one sentence SEO description under 160 characters`;
}

function extractClaudeText(responseJson) {
  const blocks = responseJson?.content;
  if (!Array.isArray(blocks)) {
    throw new Error("Anthropic API response did not include content blocks.");
  }

  const textBlock = blocks.find((block) => block?.type === "text");
  if (!textBlock?.text) {
    throw new Error("Anthropic API response did not include text output.");
  }

  return textBlock.text.trim();
}

function sanitizeHtmlOutput(text) {
  return text
    .replace(/^```html\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```\s*$/i, "")
    .trim();
}

function ensureMetaSlug(html, slug) {
  if (/<meta\s+name="article-slug"\s+content="[^"]*"\s*>/i.test(html)) {
    return html.replace(
      /<meta\s+name="article-slug"\s+content="[^"]*"\s*>/i,
      `<meta name="article-slug" content="${slug}">`
    );
  }

  if (/<head>/i.test(html)) {
    return html.replace(/<head>/i, `<head>\n    <meta name="article-slug" content="${slug}">`);
  }

  return html;
}

function normalizeSlugUrls(html, slug) {
  return html
    .replace(/(rel="canonical"\s+href=")([^"]+)(")/i, `$1https://blogs.rsmk.me/blogs/${slug}.html$3`)
    .replace(/(property="og:url"\s+content=")([^"]+)(")/i, `$1https://blogs.rsmk.me/blogs/${slug}.html$3`)
    .replace(/(property="twitter:url"\s+content=")([^"]+)(")/i, `$1https://blogs.rsmk.me/blogs/${slug}.html$3`);
}

function extractReturnedSlug(html) {
  const metaMatch = html.match(/<meta\s+name="article-slug"\s+content="([^"]+)"\s*>/i);
  if (metaMatch?.[1]) {
    return topicToSlug(metaMatch[1]);
  }

  const title = extractArticleTitle(html);
  return title ? topicToSlug(title) : "";
}

function extractArticleTitle(html) {
  const h1Match = html.match(/<h1[^>]*class="blog-post-title"[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1Match) {
    return h1Match[1].replace(/<[^>]+>/g, "").trim();
  }

  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
  if (titleMatch) {
    return titleMatch[1].replace(/\s*\|\s*RSMK\s*Blogs?/i, "").trim();
  }

  return "New Article";
}

function extractMetaDescription(html) {
  const match = html.match(/<meta\s+name="description"\s+content="([^"]*)"\s*\/?\s*>/i);
  if (match) {
    return match[1].trim();
  }
  return "A new article from RSMK on engineering, embedded systems, and future technologies.";
}

function extractPrimaryTag(html) {
  const keywordsMatch = html.match(/<meta\s+name="keywords"\s+content="([^"]*)"\s*\/?\s*>/i);
  if (!keywordsMatch) {
    return null;
  }

  const tags = keywordsMatch[1]
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  return tags.length ? tags[0] : null;
}

function inferCategory(topic, primaryTag) {
  const tagCandidate = (primaryTag || "").toLowerCase();
  const topicLower = topic.toLowerCase();

  if (tagCandidate.includes("green") || topicLower.includes("solar") || topicLower.includes("energy") || topicLower.includes("ev")) {
    return "Green Energy";
  }

  if (tagCandidate.includes("iot") || topicLower.includes("iot") || topicLower.includes("esp32") || topicLower.includes("esp8266") || topicLower.includes("mqtt")) {
    return "IoT";
  }

  if (tagCandidate.includes("career") || topicLower.includes("career")) {
    return "Careers";
  }

  if (tagCandidate.includes("future") || topicLower.includes("quantum") || topicLower.includes("ai")) {
    return "Future Tech";
  }

  return "Embedded Systems";
}

function estimateReadMinutes(html) {
  const match = html.match(/<div class="blog-content">([\s\S]*?)<\/div>/i);
  const bodyHtml = match ? match[1] : html;
  const words = bodyHtml
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean).length;

  const minutes = Math.max(4, Math.ceil(words / 180));
  return `${minutes} min read`;
}

async function findUniqueSlug(baseSlug) {
  let slug = baseSlug;
  let counter = 1;

  while (await exists(path.join(blogsDir, `${slug}.html`))) {
    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }

  return slug;
}

async function findBlogIndexFile() {
  for (const candidate of blogIndexCandidates) {
    if (await exists(candidate)) {
      const content = await fs.readFile(candidate, "utf8");
      if (content.includes('id="blog-grid"')) {
        return candidate;
      }
    }
  }

  throw new Error("Could not find a blogs index file with id=\"blog-grid\".");
}

function buildNewIndexCard({ slug, title, excerpt, category, dateShort, readTime }) {
  const categoryStyle = category === "Green Energy"
    ? ' style="background: var(--secondary-color); color: #fff;"'
    : category === "IoT"
      ? ' style="background: var(--accent-color); color: #fff;"'
      : "";

  return `                    <!-- Auto Article - ${escapeHtml(slug)} -->
                    <article class="blog-card" data-category="${escapeHtml(category)}">
                        <div class="blog-card-img">
                            <span class="category-tag"${categoryStyle}>${escapeHtml(category)}</span>
                            <img src="assets/images/hero-bg.webp" alt="${escapeHtml(title)}" loading="lazy">
                        </div>
                        <div class="blog-card-content">
                            <div class="blog-meta">
                                <span>${escapeHtml(dateShort)}</span>
                                <span>${escapeHtml(readTime)}</span>
                            </div>
                            <h3 class="blog-title"><a href="blogs/${escapeHtml(slug)}.html">${escapeHtml(title)}</a></h3>
                            <p class="blog-excerpt">${escapeHtml(excerpt)}</p>
                            <a href="blogs/${escapeHtml(slug)}.html" class="read-more-link">Read Article <svg width="18" height="18"
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" stroke-linejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg></a>
                        </div>
                    </article>

`;
}

async function updateBlogIndex({ slug, title, excerpt, category, dateShort, readTime }) {
  const indexFile = await findBlogIndexFile();
  const indexHtml = await fs.readFile(indexFile, "utf8");

  const href = `blogs/${slug}.html`;
  if (indexHtml.includes(`href="${href}"`)) {
    console.log(`Index already contains ${href}; skipping card insertion.`);
    return indexFile;
  }

  const marker = '<div class="blog-grid" id="blog-grid">';
  const markerIndex = indexHtml.indexOf(marker);
  if (markerIndex === -1) {
    throw new Error("Could not locate blog grid container in index file.");
  }

  const insertionPoint = markerIndex + marker.length;
  const cardHtml = `\n${buildNewIndexCard({ slug, title, excerpt, category, dateShort, readTime })}`;
  const updatedHtml = `${indexHtml.slice(0, insertionPoint)}${cardHtml}${indexHtml.slice(insertionPoint)}`;

  await fs.writeFile(indexFile, updatedHtml, "utf8");
  return indexFile;
}

async function generateArticleHtml(topic, todayFormatted) {
  const sourceHtml = await fs.readFile(articleTemplateSourceFile, "utf8");
  const articleTemplateHTML = buildArticleTemplate(sourceHtml);
  const prompt = await buildPrompt(topic, articleTemplateHTML, todayFormatted);

  const response = await fetch(anthropicEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: anthropicModel,
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Anthropic API call failed (${response.status}): ${errorText}`);
  }

  const responseJson = await response.json();
  const rawText = extractClaudeText(responseJson);
  const html = sanitizeHtmlOutput(rawText);

  if (!html.toLowerCase().includes("<html")) {
    throw new Error("Model output does not appear to be a full HTML document.");
  }

  return html;
}

async function main() {
  await loadEnvLocal();

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("Missing ANTHROPIC_API_KEY. Set it in environment variables or add it to .env.local.");
    process.exit(1);
  }

  const todayLong = formatLongDate();
  const todayShort = formatShortDate();

  if (!(await exists(usedTopicsFile))) {
    await writeJson(usedTopicsFile, []);
  }

  const { topic, usedTopics } = await chooseTopic();
  const baseSlug = topicToSlug(topic);
  const slug = await findUniqueSlug(baseSlug);

  console.log(`Selected topic: ${topic}`);
  console.log(`Generated slug: ${slug}`);

  let articleHtml = await generateArticleHtml(topic, todayLong);
  const returnedSlug = extractReturnedSlug(articleHtml);
  articleHtml = ensureMetaSlug(articleHtml, slug);
  articleHtml = normalizeSlugUrls(articleHtml, slug);

  if (returnedSlug && returnedSlug !== slug) {
    console.log(`Model returned slug '${returnedSlug}', but script enforced '${slug}'.`);
  }

  const articleFilePath = path.join(blogsDir, `${slug}.html`);
  await fs.writeFile(articleFilePath, `${articleHtml.trim()}\n`, "utf8");

  const title = extractArticleTitle(articleHtml);
  const excerpt = extractMetaDescription(articleHtml);
  const primaryTag = extractPrimaryTag(articleHtml);
  const category = inferCategory(topic, primaryTag);
  const readTime = estimateReadMinutes(articleHtml);

  const indexFile = await updateBlogIndex({
    slug,
    title,
    excerpt,
    category,
    dateShort: todayShort,
    readTime
  });

  await writeJson(usedTopicsFile, [...usedTopics, topic]);

  console.log(`Article created: blogs/${slug}.html`);
  console.log(`Blog index updated: ${path.relative(rootDir, indexFile).replace(/\\/g, "/")}`);
  console.log("Topic usage updated: scripts/used-topics.json");
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
