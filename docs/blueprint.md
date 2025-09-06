# **App Name**: AetherCode

## Core Features:

- Firebase Authentication: Secure user authentication using Firebase Auth with Google sign-in and email/password fallback.
- Multi-File Project Workspace: Enable users to manage projects with multiple files stored in Firestore and Storage, featuring a file tree view and standard file operations.
- Monaco Editor Integration: Implement Monaco Editor for code editing with syntax highlighting, language modes, tabbed interface, and minimap.
- AI Code Completion: Utilize the `/api/ai/suggest` Cloud Function to provide AI-powered code completions, refactoring suggestions, or explanations based on the current file content and cursor context, using a tool that can reason whether and how to apply various AI suggestions.
- AI Code Diagnostics: Use the `/api/ai/diagnose` Cloud Function to analyze code for potential bugs and security issues, suggesting fixes and improvements using a tool that can reason whether and how to apply various AI suggestions.
- Real-Time Collaboration: Enable real-time cursors and document synchronization using Firestore real-time updates, with presence indicators for collaborators.
- Shareable Links: Generate shareable links with different permission levels (read-only, edit) stored securely with optional expiration dates.

## Style Guidelines:

- Primary color: Soft blue (#64B5F6) to evoke feelings of calmness, focus, and productivity.
- Background color: Light gray (#F5F5F5), almost white, providing a clean and unobtrusive backdrop to focus on the code.
- Accent color: Subtle teal (#26A69A) for interactive elements, providing a delicate and elegant, more noticeable call to action without distracting from the code.
- Body and headline font: 'Inter', a sans-serif typeface with a clean, modern appearance that's highly readable on screens.
- Code font: 'Source Code Pro' for displaying code snippets in a clear, monospaced format.
- Use a minimalist icon set, focusing on clarity and ease of recognition. Icons should be monochromatic with the accent color on hover.
- Maintain a clean, mobile-responsive layout with a left file tree, center editor, and right panels for output, suggestions, and collaboration.
- Subtle animations for file operations and AI suggestions to enhance user experience without being distracting.