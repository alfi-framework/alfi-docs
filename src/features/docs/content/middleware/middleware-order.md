# Middleware Order

Understanding execution order in Alfi is critical for building robust web applications. Alfi middleware follows a strict **Onion Model** (First-In, Last-Out for response processing), combined with path prefix filtering.

---

## The Onion Execution Model

When multiple middleware layers are registered, code written **before `next()`** executes in registration order (top to bottom). Code written **after `next()`** executes in reverse registration order (bottom to top).

<!-- PLACEHOLDER: Image showing Middleware Onion Model Diagram -->
![Middleware Order Diagram Placeholder](docs/images/middleware_order_onion.png)

### Execution Flow Example

```cpp
#include <alfi/app.hpp>
#include <iostream>

alfi::App app;

// Middleware 1
app.use([](const alfi::Request& req, alfi::Response& res, alfi::Next next) {
    std::cout << "[MW 1] Pre-next (Inbound)" << std::endl;
    next();
    std::cout << "[MW 1] Post-next (Outbound)" << std::endl;
});

// Middleware 2
app.use([](const alfi::Request& req, alfi::Response& res, alfi::Next next) {
    std::cout << "[MW 2] Pre-next (Inbound)" << std::endl;
    next();
    std::cout << "[MW 2] Post-next (Outbound)" << std::endl;
});

// Route Handler
app.get("/test", [](const alfi::Request& req, alfi::Response& res) {
    std::cout << "[Handler] Executing Route Handler" << std::endl;
    res.text("OK");
});
```

### Console Output Tracing

When a request arrives for `/test`, the console will output:

```text
[MW 1] Pre-next (Inbound)
[MW 2] Pre-next (Inbound)
[Handler] Executing Route Handler
[MW 2] Post-next (Outbound)
[MW 1] Post-next (Outbound)
```

---

## Prefix Matching & Scoped Middleware Execution

Alfi filters middleware based on request path prefixes using `normalizeMiddlewarePrefix()`. A middleware attached to `/api` will only run if the request path starts with `/api`.

### Matching Rules

1. Global middleware (attached with `app.use(mw)` or `app.use("/", mw)`) matches **all** requests.
2. Prefix middleware (e.g. `app.use("/api", mw)`) matches paths starting with `/api` (such as `/api/users`, `/api/v1/health`).
3. Trailing slashes are normalized: `/api/` is normalized to `/api`.

```cpp
app.use(mw1);                // Prefix "/"     -> Runs on ALL requests
app.use("/api", mw2);         // Prefix "/api"  -> Runs on /api/* requests
app.use("/api/v1", mw3);      // Prefix "/api/v1" -> Runs on /api/v1/* requests
```

If a request comes to `/api/v1/users`:
1. `mw1` executes
2. `mw2` executes
3. `mw3` executes
4. Handler executes

If a request comes to `/health`:
1. `mw1` executes
2. `mw2` and `mw3` are skipped because their prefix does not match `/health`.

---

## Route Group Middleware Order

When using `RouteGroup`, group-level middleware is added to the global middleware list with the group's prefix attached.

```cpp
alfi::App app;

app.use(mw_global); // 1. Global

auto api = app.group("/api");
api.use(mw_api);    // 2. Scoped to /api

auto v1 = api.group("/v1");
v1.use(mw_v1);      // 3. Scoped to /api/v1
```

The execution sequence directly reflects the order in which `use()` was called across the app and route groups.

---

## Best Practices for Middleware Ordering

1. **Place Logging & Timing First**: Register loggers and duration timers at the very top of `app.use()` so they capture the complete lifecycle (including short-circuits from subsequent security middleware).
2. **Place CORS Early**: CORS preflight (`OPTIONS`) handling should run early before authentication guards block requests.
3. **Place Authentication Before Handlers**: Scoped authentication middleware must execute before business handlers to guard protected resources.
