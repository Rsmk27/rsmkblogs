import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import TableOfContents from './TableOfContents';

describe('TableOfContents', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when no headings are provided', () => {
    const { container } = render(<TableOfContents />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when headings array is empty', () => {
    const { container } = render(<TableOfContents headings={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders table of contents with given headings', () => {
    const headings = [
      { text: 'Heading 1', slug: 'heading-1', depth: 2 },
      { text: 'Heading 2', slug: 'heading-2', depth: 3 },
    ];
    render(<TableOfContents headings={headings} />);

    expect(screen.getByText('Table of Contents')).toBeInTheDocument();
    expect(screen.getByText('Heading 1')).toBeInTheDocument();
    expect(screen.getByText('Heading 2')).toBeInTheDocument();

    // Check if indent class is applied for h3
    const h2Link = screen.getByText('Heading 1');
    const h3Link = screen.getByText('Heading 2');

    expect(h2Link.className).not.toContain('indent');
    expect(h3Link.className).toContain('indent');
  });

  it('handles click events and scrolls to target', () => {
    const headings = [
      { text: 'Heading 1', slug: 'heading-1', depth: 2 },
    ];

    // Mock getElementById to return a dummy element
    const dummyElement = document.createElement('div');
    dummyElement.getBoundingClientRect = () => ({ top: 100 });
    const getElementByIdSpy = vi.spyOn(document, 'getElementById').mockReturnValue(dummyElement);

    render(<TableOfContents headings={headings} />);

    const link = screen.getByText('Heading 1');
    fireEvent.click(link);

    expect(getElementByIdSpy).toHaveBeenCalledWith('heading-1');
    expect(window.scrollTo).toHaveBeenCalled();
    expect(history.pushState).toHaveBeenCalledWith(null, null, '#heading-1');

    getElementByIdSpy.mockRestore();
  });

  it('sets active class based on intersection observer', () => {
    // Setup observer callback capture
    let observerCallback;
    class MockObserver {
      constructor(callback) {
        observerCallback = callback;
      }
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    }
    window.IntersectionObserver = MockObserver;

    const headings = [
      { text: 'Heading 1', slug: 'heading-1', depth: 2 },
      { text: 'Heading 2', slug: 'heading-2', depth: 2 },
    ];

    render(<TableOfContents headings={headings} />);

    // Simulate intersection observer firing
    if (observerCallback) {
      act(() => {
        observerCallback([
          { isIntersecting: true, target: { id: 'heading-2' } }
        ]);
      });
    }

    const h1Link = screen.getByText('Heading 1');
    const h2Link = screen.getByText('Heading 2');

    expect(h1Link.className).not.toContain('active');
    expect(h2Link.className).toContain('active');
  });
});
