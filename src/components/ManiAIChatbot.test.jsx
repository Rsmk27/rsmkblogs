import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ManiAIChatbot from './ManiAIChatbot.jsx';
import React from 'react';

const originalFetch = global.fetch;

describe('ManiAIChatbot Error Handling', () => {
  beforeEach(() => {
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('should display error message when fetch fails with an exception', async () => {
    const errorMsg = 'Mani Core service is spinning up. Please try again in a few seconds.';

    global.fetch = vi.fn(() => Promise.reject(new Error('Network error')));

    render(<ManiAIChatbot />);

    // Open chatbot
    const triggerBtn = screen.getByLabelText('Open Mani AI Assistant');
    fireEvent.click(triggerBtn);

    // Type and send message
    const input = screen.getByPlaceholderText('Ask Mani AI anything...');
    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    // Wait for error message to appear in the DOM
    await waitFor(() => {
      const msgs = document.querySelectorAll('.mani-msg-ai');
      const lastMsg = msgs[msgs.length - 1];
      expect(lastMsg?.textContent).toContain(errorMsg);
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
