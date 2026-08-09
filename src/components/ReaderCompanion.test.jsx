import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import ReaderCompanion from './ReaderCompanion';
import React from 'react';

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockImplementation(() => Promise.resolve()),
  },
});

describe('ReaderCompanion', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    // Setup initial DOM state for scroll testing
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      writable: true,
      value: 1000,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      value: 500,
    });
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 0,
    });
  });

  it('renders initial state correctly', () => {
    render(<ReaderCompanion initialMinutes={12} />);
    expect(screen.getByText('12 min left')).toBeDefined();
    expect(screen.getByText('0% completed')).toBeDefined();
  });

  it('updates reading progress on scroll', () => {
    render(<ReaderCompanion initialMinutes={12} />);

    // Simulate scroll to 50%
    window.scrollY = 250;
    fireEvent.scroll(window);

    expect(screen.getByText('50% completed')).toBeDefined();
    expect(screen.getByText('6 min left')).toBeDefined();
  });

  it('handles font size increase', () => {
    render(<ReaderCompanion />);

    const increaseBtn = screen.getByTitle('Increase Text Size');
    fireEvent.click(increaseBtn);

    expect(localStorage.getItem('rsmk_font_scale')).toBe('1.05');
  });

  it('handles font size decrease', () => {
    render(<ReaderCompanion />);

    const decreaseBtn = screen.getByTitle('Decrease Text Size');
    fireEvent.click(decreaseBtn);

    expect(localStorage.getItem('rsmk_font_scale')).toBe('0.95');
  });

  it('limits font size between 0.85 and 1.3', () => {
    render(<ReaderCompanion />);
    const increaseBtn = screen.getByTitle('Increase Text Size');
    const decreaseBtn = screen.getByTitle('Decrease Text Size');

    // Try to go above 1.3
    for (let i = 0; i < 10; i++) {
      fireEvent.click(increaseBtn);
    }
    // Should be capped around 1.3
    let scale = parseFloat(localStorage.getItem('rsmk_font_scale'));
    expect(scale).toBeLessThanOrEqual(1.3);

    // Reset and try to go below 0.85
    localStorage.setItem('rsmk_font_scale', '1');
    for (let i = 0; i < 10; i++) {
      fireEvent.click(decreaseBtn);
    }
    scale = parseFloat(localStorage.getItem('rsmk_font_scale'));
    expect(scale).toBeGreaterThanOrEqual(0.85);
  });

  it('handles share link copying', async () => {
    render(<ReaderCompanion />);

    const shareBtn = screen.getByTitle('Copy Share Link');
    expect(shareBtn.textContent).toBe('🔗 Share');

    await act(async () => {
      fireEvent.click(shareBtn);
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(window.location.href);

    await waitFor(() => {
      expect(screen.getByText('✓ Copied')).toBeDefined();
    });
  });

  it('calls askManiPrompt when AI chips are clicked', () => {
    window.askManiPrompt = vi.fn();
    render(<ReaderCompanion />);

    const summarizeBtn = screen.getByText('💡 Summarize takeaways');
    fireEvent.click(summarizeBtn);

    expect(window.askManiPrompt).toHaveBeenCalledWith('Summarize key takeaways of this article');
  });
});
