import { CodeBlock } from '../../docs/components/CodeBlock'

const sampleCode = `#include <alfi/alfi.hpp>

int main() {
    auto config = alfi::loadServerConfig("app.json");

    alfi::App app;

    // Health Route
    app.get("/health", [](alfi::Response& res) {
        res.json({ {"status", "ok"} });
    }, "Health check", "Returns service health status");

    app.listen(config.port);
}
`

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
