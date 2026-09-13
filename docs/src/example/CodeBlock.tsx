import { useState } from 'react';
import { Code } from '../docs/Code';

interface CodeBlockProps {
  code: string;
  label?: string;
  lang?: string;
}

export function CodeBlock({ code, label = 'Show code', lang = 'tsx' }: CodeBlockProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-w-0">
      <button
        type="button"
        className="btn btn-ghost btn-xs"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? 'Hide code' : label}
      </button>
      {open ? <Code code={code} lang={lang} className="mt-2 max-h-96 rounded-lg" /> : null}
    </div>
  );
}
