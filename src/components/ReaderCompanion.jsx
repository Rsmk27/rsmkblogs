import React, { useState, useEffect } from 'react';

export default function ReaderCompanion({ initialMinutes = 12 }) {
  const [percent, setPercent] = useState(0);
  const [minutesLeft, setMinutesLeft] = useState(initialMinutes);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const ratio = Math.min(1, Math.max(0, window.scrollY / totalHeight));
        const currentPercent = Math.round(ratio * 100);
        setPercent(currentPercent);
        const rem = Math.max(1, Math.ceil(initialMinutes * (1 - ratio)));
        setMinutesLeft(rem);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [initialMinutes]);

  const changeFontSize = (delta) => {
    const current = parseFloat(localStorage.getItem('rsmk_font_scale') || '1');
    let next = current + delta;
    if (next >= 0.85 && next <= 1.3) {
      document.documentElement.style.setProperty('--article-font-scale', next.toString());
      localStorage.setItem('rsmk_font_scale', next.toString());
    }
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const askManiPrompt = (promptText) => {
    if (window.askManiPrompt) {
      window.askManiPrompt(promptText);
    }
  };

  const circumference = 125.6;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <aside className="article-sidebar-right">
      {/* Widget 1: Reading Status */}
      <div className="sidebar-widget">
        <div className="widget-title">
          <span>⚡ Reading Status</span>
        </div>
        <div className="reading-stat-box">
          <svg className="progress-ring-svg" width="48" height="48" viewBox="0 0 48 48">
            <circle className="progress-ring-circle-bg" cx="24" cy="24" r="20" strokeWidth="4" fill="transparent" />
            <circle
              className="progress-ring-circle"
              cx="24"
              cy="24"
              r="20"
              strokeWidth="4"
              fill="transparent"
              style={{ strokeDasharray: circumference, strokeDashoffset: offset }}
            />
          </svg>
          <div>
            <div className="stat-text-time">{minutesLeft} min left</div>
            <div className="stat-text-percent">{percent}% completed</div>
          </div>
        </div>
      </div>

      {/* Widget 2: Reader Controls */}
      <div className="sidebar-widget">
        <div className="widget-title">
          <span>🛠️ Reader Controls</span>
        </div>
        <div className="toolkit-btn-grid">
          <button className="toolkit-btn" onClick={() => changeFontSize(-0.05)} title="Decrease Text Size">
            A-
          </button>
          <button className="toolkit-btn" onClick={() => changeFontSize(0.05)} title="Increase Text Size">
            A+
          </button>
          <button className="toolkit-btn" onClick={copyShareLink} title="Copy Share Link">
            {copied ? '✓ Copied' : '🔗 Share'}
          </button>
        </div>
      </div>

      {/* Widget 3: Ask Mani AI */}
      <div className="sidebar-widget">
        <div className="widget-title">
          <span>🧠 Ask Mani AI</span>
        </div>
        <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
          Click a prompt chip to query AI assistant:
        </p>
        <div className="ai-prompt-chips">
          <button className="ai-chip" onClick={() => askManiPrompt('Summarize key takeaways of this article')}>
            💡 Summarize takeaways
          </button>
          <button className="ai-chip" onClick={() => askManiPrompt('Explain core code logic in simple terms')}>
            ⚡ Explain code logic
          </button>
          <button className="ai-chip" onClick={() => askManiPrompt('Give me 3 quiz questions about this article')}>
            ❓ Test my knowledge
          </button>
        </div>
      </div>

      {/* Widget 4: Quick Reference */}
      <div className="sidebar-widget">
        <div className="widget-title">
          <span>📌 Quick Reference</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <a
            href="/topics"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.825rem',
              color: 'var(--text-main)',
              padding: '8px 10px',
              background: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <span>Engineering Domains</span>
            <span style={{ color: 'var(--primary-color)' }}>→</span>
          </a>
          <a
            href="/blogs"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.825rem',
              color: 'var(--text-main)',
              padding: '8px 10px',
              background: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <span>Documentation Catalog</span>
            <span style={{ color: 'var(--primary-color)' }}>→</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
