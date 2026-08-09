import React, { useState, useEffect } from 'react';

export default function GlobalSearchModal({ searchIndex = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filtered = query.trim()
    ? searchIndex.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase()) ||
          (item.tags && item.tags.some((t) => t.toLowerCase().includes(query.toLowerCase())))
      )
    : [];

  return (
    <>
      <button className="search-trigger-btn" onClick={() => setIsOpen(true)} aria-label="Open Global Search">
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="M21 21l-4.35-4.35"></path>
        </svg>
        <span>Search documentation...</span>
        <kbd>Ctrl K</kbd>
      </button>

      {isOpen && (
        <div className="search-modal-backdrop active" onClick={() => setIsOpen(false)}>
          <div className="search-modal" onClick={(e) => e.stopPropagation()} role="dialog">
            <div className="search-input-header">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="M21 21l-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search documentation, technologies, roadmaps..."
                autoFocus
              />
              <kbd style={{ fontSize: '0.75rem', background: 'var(--card-bg)', border: '1px solid var(--border-color)', padding: '2px 6px', borderRadius: '4px' }}>
                ESC
              </kbd>
            </div>

            <div className="search-results-list">
              {!query.trim() ? (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-subtle)', fontSize: '0.9rem' }}>
                  Type any keyword to search engineering knowledge base...
                </div>
              ) : filtered.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-subtle)', fontSize: '0.9rem' }}>
                  No documentation matching "{query}"
                </div>
              ) : (
                filtered.map((item, idx) => (
                  <a key={idx} href={item.url} className={`search-result-item ${idx === 0 ? 'selected' : ''}`}>
                    <div className="search-result-title">
                      <span>{item.title}</span>
                      <span className="badge" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', color: 'var(--primary-color)', fontSize: '0.7rem' }}>
                        {item.type}
                      </span>
                    </div>
                    <div className="search-result-meta">
                      {item.category} {item.tags ? '• ' + item.tags.slice(0, 3).join(', ') : ''}
                    </div>
                  </a>
                ))
              )}
            </div>

            <div className="search-modal-footer">
              <span><kbd>↑</kbd> <kbd>↓</kbd> Navigate</span>
              <span><kbd>↵</kbd> Select</span>
              <span><kbd>ESC</kbd> Close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
