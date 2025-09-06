import type { Project, FileNode } from './types';

const readmeContent = `# Welcome to AetherCode!

This is a demo project to showcase the capabilities of AetherCode, your AI-powered coding companion.

## Features

- **File Explorer**: Browse your project files on the left.
- **Tabbed Editor**: Open and edit multiple files.
- **AI Assistance**: Use the panel on the right to get code suggestions and diagnostics.

Try selecting a file and using the AI tools!
`;

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AetherCode</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>Hello, AetherCode!</h1>
  <p>This is a live preview of your web project.</p>
  <script src="script.js"></script>
</body>
</html>`;

const cssContent = `body {
  font-family: sans-serif;
  background-color: #f0f0f0;
  color: #333;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

h1 {
  color: #007acc;
}`;

const jsContent = `document.addEventListener('DOMContentLoaded', () => {
  const heading = document.querySelector('h1');
  heading.addEventListener('click', () => {
    alert('You clicked the heading!');
    // Try asking the AI to add a new feature here.
    // For example: "add a new paragraph element with some text"
  });
});`;

const pythonContent = `# A simple Python script
def greet(name):
  """This function greets the person passed in as a parameter."""
  print(f"Hello, {name}!")

# Try using the AI Diagnostics tool on this code.
# There aren't any bugs, but it might suggest type hints!
if __name__ == "__main__":
  greet("AetherCoder")`;

const fileTree: FileNode[] = [
  {
    id: '1',
    name: 'README.md',
    type: 'file',
    content: readmeContent,
    language: 'typescript',
  },
  {
    id: '2',
    name: 'WebApp',
    type: 'folder',
    children: [
      { id: '3', name: 'index.html', type: 'file', content: htmlContent, language: 'html' },
      { id: '4', name: 'style.css', type: 'file', content: cssContent, language: 'css' },
      { id: '5', name: 'script.js', type: 'file', content: jsContent, language: 'typescript' },
    ],
  },
  {
    id: '6',
    name: 'utils',
    type: 'folder',
    children: [
      { id: '7', name: 'helpers.py', type: 'file', content: pythonContent, language: 'python' }
    ],
  },
];

export const mockProject: Project = {
  id: 'proj_1',
  name: 'Demo Project',
  files: fileTree,
  ownerId: 'user_123',
  createdAt: new Date().toISOString(),
};
