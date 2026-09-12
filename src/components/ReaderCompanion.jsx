import React, { useState, useEffect } from 'react';

export default function ReaderCompanion({ initialMinutes = 12, articleTitle = '' }) {
  const [percent, setPercent] = useState(0);
  const [minutesLeft, setMinutesLeft] = useState(initialMinutes);
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [fontScale, setFontScale] = useState(1);

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

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [initialMinutes]);

  // Load bookmark and font preference
  useEffect(() => {
    try {
      const currentUrl = window.location.pathname;
      const slug = currentUrl.replace('/blogs/', '').replace(/\/$/, '');
      const saved = JSON.parse(localStorage.getItem('rsmk_bookmarks') || '[]');
      if (Array.isArray(saved) && saved.includes(slug)) {
        setIsSaved(true);
      }

      const savedScale = parseFloat(localStorage.getItem('rsmk_font_scale') || '1');
      setFontScale(savedScale);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const changeFontSize = (delta) => {
    let next = Math.round((fontScale + delta) * 100) / 100;
    if (next >= 0.85 && next <= 1.35) {
      setFontScale(next);
      document.documentElement.style.setProperty('--article-font-scale', next.toString());
      localStorage.setItem('rsmk_font_scale', next.toString());
    }
  };

  const resetFontSize = () => {
    setFontScale(1);
    document.documentElement.style.setProperty('--article-font-scale', '1');
    localStorage.setItem('rsmk_font_scale', '1');
  };

  const toggleBookmark = () => {
    try {
      const currentUrl = window.location.pathname;
      const slug = currentUrl.replace('/blogs/', '').replace(/\/$/, '');
      const saved = JSON.parse(localStorage.getItem('rsmk_bookmarks') || '[]');
      let updated;
      if (saved.includes(slug)) {
        updated = saved.filter((id) => id !== slug);
        setIsSaved(false);
      } else {
        updated = [...saved, slug];
        setIsSaved(true);
      }
      localStorage.setItem('rsmk_bookmarks', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('rsmk_bookmarks_updated', { detail: { bookmarks: updated } }));
    } catch (e) {
      console.error(e);
    }
  };

  // Text-To-Speech
  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    if (isSpeaking) {
      if (isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } else {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
    } else {
      window.speechSynthesis.cancel();
      const contentEl = document.querySelector('.blog-content');
      const textToRead = (articleTitle ? articleTitle + '. ' : '') + (contentEl ? contentEl.innerText.slice(0, 6000) : '');
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
      };
      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  };

  const toggleFocusMode = () => {
    const next = !isFocusMode;
    setIsFocusMode(next);
    if (next) {
      document.body.setAttribute('data-reading-mode', 'focus');
    } else {
      document.body.removeAttribute('data-reading-mode');
    }
  };

  const copyShareLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const shareToTwitter = () => {
    const text = encodeURIComponent(`Reading "${articleTitle || document.title}" on RSMK Blogs:`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'noopener,noreferrer');
  };

  const shareToLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'noopener,noreferrer');
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
          <span>⚡ Reading Dynamics</span>
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

      {/* Widget 2: Audio Companion (Listen to Article) */}
      <div className="sidebar-widget audio-companion-widget">
        <div className="widget-title">
          <span>🎧 Audio Narration</span>
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
          Listen to this technical article hands-free:
        </p>
        <div className="audio-control-bar">
          <button
            className={`audio-play-btn ${isSpeaking ? 'active' : ''}`}
            onClick={toggleSpeech}
            aria-label={isSpeaking ? (isPaused ? 'Resume narration' : 'Pause narration') : 'Play narration'}
          >
            {isSpeaking ? (
              isPaused ? (
                <>▶ Resume</>
              ) : (
                <>⏸ Pause</>
              )
            ) : (
              <>▶ Listen</>
            )}
          </button>
          {isSpeaking && (
            <button className="audio-stop-btn" onClick={stopSpeech} title="Stop Audio">
              ⏹ Stop
            </button>
          )}
          {isSpeaking && !isPaused && (
            <div className="audio-wave-anim">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
        </div>
      </div>

      {/* Widget 3: Reader Controls & Focus Mode */}
      <div className="sidebar-widget">
        <div className="widget-title">
          <span>🛠️ Reader Controls</span>
        </div>
        <div className="toolkit-btn-grid">
          <button className="toolkit-btn" onClick={() => changeFontSize(-0.05)} title="Decrease Text Size">
            A-
          </button>
          <button className="toolkit-btn" onClick={resetFontSize} title="Reset Text Size">
            100%
          </button>
          <button className="toolkit-btn" onClick={() => changeFontSize(0.05)} title="Increase Text Size">
            A+
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px' }}>
          <button
            className={`toolkit-btn ${isFocusMode ? 'active-tool' : ''}`}
            onClick={toggleFocusMode}
            title="Toggle distraction-free reading canvas"
          >
            {isFocusMode ? '✕ Normal' : '🎯 Focus'}
          </button>
          <button
            className={`toolkit-btn ${isSaved ? 'active-tool' : ''}`}
            onClick={toggleBookmark}
            title={isSaved ? 'Article is saved' : 'Save article'}
          >
            {isSaved ? '★ Saved' : '☆ Save'}
          </button>
        </div>
      </div>

      {/* Widget 4: Social & Knowledge Sharing */}
      <div className="sidebar-widget">
        <div className="widget-title">
          <span>🔗 Share Knowledge</span>
        </div>
        <div className="share-actions-row">
          <button className="share-icon-btn copy" onClick={copyShareLink} title="Copy link to clipboard">
            {copied ? '✓ Copied' : '🔗 Copy'}
          </button>
          <button className="share-icon-btn twitter" onClick={shareToTwitter} title="Share on X">
            𝕏 Post
          </button>
          <button className="share-icon-btn linkedin" onClick={shareToLinkedIn} title="Share on LinkedIn">
            in Share
          </button>
        </div>
      </div>

      {/* Widget 5: Ask Mani AI Companion */}
      <div className="sidebar-widget">
        <div className="widget-title">
          <span>🧠 Ask Mani AI</span>
        </div>
        <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
          Quick queries about this article:
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

      {/* Widget 6: Quick Reference Links */}
      <div className="sidebar-widget">
        <div className="widget-title">
          <span>📌 Knowledge Library</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <a href="/blogs" className="quick-ref-link">
            <span>Documentation Catalog</span>
            <span style={{ color: 'var(--primary-color)' }}>→</span>
          </a>
          <a href="/topics" className="quick-ref-link">
            <span>Engineering Domains</span>
            <span style={{ color: 'var(--primary-color)' }}>→</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
