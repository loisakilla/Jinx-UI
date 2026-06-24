import '@jinx-ui/core';
import { createRoot } from 'react-dom/client';
import { App } from './showcase/App';

const rootNode = document.getElementById('app');
if (!rootNode) {
  throw new Error('Missing #app root');
}

createRoot(rootNode).render(<App />);
