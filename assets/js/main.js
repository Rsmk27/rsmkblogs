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
    initManiAIChatbot();
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

/* --- Auto Table of Contents with Active Section Highlighting --- */
function initTableOfContents() {
    const tocContainer = document.getElementById("auto-toc-list") || document.querySelector(".toc-list");
    const articleBody = document.querySelector(".article-main-center") || document.querySelector(".article-main");
    if (!tocContainer || !articleBody) return;

    const headings = articleBody.querySelectorAll("h2, h3");
    if (headings.length === 0) {
        const sidebar = document.querySelector(".article-sidebar-left, .toc-sidebar");
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

        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetEl = document.getElementById(heading.id);
            if (targetEl) {
                const yOffset = -90; // Offset for fixed header
                const y = targetEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: "smooth" });
                history.pushState(null, null, `#${heading.id}`);
            }
        });

        tocContainer.appendChild(link);
    });

    const links = tocContainer.querySelectorAll(".toc-link");
    let currentActiveId = null;
    let ticking = false;

    function updateActiveHeading() {
        let currentId = "";
        headings.forEach(heading => {
            const top = heading.getBoundingClientRect().top;
            if (top <= 140) {
                currentId = heading.id;
            }
        });

        if (currentId !== currentActiveId) {
            currentActiveId = currentId;
            links.forEach(link => {
                if (link.getAttribute("href") === `#${currentId}`) {
                    link.classList.add("active");
                } else {
                    link.classList.remove("active");
                }
            });
        }
        ticking = false;
    }

    window.addEventListener("scroll", () => {
        if (!ticking) {
            window.requestAnimationFrame(updateActiveHeading);
            ticking = true;
        }
    }, { passive: true });
    updateActiveHeading();
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

/* --- Reading Tools (Font Resizer, Dynamic Progress, Share Link) --- */
function initReadingTools() {
    const fontIncrease = document.getElementById("font-increase");
    const fontDecrease = document.getElementById("font-decrease");
    const shareLinkBtn = document.getElementById("share-link-btn");
    const timeLeftEl = document.getElementById("reading-time-left");
    const percentTextEl = document.getElementById("reading-percent-text");
    const progressCircle = document.getElementById("reading-progress-circle-bar");

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

    if (shareLinkBtn) {
        shareLinkBtn.addEventListener("click", () => {
            navigator.clipboard.writeText(window.location.href).then(() => {
                const origText = shareLinkBtn.innerText;
                shareLinkBtn.innerText = "✓ Copied!";
                shareLinkBtn.style.borderColor = "var(--color-success)";
                setTimeout(() => {
                    shareLinkBtn.innerText = origText;
                    shareLinkBtn.style.borderColor = "";
                }, 2000);
            });
        });
    }

    // Dynamic Reading Progress Calculation
    window.addEventListener("scroll", () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0) {
            const scrollRatio = Math.min(1, Math.max(0, window.scrollY / totalHeight));
            const percent = Math.round(scrollRatio * 100);

            if (percentTextEl) percentTextEl.textContent = `${percent}% read`;

            // Initial estimate of 12 mins total
            const initialMinutes = 12;
            const remainingMinutes = Math.max(1, Math.ceil(initialMinutes * (1 - scrollRatio)));
            if (timeLeftEl) timeLeftEl.textContent = `${remainingMinutes} min left`;

            if (progressCircle) {
                const circumference = 125.6; // 2 * PI * 20
                const offset = circumference - (scrollRatio * circumference);
                progressCircle.style.strokeDashoffset = offset;
            }
        }
    });
}

// Global Helper for Right Sidebar Mani AI Chips
window.askManiPrompt = function(promptText) {
    const windowEl = document.getElementById("mani-ai-window");
    const inputEl = document.getElementById("mani-user-input");
    const sendBtn = document.getElementById("mani-send-btn");

    if (windowEl && inputEl && sendBtn) {
        windowEl.classList.add("active");
        inputEl.value = promptText;
        sendBtn.click();
    }
};

/* --- Mani AI Chatbot Widget with Fast Typing Animation --- */
function initManiAIChatbot() {
    let trigger = document.getElementById("mani-ai-trigger");
    let windowEl = document.getElementById("mani-ai-window");

    let overlayEl = document.querySelector(".mani-ai-overlay");
    if (!overlayEl) {
        overlayEl = document.createElement("div");
        overlayEl.className = "mani-ai-overlay";
        document.body.appendChild(overlayEl);
    }

    if (!trigger) {
        trigger = document.createElement("button");
        trigger.id = "mani-ai-trigger";
        trigger.innerHTML = `
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"></path><rect x="4" y="8" width="16" height="12" rx="2"></rect><circle cx="9" cy="13" r="1"></circle><circle cx="15" cy="13" r="1"></circle><path d="M9 17h6"></path></svg>
            <span>Mani AI</span>
        `;
        document.body.appendChild(trigger);
    }

    if (!windowEl) {
        windowEl = document.createElement("div");
        windowEl.id = "mani-ai-window";
        windowEl.innerHTML = `
            <div class="mani-header">
                <div class="mani-header-title">
                    <div class="mani-status-dot"></div>
                    <span>Mani AI Core</span>
                </div>
                <div style="display:flex; gap:8px;">
                    <button id="mani-clear-btn" style="background:transparent; border:none; color:var(--text-subtle); cursor:pointer; font-size:0.75rem;">Clear</button>
                    <button id="mani-close-btn" style="background:transparent; border:none; color:var(--text-muted); cursor:pointer; font-size:1.1rem; line-height:1;">✕</button>
                </div>
            </div>
            <div class="mani-messages-container" id="mani-messages">
                <div class="mani-msg mani-msg-ai">
                    <p>Hi! I'm <strong>Mani AI</strong> 🧠, your engineering knowledge assistant. How can I help you with embedded hardware, PLCs, SCADA, or RSMK documentation today?</p>
                </div>
            </div>
            <div class="mani-input-container">
                <input type="text" id="mani-user-input" placeholder="Ask Mani AI anything..." autocomplete="off">
                <button class="mani-send-btn" id="mani-send-btn">
                    <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
            </div>
        `;
        document.body.appendChild(windowEl);
    }

    const messagesEl = windowEl.querySelector("#mani-messages");
    const inputEl = windowEl.querySelector("#mani-user-input");
    const sendBtn = windowEl.querySelector("#mani-send-btn");
    const closeBtn = windowEl.querySelector("#mani-close-btn");
    const clearBtn = windowEl.querySelector("#mani-clear-btn");

    let history = JSON.parse(sessionStorage.getItem("mani_chat_history") || "[]");

    // Robust Markdown Rendering Engine
    function renderMarkdown(text) {
        if (!text) return "";

        let src = String(text).trim();

        // 1. Extract and preserve code blocks (```lang ... ```)
        const codeBlocks = [];
        src = src.replace(/```([a-zA-Z0-9_-]*)\n?([\s\S]*?)```/g, (match, lang, code) => {
            const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
            const escapedCode = code
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");
            const langName = (lang || 'CODE').toUpperCase();
            codeBlocks.push(
                `<div class="code-block-wrapper" style="margin: 10px 0;">` +
                `<div class="code-header"><span>${langName}</span></div>` +
                `<pre style="padding: 10px; margin: 0; overflow-x: auto;"><code>${escapedCode.trim()}</code></pre>` +
                `</div>`
            );
            return placeholder;
        });

        // 2. Escape HTML special characters for raw text
        src = src.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

        // 3. Extract and preserve inline code (`code`)
        const inlineCodes = [];
        src = src.replace(/`([^`]+)`/g, (match, code) => {
            const placeholder = `__INLINE_CODE_${inlineCodes.length}__`;
            inlineCodes.push(`<code>${code}</code>`);
            return placeholder;
        });

        // 4. Headings
        src = src.replace(/^####\s+(.*$)/gim, '<h4 style="margin: 10px 0 4px; font-size: 0.92rem; color: var(--text-main); font-weight: 700;">$1</h4>');
        src = src.replace(/^###\s+(.*$)/gim, '<h3 style="margin: 12px 0 6px; font-size: 0.98rem; color: var(--text-main); font-weight: 700;">$1</h3>');
        src = src.replace(/^##\s+(.*$)/gim, '<h2 style="margin: 14px 0 8px; font-size: 1.05rem; color: var(--primary-color); font-weight: 700;">$1</h2>');
        src = src.replace(/^#\s+(.*$)/gim, '<h1 style="margin: 16px 0 10px; font-size: 1.12rem; color: var(--primary-color); font-weight: 800;">$1</h1>');

        // 5. Bold & Italics
        src = src.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        src = src.replace(/__([^_]+)__/g, '<strong>$1</strong>');
        src = src.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        src = src.replace(/_([^_]+)_/g, '<em>$1</em>');

        // 6. Links [text](url)
        src = src.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" style="color: var(--primary-color); text-decoration: underline;">$1</a>');

        // 7. Blockquotes (> quote)
        src = src.replace(/^&gt;\s+(.*$)/gim, '<blockquote style="border-left: 3px solid var(--primary-color); padding-left: 10px; margin: 8px 0; color: var(--text-muted); font-style: italic;">$1</blockquote>');

        // 8. Lists (Unordered & Ordered)
        src = src.replace(/^[\s]*[-\*]\s+(.*$)/gim, '<li style="margin-bottom: 3px;">$1</li>');
        src = src.replace(/(<li style="margin-bottom: 3px;">.*<\/li>\n?)+/g, '<ul style="margin: 6px 0 10px 18px; padding-left: 0; list-style-type: disc; color: var(--text-main);">$&</ul>');

        src = src.replace(/^[\s]*\d+\.\s+(.*$)/gim, '<li class="oli" style="margin-bottom: 3px;">$1</li>');
        src = src.replace(/(<li class="oli" style="margin-bottom: 3px;">.*<\/li>\n?)+/g, '<ol style="margin: 6px 0 10px 18px; padding-left: 0; list-style-type: decimal; color: var(--text-main);">$&</ol>');

        // 9. Paragraphs
        const blocks = src.split(/\n{2,}/);
        src = blocks.map(block => {
            const b = block.trim();
            if (!b) return '';
            if (b.startsWith('<h') || b.startsWith('<ul') || b.startsWith('<ol') || b.startsWith('<blockquote') || b.startsWith('__CODE_BLOCK_')) {
                return b;
            }
            return `<p style="margin-bottom: 8px; line-height: 1.55;">${b.replace(/\n/g, '<br>')}</p>`;
        }).join('\n');

        // 10. Restore code blocks & inline code
        codeBlocks.forEach((block, idx) => {
            src = src.replace(`__CODE_BLOCK_${idx}__`, block);
        });
        inlineCodes.forEach((code, idx) => {
            src = src.replace(`__INLINE_CODE_${idx}__`, code);
        });

        return src;
    }

    // Fast Typing Animation Function
    function typeResponseAnimation(element, fullText, onComplete) {
        let currentIndex = 0;
        const chunkSize = 4; // Type 4 characters at a time
        const interval = 10; // 10ms delay per frame

        const timer = setInterval(() => {
            currentIndex += chunkSize;
            if (currentIndex >= fullText.length) {
                currentIndex = fullText.length;
                clearInterval(timer);
                element.innerHTML = renderMarkdown(fullText);
                initCodeCopyButtons();
                messagesEl.scrollTop = messagesEl.scrollHeight;
                if (onComplete) onComplete();
            } else {
                const textChunk = fullText.substring(0, currentIndex);
                element.innerHTML = renderMarkdown(textChunk);
                messagesEl.scrollTop = messagesEl.scrollHeight;
            }
        }, interval);
    }

    history.forEach(msg => {
        const msgDiv = document.createElement("div");
        msgDiv.className = `mani-msg ${msg.role === "user" ? "mani-msg-user" : "mani-msg-ai"}`;
        msgDiv.innerHTML = msg.role === "user" ? msg.content : renderMarkdown(msg.content);
        messagesEl.appendChild(msgDiv);
    });

    trigger.addEventListener("click", () => {
        windowEl.classList.toggle("active");
        overlayEl.classList.toggle("active", windowEl.classList.contains("active"));
        if (windowEl.classList.contains("active")) {
            inputEl.focus();
        }
    });

    closeBtn.addEventListener("click", () => {
        windowEl.classList.remove("active");
        overlayEl.classList.remove("active");
    });

    overlayEl.addEventListener("click", () => {
        windowEl.classList.remove("active");
        overlayEl.classList.remove("active");
    });

    clearBtn.addEventListener("click", () => {
        history = [];
        sessionStorage.removeItem("mani_chat_history");
        messagesEl.innerHTML = `
            <div class="mani-msg mani-msg-ai">
                <p>Hi! I'm <strong>Mani AI</strong> 🧠, your engineering knowledge assistant. How can I help you today?</p>
            </div>
        `;
    });

    async function sendMessage() {
        const query = inputEl.value.trim();
        if (!query) return;

        const userMsgDiv = document.createElement("div");
        userMsgDiv.className = "mani-msg mani-msg-user";
        userMsgDiv.textContent = query;
        messagesEl.appendChild(userMsgDiv);
        inputEl.value = "";
        messagesEl.scrollTop = messagesEl.scrollHeight;

        const loadingDiv = document.createElement("div");
        loadingDiv.className = "mani-msg mani-msg-ai";
        loadingDiv.innerHTML = `<p><em>Mani Core is thinking... 🧠</em></p>`;
        messagesEl.appendChild(loadingDiv);
        messagesEl.scrollTop = messagesEl.scrollHeight;

        const siteContext = `User is currently viewing page: ${document.title} (URL: ${window.location.href})`;

        try {
            const res = await fetch("https://project-mani-c0t3.onrender.com/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    query: query,
                    siteContext: siteContext,
                    history: history
                })
            });

            const data = await res.json();
            messagesEl.removeChild(loadingDiv);

            if (data && data.success && data.response) {
                const aiResponse = data.response;
                const aiMsgDiv = document.createElement("div");
                aiMsgDiv.className = "mani-msg mani-msg-ai";
                messagesEl.appendChild(aiMsgDiv);

                typeResponseAnimation(aiMsgDiv, aiResponse, () => {
                    history.push({ role: "user", content: query });
                    history.push({ role: "assistant", content: aiResponse });
                    sessionStorage.setItem("mani_chat_history", JSON.stringify(history));
                });
            } else {
                const errorDiv = document.createElement("div");
                errorDiv.className = "mani-msg mani-msg-ai";
                errorDiv.innerHTML = `<p>Sorry, I encountered an issue fetching response from Mani Core.</p>`;
                messagesEl.appendChild(errorDiv);
            }
        } catch (err) {
            messagesEl.removeChild(loadingDiv);
            const errorDiv = document.createElement("div");
            errorDiv.className = "mani-msg mani-msg-ai";
            errorDiv.innerHTML = `<p>Mani Core service is spinning up or offline. Please try again in a few seconds.</p>`;
            messagesEl.appendChild(errorDiv);
        }

        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    sendBtn.addEventListener("click", sendMessage);
    inputEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            sendMessage();
        }
    });
}
