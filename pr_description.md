🎯 **What:** The testing gap addressed
Tests have been added for the `GlobalSearchModal` React component focusing on the search filtering logic. The component filters a static array (`SEARCH_INDEX`) synchronously but lacked coverage to verify if it correctly maps properties and handles edge cases like empty queries or queries that yield no matches. Also covered modal open/close interactions via button clicks, backdrop clicks, and keyboard shortcuts (`Ctrl+K`, `Cmd+K`, `Escape`).

📊 **Coverage:** What scenarios are now tested
- Empty state: Shows initial prompt when the query is empty.
- Filtering by title: Verifies query string matched against title strings.
- Filtering by category: Verifies query string matched against category strings.
- Filtering by tags: Verifies query string matched against array of tags.
- No results: Shows correct placeholder text when no items match.
- Case-insensitivity: Performs case-insensitive matching correctly across properties.
- Interactions: Opening/closing the modal via search button, backdrop clicks, `Ctrl+K`, `Cmd+K`, and `Escape` key.
- Stopping propagation: Prevents backdrop click events from closing modal when clicking on the content directly.

✨ **Result:** The improvement in test coverage
The test coverage on `GlobalSearchModal.jsx` is now successfully implemented hitting 100% test coverage using `@testing-library/react` and `vitest`.
