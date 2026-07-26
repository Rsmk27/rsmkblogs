/* ==========================================================================
   RSMK Blogs v2.0 — Engineering Knowledge Base Core Script
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    initThemeToggle();
    initReadingProgressBar();
    initGlobalSearchModal();
    initTableOfContents();
    initWikiTermPopovers();
    initCodeCopyButtons();
    initReadingTools();
});

/* --- Theme Toggle --- */
function initThemeToggle() {
    const toggleBtn = document.getElementById("theme-toggle");
    const savedTheme = localStorage.getItem("rsmk_theme") || "dark";
    
    if (savedTheme === "light") {
        document.documentElement.setAttribute("data-theme", "light");
    }

    if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
            const currentTheme = document.documentElement.getAttribute("data-theme");
            const newTheme = currentTheme === "light" ? "dark" : "light";
            if (newTheme === "light") {
                document.documentElement.setAttribute("data-theme", "light");
            } else {
                document.documentElement.removeAttribute("data-theme");
            }
            localStorage.setItem("rsmk_theme", newTheme);
        });
    }
}

/* --- Top Reading Progress Bar --- */
function initReadingProgressBar() {
    let progressBar = document.getElementById("reading-progress-bar");
    if (!progressBar) {
        progressBar = document.createElement("div");
        progressBar.id = "reading-progress-bar";
        document.body.prepend(progressBar);
    }

    window.addEventListener("scroll", () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0) {
            const progress = (window.scrollY / totalHeight) * 100;
            progressBar.style.width = `${Math.min(progress, 100)}%`;
        }
    });
}

/* --- Global Search Modal (Ctrl + K) --- */
function initGlobalSearchModal() {
    const searchBtns = document.querySelectorAll(".search-trigger-btn, .search-trigger-nav");
    let modalBackdrop = document.querySelector(".search-modal-backdrop");

    if (!modalBackdrop) {
        modalBackdrop = document.createElement("div");
        modalBackdrop.className = "search-modal-backdrop";
        modalBackdrop.innerHTML = `
            <div class="search-modal" role="dialog" aria-modal="true" aria-label="Global Documentation Search">
                <div class="search-input-header">
                    <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><path d="M21 21l-4.35-4.35"></path></svg>
                    <input type="text" id="global-search-input" placeholder="Search documentation, technologies, companies, roadmaps..." autocomplete="off">
                    <kbd style="font-size:0.75rem; background:var(--card-bg); border:1px solid var(--border-color); padding:2px 6px; border-radius:4px;">ESC</kbd>
                </div>
                <div class="search-results-list" id="search-results-list">
                    <div style="padding:20px; text-align:center; color:var(--text-subtle); font-size:0.9rem;">Type any keyword to search engineering knowledge base...</div>
                </div>
                <div class="search-modal-footer">
                    <span><kbd>↑</kbd> <kbd>↓</kbd> Navigate</span>
                    <span><kbd>↵</kbd> Select</span>
                    <span><kbd>ESC</kbd> Close</span>
                </div>
            </div>
        `;
        document.body.appendChild(modalBackdrop);
    }

    const searchInput = modalBackdrop.querySelector("#global-search-input");
    const searchResults = modalBackdrop.querySelector("#search-results-list");

    function openModal() {
        modalBackdrop.classList.add("active");
        setTimeout(() => searchInput.focus(), 50);
    }

    function closeModal() {
        modalBackdrop.classList.remove("active");
        searchInput.value = "";
    }

    searchBtns.forEach(btn => btn.addEventListener("click", openModal));

    modalBackdrop.addEventListener("click", (e) => {
        if (e.target === modalBackdrop) closeModal();
    });

    document.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
            e.preventDefault();
            if (modalBackdrop.classList.contains("active")) {
                closeModal();
            } else {
                openModal();
            }
        } else if (e.key === "Escape" && modalBackdrop.classList.contains("active")) {
            closeModal();
        }
    });

    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (!query) {
                searchResults.innerHTML = `<div style="padding:20px; text-align:center; color:var(--text-subtle); font-size:0.9rem;">Type any keyword to search engineering knowledge base...</div>`;
                return;
            }

            const index = window.SEARCH_INDEX || [];
            const matches = index.filter(item => {
                return item.title.toLowerCase().includes(query) ||
                       item.category.toLowerCase().includes(query) ||
                       item.type.toLowerCase().includes(query) ||
                       (item.tags && item.tags.some(t => t.toLowerCase().includes(query)));
            });

            if (matches.length === 0) {
                searchResults.innerHTML = `<div style="padding:20px; text-align:center; color:var(--text-subtle); font-size:0.9rem;">No documentation matching "${query}"</div>`;
                return;
            }

            searchResults.innerHTML = matches.map((item, idx) => `
                <a href="${item.url}" class="search-result-item ${idx === 0 ? 'selected' : ''}">
                    <div class="search-result-title">
                        <span>${item.title}</span>
                        <span class="badge" style="background:var(--card-bg); border:1px solid var(--border-color); color:var(--primary-color); font-size:0.7rem;">${item.type}</span>
                    </div>
                    <div class="search-result-meta">${item.category} ${item.tags ? '• ' + item.tags.slice(0, 3).join(', ') : ''}</div>
                </a>
            `).join('');
        });
    }
}

/* --- Auto Table of Contents --- */
function initTableOfContents() {
    const tocContainer = document.getElementById("auto-toc-list");
    const articleBody = document.querySelector(".article-main");
    if (!tocContainer || !articleBody) return;

    const headings = articleBody.querySelectorAll("h2, h3");
    if (headings.length === 0) {
        const sidebar = document.querySelector(".toc-sidebar");
        if (sidebar) sidebar.style.display = "none";
        return;
    }

    tocContainer.innerHTML = "";
    headings.forEach((heading, idx) => {
        if (!heading.id) {
            heading.id = `heading-section-${idx}`;
        }
        const link = document.createElement("a");
        link.href = `#${heading.id}`;
        link.className = `toc-link ${heading.tagName.toLowerCase() === "h3" ? "indent" : ""}`;
        link.textContent = heading.textContent.replace(/^#\s*/, "");
        tocContainer.appendChild(link);
    });

    // ScrollSpy for Active Section
    window.addEventListener("scroll", () => {
        let currentId = "";
        headings.forEach(heading => {
            const top = heading.getBoundingClientRect().top;
            if (top <= 120) {
                currentId = heading.id;
            }
        });

        const links = tocContainer.querySelectorAll(".toc-link");
        links.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${currentId}`) {
                link.classList.add("active");
            }
        });
    });
}

/* --- Wiki Term Tooltips & Popovers --- */
function initWikiTermPopovers() {
    const wikiTerms = document.querySelectorAll(".wiki-term");
    const knowledgeBase = window.KNOWLEDGE_BASE || { terms: {} };

    wikiTerms.forEach(termEl => {
        const termKey = (termEl.getAttribute("data-term") || termEl.textContent).toLowerCase().trim();
        const termData = knowledgeBase.terms[termKey];

        if (termData) {
            let popover = termEl.querySelector(".wiki-popover");
            if (!popover) {
                popover = document.createElement("div");
                popover.className = "wiki-popover";
                popover.innerHTML = `
                    <div class="wiki-popover-title">
                        <span>${termData.name}</span>
                        <span style="font-size:0.7rem; color:var(--text-subtle);">${termData.category}</span>
                    </div>
                    <div class="wiki-popover-desc">${termData.shortDesc}</div>
                    <div class="wiki-popover-footer">
                        <a href="technology.html?id=${termData.id}">Open Tech Page →</a>
                    </div>
                `;
                termEl.appendChild(popover);
            }

            termEl.addEventListener("mouseenter", () => popover.classList.add("active"));
            termEl.addEventListener("mouseleave", () => popover.classList.remove("active"));
            termEl.addEventListener("click", (e) => {
                if (!e.target.closest("a")) {
                    window.location.href = `technology.html?id=${termData.id}`;
                }
            });
        }
    });
}

/* --- Code & Terminal Copy Buttons --- */
function initCodeCopyButtons() {
    const codeWrappers = document.querySelectorAll(".code-block-wrapper, pre");
    
    codeWrappers.forEach(wrapper => {
        if (wrapper.querySelector(".copy-btn")) return;
        
        let header = wrapper.querySelector(".code-header");
        if (!header && wrapper.tagName.toLowerCase() === "pre") {
            const container = document.createElement("div");
            container.className = "code-block-wrapper";
            wrapper.parentNode.insertBefore(container, wrapper);
            
            header = document.createElement("div");
            header.className = "code-header";
            header.innerHTML = `<span>CODE</span>`;
            container.appendChild(header);
            container.appendChild(wrapper);
        }

        if (header) {
            const copyBtn = document.createElement("button");
            copyBtn.className = "copy-btn";
            copyBtn.innerHTML = `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Copy`;
            
            copyBtn.addEventListener("click", () => {
                const codeEl = wrapper.querySelector("code") || wrapper.querySelector("pre") || wrapper;
                const textToCopy = codeEl.innerText;

                navigator.clipboard.writeText(textToCopy).then(() => {
                    copyBtn.innerHTML = `✓ Copied!`;
                    copyBtn.style.color = "var(--color-success)";
                    setTimeout(() => {
                        copyBtn.innerHTML = `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Copy`;
                        copyBtn.style.color = "";
                    }, 2000);
                });
            });

            header.appendChild(copyBtn);
        }
    });
}

/* --- Reading Tools (Font Resizer, Distraction-Free) --- */
function initReadingTools() {
    const fontIncrease = document.getElementById("font-increase");
    const fontDecrease = document.getElementById("font-decrease");
    const dfToggle = document.getElementById("df-mode-toggle");
    let scale = parseFloat(localStorage.getItem("rsmk_font_scale") || 1);

    function applyScale() {
        document.documentElement.style.setProperty("--article-font-scale", scale);
        localStorage.setItem("rsmk_font_scale", scale);
    }

    if (fontIncrease) {
        fontIncrease.addEventListener("click", () => {
            if (scale < 1.3) { scale += 0.05; applyScale(); }
        });
    }

    if (fontDecrease) {
        fontDecrease.addEventListener("click", () => {
            if (scale > 0.85) { scale -= 0.05; applyScale(); }
        });
    }

    if (dfToggle) {
        dfToggle.addEventListener("click", () => {
            document.body.classList.toggle("distraction-free");
        });
    }
}
