import 'global-jsdom/register'; // Need this first!
import { test, describe, beforeEach, afterEach, mock } from 'node:test';
import assert from 'node:assert';
import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import ManiAIChatbot from './ManiAIChatbot.jsx';

// Mock scrollIntoView since jsdom doesn't support it
window.HTMLElement.prototype.scrollIntoView = () => {};

describe('ManiAIChatbot', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    global.fetch = mock.fn();
  });

  afterEach(() => {
    mock.restoreAll();
    cleanup();
  });

  test('renders success response correctly', async () => {
    // Make fetch return a success response
    const mockResponse = {
      success: true,
      response: 'This is a test response from Mani Core.'
    };

    global.fetch.mock.mockImplementationOnce(() => Promise.resolve({
      json: () => Promise.resolve(mockResponse)
    }));

    render(<ManiAIChatbot />);

    // Open chatbot
    const triggerBtn = screen.getByLabelText('Open Mani AI Assistant');
    fireEvent.click(triggerBtn);

    // Type query
    const input = screen.getByPlaceholderText('Ask Mani AI anything...');
    fireEvent.change(input, { target: { value: 'Hello' } });

    // Send query
    const sendBtn = input.nextElementSibling;
    fireEvent.click(sendBtn);

    // Assert fetch was called
    assert.strictEqual(global.fetch.mock.calls.length, 1);

    // Assert the response message appears
    await waitFor(() => {
      const msg = screen.getByText('This is a test response from Mani Core.');
      assert.ok(msg);
    });
  });

  test('renders error message when fetch returns unsuccessful response', async () => {
    // Make fetch return an unsuccessful response
    const mockResponse = {
      success: false
    };

    global.fetch.mock.mockImplementationOnce(() => Promise.resolve({
      json: () => Promise.resolve(mockResponse)
    }));

    render(<ManiAIChatbot />);

    // Open chatbot
    const triggerBtn = screen.getByLabelText('Open Mani AI Assistant');
    fireEvent.click(triggerBtn);

    // Type query
    const input = screen.getByPlaceholderText('Ask Mani AI anything...');
    fireEvent.change(input, { target: { value: 'Hello' } });

    // Send query
    const sendBtn = input.nextElementSibling;
    fireEvent.click(sendBtn);

    // Assert fetch was called
    assert.strictEqual(global.fetch.mock.calls.length, 1);

    // Assert the error message appears
    await waitFor(() => {
      const msg = screen.getByText('Sorry, I encountered an issue fetching a response.');
      assert.ok(msg);
    });
  });

  test('renders error message when fetch throws an error (catch block)', async () => {
    // Make fetch throw an error
    global.fetch.mock.mockImplementationOnce(() => Promise.reject(new Error('Network error')));

    render(<ManiAIChatbot />);

    // Open chatbot
    const triggerBtn = screen.getByLabelText('Open Mani AI Assistant');
    fireEvent.click(triggerBtn);

    // Type query
    const input = screen.getByPlaceholderText('Ask Mani AI anything...');
    fireEvent.change(input, { target: { value: 'Hello' } });

    // Send query
    const sendBtn = input.nextElementSibling;
    fireEvent.click(sendBtn);

    // Assert fetch was called
    assert.strictEqual(global.fetch.mock.calls.length, 1);

    // Assert the error message appears
    await waitFor(() => {
      const errorMsg = screen.getByText('Mani Core service is spinning up. Please try again in a few seconds.');
      assert.ok(errorMsg);
    });
  });
});
