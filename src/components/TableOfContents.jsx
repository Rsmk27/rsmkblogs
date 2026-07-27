import React, { useEffect, useState } from 'react';

export default function TableOfContents({ headings = [] }) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -66% 0px' }
    );

    const headingEls = document.querySelectorAll('article h2, article h3');
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
    }
  };

  if (!headings || headings.length === 0) return null;

  return (
    <div className="toc-sidebar">
      <div className="toc-title">
        <span>Table of Contents</span>
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M4 6h16M4 12h16M4 18h7"></path>
        </svg>
      </div>
      <nav className="toc-list">
        {headings.map((h, idx) => {
          const id = h.slug || `heading-${idx}`;
          const isH3 = h.depth === 3;
          const isActive = activeId === id;
          return (
            <a
              key={id}
              href={`#${id}`}
              onClick={(e) => handleClick(e, id)}
              className={`toc-link ${isH3 ? 'indent' : ''} ${isActive ? 'active' : ''}`}
            >
              {h.text}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
