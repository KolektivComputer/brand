import { useState } from 'react';
import { KitchenSink } from '../../example/KitchenSink';
import kitchenSinkSource from '../../example/KitchenSink.tsx?raw';
import { Code } from '../Code';
import { Lead, PageTitle } from '../CodeSample';

export function Example() {
  const [mode, setMode] = useState<'preview' | 'code'>('preview');

  return (
    <div>
      <PageTitle>Kitchen sink</PageTitle>
      <Lead>
        The Kolektiv site — pretend the address bar says kolektiv.computer. Wordmark navbar,
        computing-wordmark hero, dark marks and a full footer. Flip the window to code to see how
        it is built.
      </Lead>

      <div className="mockup-browser w-full border border-base-300 bg-base-300">
        <div className="mockup-browser-toolbar">
          <div className="flex w-full items-center gap-2">
            {mode === 'preview' ? (
              <div className="input input-sm w-full max-w-md">kolektiv.computer</div>
            ) : (
              <div className="flex items-center gap-2 font-mono text-xs opacity-70">
                <span className="inline-block size-2.5 rounded-full bg-primary" />
                KitchenSink.tsx
              </div>
            )}

            <button
              type="button"
              className="btn btn-ghost btn-xs ml-auto"
              onClick={() => setMode((value) => (value === 'preview' ? 'code' : 'preview'))}
            >
              {mode === 'preview' ? 'Show code' : 'Show preview'}
            </button>
          </div>
        </div>

        <div className="h-[38rem] overflow-auto bg-base-100">
          {mode === 'preview' ? (
            <KitchenSink />
          ) : (
            <Code code={kitchenSinkSource} lang="tsx" className="min-h-full" />
          )}
        </div>
      </div>
    </div>
  );
}
