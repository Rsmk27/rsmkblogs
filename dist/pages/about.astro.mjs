import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CBVrLJdb.mjs';
import 'piccolore';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_BTjp8z_B.mjs';
export { renderers } from '../renderers.mjs';

const $$About = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "About RSMK Blogs & Engineering Team", "description": "Learn about RSMK Blogs, engineered by Srinivasa Manikanta.", "activeTab": "about" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main id="main-content" class="section-padding"> <div class="container" style="max-width: 800px;"> <h1 style="font-size: 2.5rem; margin-bottom: 20px;">About RSMK Blogs</h1> <p style="font-size: 1.1rem; color: var(--text-muted); line-height: 1.7; margin-bottom: 28px;"> <strong>RSMK Blogs</strong> is an open-source technical engineering platform dedicated to providing rigorous documentation, register-level microcontroller guides, MATLAB numerical analysis, industrial automation tutorials, and power electronics design patterns.
</p> <div style="background: var(--surface-color); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 32px; margin: 32px 0;"> <h3 style="margin-top: 0; color: var(--primary-color); font-size: 1.3rem; margin-bottom: 12px;">Engineered & Maintained By</h3> <h2 style="margin-bottom: 8px;">Srinivasa Manikanta (RSMK)</h2> <p style="color: var(--text-muted); margin-bottom: 20px;">
Embedded systems firmware developer, automation specialist, and full-stack software engineer.
</p> <div style="display: flex; gap: 16px; flex-wrap: wrap;"> <a href="https://rsmk.me" target="_blank" rel="noopener" class="btn btn-primary btn-sm">Portfolio (rsmk.me) ↗</a> <a href="https://github.com/Rsmk27" target="_blank" rel="noopener" class="btn btn-outline btn-sm">GitHub Profile ↗</a> <a href="https://www.linkedin.com/in/srinivasamanikanta/" target="_blank" rel="noopener" class="btn btn-outline btn-sm">LinkedIn ↗</a> </div> </div> </div> </main> ` })}`;
}, "D:/websites/git clone/rsmkblogs/src/pages/about.astro", void 0);

const $$file = "D:/websites/git clone/rsmkblogs/src/pages/about.astro";
const $$url = "/about";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$About,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
