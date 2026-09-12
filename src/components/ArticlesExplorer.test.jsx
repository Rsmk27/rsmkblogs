import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import ArticlesExplorer from './ArticlesExplorer';

const mockArticles = [
  {
    id: 'matlab-guide',
    title: 'Mastering MATLAB: Numerical Computing',
    description: 'Complete guide to numerical algorithms and signal processing.',
    date: '2026-03-01',
    author: 'RSMK Team',
    category: 'Engineering Software',
    readTime: '15 min read',
    difficulty: 'Advanced',
    tags: ['MATLAB', 'Simulink', 'Signals']
  },
  {
    id: 'arduino-nano',
    title: 'Arduino Nano Microcontroller Engineering',
    description: 'Hardware teardown and register programming on ATmega328P.',
    date: '2026-02-15',
    author: 'RSMK Team',
    category: 'Embedded Systems',
    readTime: '8 min read',
    difficulty: 'Beginner',
    tags: ['Arduino', 'AVR', 'Hardware']
  },
  {
    id: 'tcp-ip',
    title: 'TCP/IP Protocol Suite Architecture',
    description: 'Encapsulation, handshakes, and packet routing across networks.',
    date: '2026-03-10',
    author: 'RSMK Team',
    category: 'Networking',
    readTime: '12 min read',
    difficulty: 'Intermediate',
    tags: ['Networking', 'TCP/IP', 'Ethernet']
  }
];

describe('ArticlesExplorer', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders all articles initially in grid mode', () => {
    render(<ArticlesExplorer articles={mockArticles} />);
    expect(screen.getByText('Mastering MATLAB: Numerical Computing')).toBeInTheDocument();
    expect(screen.getByText('Arduino Nano Microcontroller Engineering')).toBeInTheDocument();
    expect(screen.getByText('TCP/IP Protocol Suite Architecture')).toBeInTheDocument();
    expect(screen.getByText(/Showing/)).toHaveTextContent('Showing 3 of 3 articles');
  });

  it('filters articles by search query', () => {
    render(<ArticlesExplorer articles={mockArticles} />);
    const searchInput = screen.getByPlaceholderText(/Search by topic/i);

    fireEvent.change(searchInput, { target: { value: 'Arduino' } });

    expect(screen.getByText('Arduino Nano Microcontroller Engineering')).toBeInTheDocument();
    expect(screen.queryByText('Mastering MATLAB: Numerical Computing')).not.toBeInTheDocument();
    expect(screen.queryByText('TCP/IP Protocol Suite Architecture')).not.toBeInTheDocument();
  });

  it('filters articles by category pill', () => {
    render(<ArticlesExplorer articles={mockArticles} />);
    const networkingPill = screen.getByRole('button', { name: /Networking/i });

    fireEvent.click(networkingPill);

    expect(screen.getByText('TCP/IP Protocol Suite Architecture')).toBeInTheDocument();
    expect(screen.queryByText('Mastering MATLAB: Numerical Computing')).not.toBeInTheDocument();
    expect(screen.queryByText('Arduino Nano Microcontroller Engineering')).not.toBeInTheDocument();
  });

  it('filters articles by difficulty', () => {
    render(<ArticlesExplorer articles={mockArticles} />);
    const beginnerBtn = screen.getByRole('button', { name: 'Beginner' });

    fireEvent.click(beginnerBtn);

    expect(screen.getByText('Arduino Nano Microcontroller Engineering')).toBeInTheDocument();
    expect(screen.queryByText('Mastering MATLAB: Numerical Computing')).not.toBeInTheDocument();
    expect(screen.queryByText('TCP/IP Protocol Suite Architecture')).not.toBeInTheDocument();
  });

  it('toggles bookmark on an article and filters by saved', () => {
    render(<ArticlesExplorer articles={mockArticles} />);
    const bookmarkButtons = screen.getAllByRole('button', { name: /Save for later/i });

    // Bookmark the first article
    fireEvent.click(bookmarkButtons[0]);

    // Click on saved tab
    const savedBtn = screen.getByRole('button', { name: /★ Saved/i });
    fireEvent.click(savedBtn);

    expect(screen.getByText('TCP/IP Protocol Suite Architecture')).toBeInTheDocument();
    expect(screen.queryByText('Arduino Nano Microcontroller Engineering')).not.toBeInTheDocument();
  });

  it('switches to digest view mode', () => {
    render(<ArticlesExplorer articles={mockArticles} />);
    const digestViewBtn = screen.getByRole('button', { name: 'Compact Digest View' });

    fireEvent.click(digestViewBtn);

    expect(screen.getByText('⏱ 15 min read')).toBeInTheDocument();
    expect(screen.getAllByText(/Open →/i)).toHaveLength(3);
  });
});
