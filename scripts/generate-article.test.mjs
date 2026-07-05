import test from "node:test";
import assert from "node:assert";
import { extractGroqText } from "./generate-article.mjs";

test("extractGroqText - success case", () => {
  const mockResponse = {
    choices: [
      {
        message: {
          content: "This is the generated article content."
        }
      }
    ]
  };
  const result = extractGroqText(mockResponse);
  assert.strictEqual(result, "This is the generated article content.");
});

test("extractGroqText - trims whitespace", () => {
  const mockResponse = {
    choices: [
      {
        message: {
          content: "   \n\n  Content with whitespace  \n  "
        }
      }
    ]
  };
  const result = extractGroqText(mockResponse);
  assert.strictEqual(result, "Content with whitespace");
});

test("extractGroqText - missing choices array", () => {
  const mockResponse = {};
  assert.throws(() => {
    extractGroqText(mockResponse);
  }, /Groq API response did not include message content./);
});

test("extractGroqText - empty choices array", () => {
  const mockResponse = { choices: [] };
  assert.throws(() => {
    extractGroqText(mockResponse);
  }, /Groq API response did not include message content./);
});

test("extractGroqText - missing message", () => {
  const mockResponse = { choices: [{}] };
  assert.throws(() => {
    extractGroqText(mockResponse);
  }, /Groq API response did not include message content./);
});

test("extractGroqText - missing content", () => {
  const mockResponse = { choices: [{ message: {} }] };
  assert.throws(() => {
    extractGroqText(mockResponse);
  }, /Groq API response did not include message content./);
});

test("extractGroqText - content is not a string", () => {
  const mockResponse = { choices: [{ message: { content: null } }] };
  assert.throws(() => {
    extractGroqText(mockResponse);
  }, /Groq API response did not include message content./);

  const mockResponse2 = { choices: [{ message: { content: 123 } }] };
  assert.throws(() => {
    extractGroqText(mockResponse2);
  }, /Groq API response did not include message content./);
});
