# Introduction to Middleware

Middleware components in **Alfi** are functions that sit between incoming HTTP requests and target route handlers. They provide a powerful way to inspect, modify, or halt requests before they reach your handler, and post-process responses before they are returned to the client.

---

## Overview

In Alfi, middleware is processed as an **onion model** chain. When an HTTP request enters the application, it moves through each registered middleware layer sequentially.

<!-- PLACEHOLDER: Image showing the Middleware Pipeline / Onion Model Architecture -->
![Middleware Pipeline Placeholder](docs/images/middleware_pipeline.png)

---

## Core Signature

All middleware in Alfi conforms to the `alfi::Middleware` function signature:

```cpp
#include <alfi/middleware.hpp>

using Next       = std::function<void()>;
using Middleware = std::function<void(const Request& req, Response& res, Next next)>;
```

### Parameters

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `req` | `const alfi::Request&` | Read-only reference to the incoming HTTP request. |
| `res` | `alfi::Response&` | Mutable reference to the HTTP response being constructed. |
| `next` | `alfi::Next` | Continuation callback to pass control to the next middleware or route handler. |

---

## Common Use Cases

Middleware is ideal for cross-cutting concerns, including:

- **Logging & Metrics**: Measuring execution time and logging incoming HTTP requests.
- **Authentication & Authorization**: Validating tokens, session cookies, or API keys.
- **CORS Management**: Injecting CORS headers and responding to preflight OPTIONS requests.
- **Header Injection & Response Modification**: Setting security headers, tracking headers (`X-Request-ID`), or compression.
- **Rate Limiting & Input Validation**: Guarding endpoints from abuse or invalid data payloads.

---

## Registering Middleware

Middleware can be attached globally or scoped to specific path prefixes using `app.use()` or via `RouteGroup`:

```cpp
alfi::App app;

// 1. Global Middleware (runs on all routes)
app.use(alfi::logger);

// 2. Prefix-Scoped Middleware (runs only under /api)
app.use("/api", [](const alfi::Request& req, alfi::Response& res, alfi::Next next) {
    if (req.header("X-Api-Key").empty()) {
        res.error(401, "API Key Required");
        return; // Short-circuit
    }
    next();
});

// 3. Route Group Scoped Middleware
auto v1 = app.group("/v1");
v1.use([](const alfi::Request& req, alfi::Response& res, alfi::Next next) {
    res.header("X-API-Version", "v1");
    next();
});
```

> **Note**: All middleware must be registered before calling `app.listen()`. Registering middleware after `listen()` will throw a `std::logic_error`.
