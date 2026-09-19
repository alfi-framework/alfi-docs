# Introduction

Welcome to **Alfi**, a lightweight, high-performance C++ HTTP framework designed for modern web applications, microservices, and API backends.

## Overview & Philosophy

Alfi is engineered with speed, developer ergonomics, and minimal overhead at its core.

- **Asynchronous Engine**: Built to leverage modern C++20 concurrency primitives.
- **Zero-Allocation Routing**: Trie-based path matching for high-throughput endpoint dispatches.
- **Type-Safe Extractors**: Direct parsing of path parameters, query strings, and JSON request bodies.
- **Predictable Footprint**: Minimal runtime allocations and low memory consumption.

## Starter Example

Below is a basic preview of how an Alfi server application is structured:

```cpp
<!-- TODO: replace with real Alfi API -->
#include <iostream>

int main() {
    // TODO: replace with real Alfi API initialization & routing
    std::cout << "Starting Alfi HTTP server placeholder..." << std::endl;
    return 0;
}
```

> **Note**: Alfi is currently in active developer preview. APIs are undergoing final refinement.

## Framework Architecture

Alfi separates HTTP request execution into distinct pipeline layers:

| Component | Responsibility | Overhead |
| :--- | :--- | :--- |
| **Network IO** | Non-blocking TCP event loop | Zero copy |
| **HTTP Parser** | Protocol framing & header parsing | Zero alloc |
| **Router** | Trie-based method & route matching | O(L) path depth |
| **App Handler** | User handler execution | User-defined |

Next step: Proceed to [Installation](/docs/installation) to integrate Alfi into your build environment.
