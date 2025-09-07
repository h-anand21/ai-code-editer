import type { Project, FileNode, Suggestion, PresenceUser, Language } from './types';
import { formatDistanceToNow } from 'date-fns';

const now = new Date();

const getRelativeTime = (date: Date) => formatDistanceToNow(date, { addSuffix: true });

const mockFiles: FileNode[] = [
  {
    id: '1',
    name: 'README.md',
    path: '/README.md',
    type: 'file',
    language: 'markdown',
    content: '# Welcome to Your Project!\\n\\nThis is a sample project structure.',
    lastModified: getRelativeTime(new Date(now.getTime() - 1000 * 60 * 5)),
  },
  {
    id: '2',
    name: 'src',
    path: '/src',
    type: 'folder',
    lastModified: getRelativeTime(new Date(now.getTime() - 1000 * 60 * 10)),
    children: [
      {
        id: '3',
        name: 'index.tsx',
        path: '/src/index.tsx',
        type: 'file',
        language: 'typescript',
        content: `console.log("Hello from index.tsx!");`,
        lastModified: getRelativeTime(new Date(now.getTime() - 1000 * 60 * 2)),
      },
      {
        id: '4',
        name: 'components',
        path: '/src/components',
        type: 'folder',
        lastModified: getRelativeTime(new Date(now.getTime() - 1000 * 60 * 8)),
        children: [],
      },
      {
        id: '7',
        name: 'js',
        path: '/src/js',
        type: 'folder',
        lastModified: getRelativeTime(new Date(now.getTime() - 1000 * 60 * 7)),
        children: [
          {
            id: '8',
            name: 'main.js',
            path: '/src/js/main.js',
            type: 'file',
            language: 'javascript',
            content: 'console.log("Hello from main.js!");',
            lastModified: getRelativeTime(new Date(now.getTime() - 1000 * 60 * 1)),
          },
        ],
      },
      {
        id: '6',
        name: 'preview.html',
        path: '/src/preview.html',
        type: 'file',
        language: 'html',
        content: `<!DOCTYPE html>
<html>
<head>
  <title>AetherCode Preview</title>
  <style>
    body { font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background-color: #f0f0f0; color: #333; }
    h1 { font-size: 2rem; color: #007acc; }
  </style>
</head>
<body>
  <h1>Hello from AetherCode!</h1>
</body>
</html>`,
        lastModified: getRelativeTime(new Date(now.getTime() - 1000 * 60 * 1)),
      }
    ],
  },
  {
    id: '5',
    name: 'package.json',
    path: '/package.json',
    type: 'file',
    language: 'json',
    content: JSON.stringify({ name: 'my-app', version: '0.1.0' }, null, 2),
    lastModified: getRelativeTime(new Date(now.getTime() - 1000 * 60 * 20)),
  },
];


export const mockUsers: PresenceUser[] = [
  { id: 'user-1', name: 'Alex Johnson', avatarUrl: 'https://picsum.photos/seed/alex/32/32', status: 'active', lastActive: 'now' },
  { id: 'user-2', name: 'Maria Garcia', avatarUrl: 'https://picsum.photos/seed/maria/32/32', status: 'idle', lastActive: '5m ago' },
  { id: 'user-3', name: 'Chen Wei', avatarUrl: 'https://picsum.photos/seed/chen/32/32', status: 'offline', lastActive: '2h ago' },
];

export const mockProject: Project = {
  id: 'proj-123',
  name: 'AetherCode Demo',
  files: mockFiles,
  ownerId: 'user-1',
  createdAt: new Date().toISOString(),
  branch: 'main',
  collaborators: mockUsers,
};

export const mockSuggestions: Suggestion[] = [
    {
        id: 'sug-1',
        fileId: '3',
        type: 'suggestion',
        snippet: `const App = () => (\\n  <div style={{ padding: '2rem', textAlign: 'center' }}>\\n    <h1>Hello, World!</h1>\\n    <p>Welcome to your new React app.</p>\\n  </div>\\n);`,
        explanation: "Wraps the component in a div with some basic styling for better presentation."
    },
    {
        id: 'sug-2',
        fileId: '3',
        type: 'diagnostic',
        snippet: `import type { FC } from 'react';\\n\\nconst App: FC = () => <h1>Hello, World!</h1>;`,
        explanation: "Adds a `FC` type for better type safety and clarity on the component's signature."
    }
];
