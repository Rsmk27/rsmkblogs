import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GlobalSearchModal from '../GlobalSearchModal.jsx';

describe('GlobalSearchModal Search Filtering', () => {
  beforeEach(() => {
    // Render the component before each test
    render(<GlobalSearchModal />);

    // Open the modal by clicking the trigger button
    const triggerBtn = screen.getByRole('button', { name: /Open Global Search/i });
    fireEvent.click(triggerBtn);
  });

  it('shows empty state message when query is empty', () => {
    const emptyStateMessage = screen.getByText(/Type any keyword to search engineering knowledge base\.\.\./i);
    expect(emptyStateMessage).toBeDefined();
  });

  it('filters results by title', () => {
    const searchInput = screen.getByPlaceholderText(/Search documentation/i);

    // Search for "PLC" which is in the title of the PLC guide
    fireEvent.change(searchInput, { target: { value: 'Industrial PLC' } });

    expect(screen.getByText('Industrial PLC Systems & Ladder Logic Architecture')).toBeDefined();
    // Should not show other unrelated articles
    expect(screen.queryByText('Complete Arduino Hardware & Software Guide')).toBeNull();
  });

  it('filters results by category', () => {
    const searchInput = screen.getByPlaceholderText(/Search documentation/i);

    // Search for category "Embedded Systems"
    fireEvent.change(searchInput, { target: { value: 'Embedded Systems' } });

    expect(screen.getByText('Complete Arduino Hardware & Software Guide')).toBeDefined();
    expect(screen.getByText('Arduino Nano Architecture & Industrial Controls')).toBeDefined();
    expect(screen.getByText('Arduino UNO R4 Hardware Deep-Dive')).toBeDefined();
  });

  it('filters results by tags', () => {
    const searchInput = screen.getByPlaceholderText(/Search documentation/i);

    // Search for a specific tag
    fireEvent.change(searchInput, { target: { value: 'ATmega2560' } });

    expect(screen.getByText('Arduino MEGA 2560 in Industrial Engineering')).toBeDefined();
  });

  it('shows no results message when query does not match anything', () => {
    const searchInput = screen.getByPlaceholderText(/Search documentation/i);
    const nonExistentQuery = 'xyznonexistent123';

    fireEvent.change(searchInput, { target: { value: nonExistentQuery } });

    const noResultsMessage = screen.getByText(new RegExp(`No documentation matching "${nonExistentQuery}"`, 'i'));
    expect(noResultsMessage).toBeDefined();
  });

  it('performs case-insensitive search', () => {
    const searchInput = screen.getByPlaceholderText(/Search documentation/i);

    fireEvent.change(searchInput, { target: { value: 'matlab' } });

    expect(screen.getByText('Mastering MATLAB: Numerical Computing & Simulink')).toBeDefined();
  });
});

describe('GlobalSearchModal Interactions', () => {
  it('opens and closes modal with trigger button and backdrop click', () => {
    render(<GlobalSearchModal />);

    // Check it's initially closed
    expect(screen.queryByPlaceholderText(/Search documentation/i)).toBeNull();

    // Open modal
    const triggerBtn = screen.getByRole('button', { name: /Open Global Search/i });
    fireEvent.click(triggerBtn);

    // Should be open
    expect(screen.getByPlaceholderText(/Search documentation/i)).toBeDefined();

    // Close modal via backdrop click
    const backdrop = document.querySelector('.search-modal-backdrop');
    fireEvent.click(backdrop);

    // Should be closed
    expect(screen.queryByPlaceholderText(/Search documentation/i)).toBeNull();
  });

  it('stops propagation when clicking inside modal content', () => {
    render(<GlobalSearchModal />);

    const triggerBtn = screen.getByRole('button', { name: /Open Global Search/i });
    fireEvent.click(triggerBtn);

    // Click inside the modal content
    const modalContent = screen.getByRole('dialog');
    fireEvent.click(modalContent);

    // Should still be open
    expect(screen.getByPlaceholderText(/Search documentation/i)).toBeDefined();
  });

  it('toggles modal with Ctrl+K shortcut', () => {
    render(<GlobalSearchModal />);

    expect(screen.queryByPlaceholderText(/Search documentation/i)).toBeNull();

    // Simulate Ctrl+K to open
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });

    expect(screen.getByPlaceholderText(/Search documentation/i)).toBeDefined();

    // Simulate Ctrl+K to close
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });

    expect(screen.queryByPlaceholderText(/Search documentation/i)).toBeNull();
  });

  it('toggles modal with Meta+K shortcut (Mac)', () => {
    render(<GlobalSearchModal />);

    // Simulate Meta+K to open
    fireEvent.keyDown(window, { key: 'k', metaKey: true });

    expect(screen.getByPlaceholderText(/Search documentation/i)).toBeDefined();
  });

  it('closes modal with Escape key', () => {
    render(<GlobalSearchModal />);

    // Open first
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    expect(screen.getByPlaceholderText(/Search documentation/i)).toBeDefined();

    // Close with Escape
    fireEvent.keyDown(window, { key: 'Escape' });

    expect(screen.queryByPlaceholderText(/Search documentation/i)).toBeNull();
  });
});
