# Request Middleware

**Request Middleware** performs tasks during the **inbound phase** of an HTTP request before `next()` is called (or before the target handler executes).

These middleware components inspect the incoming `const alfi::Request&`, perform validations, sanitize inputs, authenticate credentials, or halt request processing early (short-circuiting).

---

## Short-Circuiting Requests

If a Request Middleware determines that a request should not proceed (e.g., missing authentication token, rate limit exceeded, invalid client payload), it can **short-circuit** the chain:

1. Set the appropriate status code and body using `res.status()`, `res.error()`, or `res.json()`.
2. **Return immediately** without calling `next()`.

<!-- PLACEHOLDER: Image showing Request Middleware Short-Circuiting Flow -->
![Short Circuiting Flow Placeholder](docs/images/request_middleware_short_circuit.png)

### Example: API Key Authentication Guard

```cpp
#include <alfi/app.hpp>

app.use("/api", [](const alfi::Request& req, alfi::Response& res, alfi::Next next) {
    std::string apiKey = req.header("X-API-Key");

    if (apiKey.empty()) {
        // Short-circuit execution with 401 Unauthorized
        res.error(401, "Unauthorized: X-API-Key header missing");
        return; 
    }

    if (apiKey != "secret-token-123") {
        // Short-circuit execution with 403 Forbidden
        res.error(403, "Forbidden: Invalid API Key");
        return;
    }

    // Key is valid -> Continue to target handler
    next();
});
```

---

## Request Inspection & Reading Data

Request middleware can inspect all attributes of `alfi::Request`:

```cpp
app.use([](const alfi::Request& req, alfi::Response& res, alfi::Next next) {
    // 1. Inspect HTTP Method & Path
    std::string method = req.method;
    std::string path   = req.path;

    // 2. Read Request Headers (case-insensitive key lookups)
    std::string authHeader = req.header("Authorization");
    std::string userAgent  = req.header("User-Agent");

    // 3. Read Query Parameters
    std::string queryPage = req.query("page");

    // 4. Read Path Parameters (if applicable)
    std::string userId = req.param("id");

    // 5. Inspect Raw Body String
    std::string rawBody = req.body;

    next();
});
```

---

## Use Case: Content-Type Enforcer

Request middleware can restrict routes to specific content types (e.g., requiring `application/json` for POST requests):

```cpp
app.use([](const alfi::Request& req, alfi::Response& res, alfi::Next next) {
    if (req.method == "POST" || req.method == "PUT" || req.method == "PATCH") {
        std::string contentType = req.header("Content-Type");
        if (contentType.find("application/json") == std::string::npos) {
            res.error(415, "Unsupported Media Type: Request must be application/json");
            return; // Stop processing
        }
    }
    next();
});
```
