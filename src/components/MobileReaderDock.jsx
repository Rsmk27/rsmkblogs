import React, { useState, useEffect } from 'react';

export default function MobileReaderDock({ headings = [], articleTitle = '' }) {
  const [percent, setPercent] = useState(0);
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);
  const [fontSize, setFontSize] = useState(1);

  // Track reading scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const ratio = Math.min(1, Math.max(0, window.scrollY / totalHeight));
        setPercent(Math.round(ratio * 100));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initialize bookmark and focus mode state
  useEffect(() => {
    try {
      const currentUrl = window.location.pathname;
      const saved = JSON.parse(localStorage.getItem('rsmk_bookmarks') || '[]');
      if (Array.isArray(saved) && saved.some((id) => currentUrl.includes(id))) {
        setIsSaved(true);
      }
      const scale = parseFloat(localStorage.getItem('rsmk_font_scale') || '1');
      setFontSize(scale);
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Audio Speech Synthesis
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
      const textToRead = (articleTitle ? articleTitle + '. ' : '') + (contentEl ? contentEl.innerText.slice(0, 5000) : '');
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

  const stopSpeech = (e) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  };

  const toggleFocus = () => {
    const next = !isFocusMode;
    setIsFocusMode(next);
    if (next) {
      document.body.setAttribute('data-reading-mode', 'focus');
    } else {
      document.body.removeAttribute('data-reading-mode');
    }
  };

  const adjustFontSize = (delta) => {
    let next = Math.round((fontSize + delta) * 100) / 100;
    if (next >= 0.85 && next <= 1.35) {
      setFontSize(next);
      document.documentElement.style.setProperty('--article-font-scale', next.toString());
      localStorage.setItem('rsmk_font_scale', next.toString());
    }
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: articleTitle || document.title,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setCopiedToast(true);
        setTimeout(() => setCopiedToast(false), 2000);
      });
    }
  };

  const scrollToHeading = (id) => {
    setIsTocOpen(false);
    const target = document.getElementById(id);
    if (target) {
      const yOffset = -80;
      const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      history.pushState(null, null, `#${id}`);
    }
  };

  return (
    <>
      {/* Toast alert */}
      {copiedToast && (
        <div className="mobile-toast-pill">
          ✓ Link copied to clipboard!
        </div>
      )}

      {/* Floating Bottom Dock (Visible on mobile/tablet) */}
      <div className="mobile-reader-dock" role="toolbar" aria-label="Reading tools">
        {/* Reading Progress Mini Bar */}
        <div className="mobile-dock-progress" style={{ width: `${percent}%` }}></div>

        <div className="mobile-dock-content">
          {/* TOC Trigger */}
          <button
            className={`dock-btn ${isTocOpen ? 'active' : ''}`}
            onClick={() => setIsTocOpen((prev) => !prev)}
            aria-label="Table of Contents"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M4 6h16M4 12h16M4 18h9"></path>
            </svg>
            <span>Outline</span>
          </button>

          {/* Audio TTS Player */}
          <button
            className={`dock-btn ${isSpeaking ? 'active pulse' : ''}`}
            onClick={toggleSpeech}
            aria-label="Listen to article"
          >
            {isSpeaking ? (
              isPaused ? (
                <>
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                  <span>Resume</span>
                </>
              ) : (
                <>
                  <span className="mini-audio-wave">
                    <span></span><span></span><span></span>
                  </span>
                  <span>Playing</span>
                </>
              )
            ) : (
              <>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                </svg>
                <span>Listen</span>
              </>
            )}
          </button>
          {isSpeaking && (
            <button className="dock-sub-btn" onClick={stopSpeech} title="Stop Audio">
              ⏹
            </button>
          )}

          {/* Font Sizing */}
          <div className="dock-font-group">
            <button className="dock-font-btn" onClick={() => adjustFontSize(-0.05)} title="Smaller text">
              A-
            </button>
            <button className="dock-font-btn" onClick={() => adjustFontSize(0.05)} title="Larger text">
              A+
            </button>
          </div>

          {/* Focus Mode */}
          <button
            className={`dock-btn ${isFocusMode ? 'active' : ''}`}
            onClick={toggleFocus}
            title={isFocusMode ? 'Exit focus mode' : 'Distraction-free focus mode'}
            aria-label="Focus mode"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"></path>
            </svg>
            <span>{isFocusMode ? 'Normal' : 'Focus'}</span>
          </button>

          {/* Bookmark */}
          <button
            className={`dock-btn ${isSaved ? 'active saved' : ''}`}
            onClick={toggleBookmark}
            title={isSaved ? 'Bookmarked' : 'Bookmark article'}
            aria-label="Bookmark"
          >
            <span style={{ fontSize: '1.1rem' }}>{isSaved ? '★' : '☆'}</span>
          </button>

          {/* Share */}
          <button className="dock-btn" onClick={handleShare} title="Share article" aria-label="Share">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
          </button>

          {/* Progress Percent Badge */}
          <div className="dock-percent-pill">
            {percent}%
          </div>
        </div>
      </div>

      {/* Slide-up Table of Contents Bottom Sheet for Mobile */}
      {isTocOpen && (
        <div className="mobile-toc-sheet-backdrop" onClick={() => setIsTocOpen(false)}>
          <div className="mobile-toc-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-header">
              <div className="sheet-handle"></div>
              <div className="sheet-title-row">
                <span className="sheet-title">Table of Contents</span>
                <button className="sheet-close-btn" onClick={() => setIsTocOpen(false)}>
                  ✕
                </button>
              </div>
            </div>
            <div className="sheet-body">
              {headings && headings.length > 0 ? (
                headings.map((h, idx) => {
                  const id = h.slug || `heading-${idx}`;
                  const isSub = h.depth >= 3;
                  return (
                    <button
                      key={id}
                      className={`sheet-toc-item ${isSub ? 'sheet-toc-sub' : ''}`}
                      onClick={() => scrollToHeading(id)}
                    >
                      <span className="sheet-toc-bullet">•</span>
                      <span className="sheet-toc-text">{h.text}</span>
                    </button>
                  );
                })
              ) : (
                <div style={{ padding: '20px', color: 'var(--text-muted)', textAlign: 'center' }}>
                  No sections found in this guide.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
