import React, { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';

const renderer = new marked.Renderer();

renderer.heading = function (token) {
  const text = this.parser.parseInline(token.tokens);
  const { depth } = token;
  if (depth === 4) return `<h4 style="margin:10px 0 4px; font-size:0.92rem; font-weight:700;">${text}</h4>`;
  if (depth === 3) return `<h3 style="margin:12px 0 6px; font-size:0.98rem; font-weight:700;">${text}</h3>`;
  if (depth === 2) return `<h2 style="margin:14px 0 8px; font-size:1.05rem; color:var(--primary-color); font-weight:700;">${text}</h2>`;
  if (depth === 1) return `<h1 style="margin:16px 0 10px; font-size:1.12rem; color:var(--primary-color); font-weight:800;">${text}</h1>`;
  return `<h${depth}>${text}</h${depth}>`;
};

renderer.link = function (token) {
  const { href } = token;
  const text = this.parser.parseInline(token.tokens);
  return `<a href="${href}" target="_blank" rel="noopener" style="color:var(--primary-color); text-decoration:underline;">${text}</a>`;
};

renderer.listitem = function (token) {
  let text = '';
  if (token.task) {
    text += `<input ${token.checked ? 'checked="" ' : ''}disabled="" type="checkbox" /> `;
  }
  text += this.parser.parse(token.tokens, !!token.loose);
  if (!token.loose) {
    text = text.replace(/^<p[^>]*>/, '').replace(/<\/p>\n?$/, '');
  }
  return `<li style="margin-bottom:3px;">${text.trim()}</li>\n`;
};

renderer.list = function (token) {
  const { ordered } = token;
  let body = '';
  for (let i = 0; i < token.items.length; i++) {
    body += this.listitem(token.items[i]);
  }
  const type = ordered ? 'ol' : 'ul';
  const style = ordered ? '' : 'style="margin:6px 0 10px 18px; list-style-type:disc;"';
  return `<${type} ${style}>\n${body}</${type}>`;
};

renderer.paragraph = function (token) {
  const text = this.parser.parseInline(token.tokens);
  return `<p style="margin-bottom:8px; line-height:1.5;">${text.replace(/\n/g, '<br>')}</p>`;
};

renderer.code = function (token) {
  const { text, lang: language } = token;
  const lang = (language || 'CODE').toUpperCase();
  const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return `<div class="code-block-wrapper" style="margin:10px 0;"><div class="code-header"><span>${lang}</span></div><pre style="padding:10px; margin:0; overflow-x:auto;"><code>${escaped}</code></pre></div>`;
};

renderer.codespan = function (token) {
  return `<code>${token.text}</code>`;
};

renderer.strong = function (token) {
  const text = this.parser.parseInline(token.tokens);
  return `<strong>${text}</strong>`;
};

renderer.em = function (token) {
  const text = this.parser.parseInline(token.tokens);
  return `<em>${text}</em>`;
};

marked.use({ renderer, breaks: true });

export default function ManiAIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm **Mani AI** 🧠, your engineering knowledge assistant. How can I help you today?",
    },
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    window.askManiPrompt = (promptText) => {
      setIsOpen(true);
      setInputVal(promptText);
      setTimeout(() => {
        handleSend(promptText);
      }, 100);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const renderMarkdown = (text) => {
    if (!text) return '';
    return marked.parse(String(text).trim());
  };

  const handleSend = async (queryText) => {
    const query = queryText || inputVal;
    if (!query.trim()) return;

    const newMessages = [...messages, { role: 'user', content: query }];
    setMessages(newMessages);
    setInputVal('');
    setIsThinking(true);

    try {
      const res = await fetch('https://project-mani-c0t3.onrender.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query,
          siteContext: `User is viewing page: ${document.title}`,
          history: newMessages.slice(0, -1),
        }),
      });

      const data = await res.json();
      setIsThinking(false);

      if (data && data.success && data.response) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: 'Sorry, I encountered an issue fetching a response.' },
        ]);
      }
    } catch (err) {
      setIsThinking(false);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Mani Core service is spinning up. Please try again in a few seconds.' },
      ]);
    }
  };

  return (
    <>
      {/* Backdrop Overlay for Side View Drawer */}
      <div
        className={`mani-ai-overlay ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Floating Trigger Button */}
      <button id="mani-ai-trigger" onClick={() => setIsOpen(!isOpen)} aria-label="Open Mani AI Assistant">
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"></path>
          <rect x="4" y="8" width="16" height="12" rx="2"></rect>
          <circle cx="9" cy="13" r="1"></circle>
          <circle cx="15" cy="13" r="1"></circle>
          <path d="M9 17h6"></path>
        </svg>
        <span>Mani AI</span>
      </button>

      {/* Chat Window */}
      <div id="mani-ai-window" className={isOpen ? 'active' : ''}>
        <div className="mani-header">
          <div className="mani-header-title">
            <div className="mani-status-dot"></div>
            <span>Mani AI Core</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setMessages([])}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-subtle)', cursor: 'pointer', fontSize: '0.75rem' }}
            >
              Clear
            </button>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.1rem', lineHeight: '1' }}
            >
              ✕
            </button>
          </div>
        </div>

        <div className="mani-messages-container">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mani-msg ${msg.role === 'user' ? 'mani-msg-user' : 'mani-msg-ai'}`}
              dangerouslySetInnerHTML={{
                __html: msg.role === 'user' ? msg.content : renderMarkdown(msg.content),
              }}
            />
          ))}
          {isThinking && (
            <div className="mani-msg mani-msg-ai">
              <p>
                <em>Mani Core is thinking... 🧠</em>
              </p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="mani-input-container">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Mani AI anything..."
          />
          <button className="mani-send-btn" onClick={() => handleSend()}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
