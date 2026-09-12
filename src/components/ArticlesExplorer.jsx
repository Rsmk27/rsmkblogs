import React, { useState, useEffect, useMemo } from 'react';

export default function ArticlesExplorer({ articles = [] }) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'digest'
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  // Load bookmarks from localStorage on mount
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('rsmk_bookmarks') || '[]');
      if (Array.isArray(saved)) {
        setBookmarkedIds(saved);
      }
    } catch (e) {
      console.error('Failed to load bookmarks', e);
    }
  }, []);

  // Listen to bookmark changes from other tabs/components
  useEffect(() => {
    const handleBookmarkChange = (e) => {
      if (e.detail && Array.isArray(e.detail.bookmarks)) {
        setBookmarkedIds(e.detail.bookmarks);
      }
    };
    window.addEventListener('rsmk_bookmarks_updated', handleBookmarkChange);
    return () => window.removeEventListener('rsmk_bookmarks_updated', handleBookmarkChange);
  }, []);

  const toggleBookmark = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    let updated;
    if (bookmarkedIds.includes(id)) {
      updated = bookmarkedIds.filter((bId) => bId !== id);
    } else {
      updated = [...bookmarkedIds, id];
    }
    setBookmarkedIds(updated);
    try {
      localStorage.setItem('rsmk_bookmarks', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('rsmk_bookmarks_updated', { detail: { bookmarks: updated } }));
    } catch (err) {
      console.error('Failed to save bookmark', err);
    }
  };

  // Compute available categories with counts
  const categoriesWithCounts = useMemo(() => {
    const counts = { All: articles.length };
    articles.forEach((art) => {
      const cat = art.category || 'General';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [articles]);

  const categories = useMemo(() => Object.keys(categoriesWithCounts), [categoriesWithCounts]);

  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  // Filter & Sort
  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      // Bookmark filter
      if (showBookmarksOnly && !bookmarkedIds.includes(art.id)) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && art.category !== selectedCategory) {
        return false;
      }

      // Difficulty filter
      if (selectedDifficulty !== 'All' && art.difficulty !== selectedDifficulty) {
        return false;
      }

      // Search Query
      if (query.trim()) {
        const q = query.toLowerCase().trim();
        const matchTitle = art.title.toLowerCase().includes(q);
        const matchDesc = art.description?.toLowerCase().includes(q);
        const matchCat = art.category?.toLowerCase().includes(q);
        const matchTags = art.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchCat && !matchTags) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      if (sortBy === 'readingTimeAsc') {
        return (parseInt(a.readTime) || 0) - (parseInt(b.readTime) || 0);
      }
      if (sortBy === 'readingTimeDesc') {
        return (parseInt(b.readTime) || 0) - (parseInt(a.readTime) || 0);
      }
      if (sortBy === 'alphabetical') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [articles, query, selectedCategory, selectedDifficulty, sortBy, showBookmarksOnly, bookmarkedIds]);

  const resetFilters = () => {
    setQuery('');
    setSelectedCategory('All');
    setSelectedDifficulty('All');
    setSortBy('newest');
    setShowBookmarksOnly(false);
  };

  const hasActiveFilters = query.trim() !== '' || selectedCategory !== 'All' || selectedDifficulty !== 'All' || showBookmarksOnly;

  return (
    <div className="articles-explorer">
      {/* Search & Control Toolbar */}
      <div className="explorer-toolbar">
        <div className="explorer-search-wrap">
          <svg className="explorer-search-icon" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="M21 21l-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            className="explorer-search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by topic, architecture, register, microcontroller, protocol..."
            aria-label="Search articles catalog"
          />
          {query && (
            <button className="explorer-search-clear" onClick={() => setQuery('')} aria-label="Clear search">
              ✕
            </button>
          )}
        </div>

        <div className="explorer-actions-row">
          {/* Saved Articles Toggle */}
          <button
            className={`explorer-pill-btn ${showBookmarksOnly ? 'active' : ''}`}
            onClick={() => setShowBookmarksOnly((prev) => !prev)}
            title="Show your saved articles"
          >
            <span>★ Saved</span>
            <span className="pill-badge">{bookmarkedIds.length}</span>
          </button>

          {/* Difficulty Dropdown / Pills */}
          <div className="explorer-difficulty-group">
            {difficulties.map((diff) => (
              <button
                key={diff}
                className={`diff-pill-btn ${selectedDifficulty === diff ? 'active' : ''} ${diff.toLowerCase()}`}
                onClick={() => setSelectedDifficulty(diff)}
              >
                {diff === 'All' ? 'All Levels' : diff}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="explorer-select-wrap">
            <select
              className="explorer-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort articles"
            >
              <option value="newest">Latest Releases</option>
              <option value="oldest">Oldest First</option>
              <option value="readingTimeAsc">Quick Reads (&lt; 10 min)</option>
              <option value="readingTimeDesc">Deep Dives (10+ min)</option>
              <option value="alphabetical">Alphabetical (A-Z)</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="view-mode-toggle" role="group" aria-label="View mode">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
              aria-label="Grid View"
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z"/>
              </svg>
            </button>
            <button
              className={`view-btn ${viewMode === 'digest' ? 'active' : ''}`}
              onClick={() => setViewMode('digest')}
              title="Compact Digest View"
              aria-label="Compact Digest View"
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="explorer-categories-bar">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              className={`category-filter-pill ${isActive ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              <span>{cat}</span>
              <span className="cat-count">{categoriesWithCounts[cat]}</span>
            </button>
          );
        })}
      </div>

      {/* Results Header Status */}
      <div className="explorer-status-bar">
        <div className="status-count">
          Showing <strong>{filteredArticles.length}</strong> of {articles.length} articles
          {showBookmarksOnly && <span className="active-tag-chip">Filter: Bookmarked</span>}
          {selectedCategory !== 'All' && <span className="active-tag-chip">Domain: {selectedCategory}</span>}
          {selectedDifficulty !== 'All' && <span className="active-tag-chip">Level: {selectedDifficulty}</span>}
        </div>
        {hasActiveFilters && (
          <button className="reset-filters-btn" onClick={resetFilters}>
            Reset Filters ↺
          </button>
        )}
      </div>

      {/* Empty State */}
      {filteredArticles.length === 0 && (
        <div className="explorer-empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No matching engineering articles found</h3>
          <p>We couldn't find any documentation matching your current filters or search term "{query}".</p>
          <button className="btn btn-primary btn-sm" onClick={resetFilters}>
            Clear Filters & View All
          </button>
        </div>
      )}

      {/* Articles Grid View */}
      {filteredArticles.length > 0 && viewMode === 'grid' && (
        <div className="articles-grid-modern">
          {filteredArticles.map((article) => {
            const isBookmarked = bookmarkedIds.includes(article.id);
            const difficultyClass = `badge-${(article.difficulty || 'intermediate').toLowerCase()}`;

            return (
              <article key={article.id} className="knowledge-card">
                <div className="card-top-meta">
                  <span className={`difficulty-badge ${difficultyClass}`}>
                    <span className="difficulty-dot"></span>
                    {article.difficulty || 'Intermediate'}
                  </span>
                  <span className="category-tag">{article.category}</span>
                  <button
                    className={`bookmark-btn ${isBookmarked ? 'saved' : ''}`}
                    onClick={(e) => toggleBookmark(article.id, e)}
                    title={isBookmarked ? 'Remove bookmark' : 'Save for later'}
                    aria-label={isBookmarked ? 'Remove bookmark' : 'Save for later'}
                  >
                    ★
                  </button>
                </div>

                <h3 className="card-title">
                  <a href={`/blogs/${article.id}`}>{article.title}</a>
                </h3>

                <p className="card-description">{article.description}</p>

                {article.tags && article.tags.length > 0 && (
                  <div className="card-tags-list">
                    {article.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="card-tag-pill">
                        #{tag}
                      </span>
                    ))}
                    {article.tags.length > 3 && (
                      <span className="card-tag-more">+{article.tags.length - 3}</span>
                    )}
                  </div>
                )}

                <div className="card-footer">
                  <div className="footer-meta-item">
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>{article.readTime || '10 min'}</span>
                  </div>
                  <div className="footer-meta-item">
                    <span>{article.date}</span>
                  </div>
                  <a href={`/blogs/${article.id}`} className="card-read-link" aria-label={`Read ${article.title}`}>
                    <span>Read Guide</span>
                    <span className="read-arrow">→</span>
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Articles Digest / List View */}
      {filteredArticles.length > 0 && viewMode === 'digest' && (
        <div className="articles-digest-list">
          {filteredArticles.map((article) => {
            const isBookmarked = bookmarkedIds.includes(article.id);
            const difficultyClass = `badge-${(article.difficulty || 'intermediate').toLowerCase()}`;

            return (
              <div key={article.id} className="digest-item">
                <div className="digest-left">
                  <button
                    className={`bookmark-btn-digest ${isBookmarked ? 'saved' : ''}`}
                    onClick={(e) => toggleBookmark(article.id, e)}
                    title={isBookmarked ? 'Saved' : 'Save article'}
                    aria-label="Save article"
                  >
                    ★
                  </button>
                  <div className="digest-main">
                    <div className="digest-badges">
                      <span className={`difficulty-badge ${difficultyClass}`}>
                        <span className="difficulty-dot"></span>
                        {article.difficulty || 'Intermediate'}
                      </span>
                      <span className="category-tag">{article.category}</span>
                    </div>
                    <h4 className="digest-title">
                      <a href={`/blogs/${article.id}`}>{article.title}</a>
                    </h4>
                    <p className="digest-desc">{article.description}</p>
                  </div>
                </div>

                <div className="digest-right">
                  <div className="digest-meta">
                    <span className="digest-readtime">⏱ {article.readTime}</span>
                    <span className="digest-date">{article.date}</span>
                  </div>
                  <a href={`/blogs/${article.id}`} className="btn btn-outline btn-sm digest-read-btn">
                    Open →
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
