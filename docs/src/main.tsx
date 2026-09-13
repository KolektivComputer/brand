import { createRoot } from 'react-dom/client';
import '@fontsource/inclusive-sans/latin-300.css';
import '@fontsource/inclusive-sans/latin-300-italic.css';
import '@fontsource/source-sans-3/latin-400.css';
import '@fontsource/source-sans-3/latin-600.css';
import '@fontsource/iosevka/latin-400.css';
import { DocsApp } from './docs/DocsApp';
import '@kolektiv/themes/theme.css';
import '@kolektiv/brand-core/theme.css';
import './style.css';

const root = document.getElementById('root');
if (root) createRoot(root).render(<DocsApp />);
