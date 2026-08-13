import 'global-jsdom/register';
import test, { describe, mock, afterEach, before } from 'node:test';
import assert from 'node:assert';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ManiAIChatbot from './ManiAIChatbot.jsx';
import React from 'react';

const originalFetch = global.fetch;

describe('ManiAIChatbot Error Handling', () => {
  before(() => {
    // Mock scrollIntoView which isn't implemented in JSDOM
    window.HTMLElement.prototype.scrollIntoView = mock.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  test('should display error message when fetch fails with an exception', async () => {
    const errorMsg = 'Mani Core service is spinning up. Please try again in a few seconds.';

    // Mock fetch to throw an error simulating a network failure or similar exception
    global.fetch = mock.fn(() => Promise.reject(new Error('Network error')));

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
        assert.ok(lastMsg.textContent.includes(errorMsg), "Exception fallback error message should be rendered");
    });

    assert.strictEqual(global.fetch.mock.calls.length, 1);
  });
});
