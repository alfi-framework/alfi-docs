import { CodeBlock } from '../../docs/components/CodeBlock'

const sampleCode = `<!-- TODO: replace with real Alfi API -->
#include <iostream>

int main() {
    // TODO: replace with real Alfi API server startup & route handler
    std::cout << "Alfi HTTP server initialized on http://localhost:8080" << std::endl;
    return 0;
}`

export function CodePreview() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 my-6">
      <div className="text-center mb-3">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-accent">
          C++20 Expressive Syntax
        </span>
      </div>
      <CodeBlock code={sampleCode} language="cpp" />
    </div>
  )
}
