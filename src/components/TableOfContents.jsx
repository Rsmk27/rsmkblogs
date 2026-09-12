import React, { useEffect, useState, useMemo } from 'react';

export default function TableOfContents({ headings = [] }) {
  const [activeId, setActiveId] = useState('');
  const [filterQuery, setFilterQuery] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -60% 0px' }
    );

    const headingEls = document.querySelectorAll('article h2, article h3, article h4');
    headingEls.forEach((el) => observer.observe(el));

    return () => {
      headingEls.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const handleClick = (e, id) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      const yOffset = -90;
      const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      history.pushState(null, null, `#${id}`);
      setActiveId(id);
    }
  };

  const filteredHeadings = useMemo(() => {
    if (!filterQuery.trim()) return headings;
    const q = filterQuery.toLowerCase();
    return headings.filter((h) => h.text.toLowerCase().includes(q));
  }, [headings, filterQuery]);

  if (!headings || headings.length === 0) return null;

  return (
    <div className="toc-sidebar">
      <div className="toc-header-row">
        <div className="toc-title">
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M4 6h16M4 12h16M4 18h7"></path>
          </svg>
          <span>Table of Contents</span>
        </div>
        <span className="toc-count-badge">{headings.length} sections</span>
      </div>

      {headings.length > 5 && (
        <div className="toc-quick-filter">
          <input
            type="text"
            className="toc-filter-input"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Quick filter outline..."
            aria-label="Filter table of contents"
          />
          {filterQuery && (
            <button className="toc-filter-clear" onClick={() => setFilterQuery('')}>
              ✕
            </button>
          )}
        </div>
      )}

      <nav className="toc-list" aria-label="Table of Contents Navigation">
        {filteredHeadings.map((h, idx) => {
          const id = h.slug || `heading-${idx}`;
          const isH3 = h.depth === 3;
          const isH4 = h.depth >= 4;
          const isActive = activeId === id;

          let depthClass = '';
          if (isH4) depthClass = 'indent-2';
          else if (isH3) depthClass = 'indent';

          return (
            <a
              key={id}
              href={`#${id}`}
              onClick={(e) => handleClick(e, id)}
              className={`toc-link ${depthClass} ${isActive ? 'active' : ''}`}
              title={h.text}
            >
              <span className="toc-dot"></span>
              {h.text}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
