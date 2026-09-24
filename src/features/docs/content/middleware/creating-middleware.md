# Creating Middleware

This guide explains how to author custom middleware in Alfi, ranging from simple lambda functions to configurable middleware factories and class-based functors.

---

## Anatomy of a Custom Middleware

A middleware function receives `(const Request& req, Response& res, Next next)` and decides whether to continue execution by calling `next()` or terminate early (short-circuit).

<!-- PLACEHOLDER: Image showing Custom Middleware Flow (Inbound vs Outbound Execution) -->
![Custom Middleware Flow Placeholder](docs/images/custom_middleware_flow.png)

### 1. Basic Inline Lambda Middleware

The simplest way to create middleware is passing a lambda to `app.use()`:

```cpp
#include <alfi/app.hpp>
#include <iostream>

int main() {
    alfi::App app;

    app.use([](const alfi::Request& req, alfi::Response& res, alfi::Next next) {
        std::cout << "[Incoming] " << req.method << " " << req.path << std::endl;
        
        // Pass control to the next middleware or route handler
        next();
        
        std::cout << "[Outgoing] Status: " << res.statusCode << std::endl;
    });

    app.get("/hello", [](const alfi::Request& req, alfi::Response& res) {
        res.text("Hello World!");
    });

    app.listen(8080);
}
```

---

## The Factory Pattern for Configurable Middleware

When a middleware requires configurable parameters (such as database connections, log outputs, or token secrets), use a **Factory Function** returning `alfi::Middleware`.

### Example: Custom Header Injector

```cpp
#include <alfi/middleware.hpp>
#include <string>

struct HeaderConfig {
    std::string headerName;
    std::string headerValue;
};

alfi::Middleware make_header_injector(HeaderConfig config) {
    return [config](const alfi::Request& req, alfi::Response& res, alfi::Next next) {
        // Run next() first to let handler populate response
        next();
        
        // Inject custom header on the response path
        res.header(config.headerName, config.headerValue);
    };
}

// Usage:
app.use(make_header_injector({"X-Powered-By", "Alfi C++ Framework"}));
```

---

## Class / Functor-based Middleware

For complex middleware that maintains internal state or relies on member variables, implement a functor with `operator()` matching the middleware signature:

```cpp
#include <alfi/middleware.hpp>
#include <atomic>

class RequestCounterMiddleware {
private:
    std::atomic<uint64_t> count_{0};

public:
    void operator()(const alfi::Request& req, alfi::Response& res, alfi::Next next) {
        uint64_t current = ++count_;
        res.header("X-Request-Count", std::to_string(current));
        next();
    }

    uint64_t getCount() const {
        return count_.load();
    }
};

// Usage:
RequestCounterMiddleware counter;
app.use(std::ref(counter)); // Pass reference if state needs to persist outside
```

---

## Error Handling & Exception Safety

Alfi automatically catches unhandled exceptions thrown inside middleware layers or handlers, converting them into `500 Internal Server Error` responses.

However, custom middleware can catch exceptions thrown by `next()` to provide custom fallback responses:

```cpp
app.use([](const alfi::Request& req, alfi::Response& res, alfi::Next next) {
    try {
        next();
    } catch (const std::invalid_argument& ex) {
        res.error(400, std::string("Bad Request: ") + ex.what());
    } catch (const std::exception& ex) {
        res.error(500, std::string("Unhandled Server Error: ") + ex.what());
    }
});
```

---

## Multiple `next()` Call Prevention

Calling `next()` multiple times inside a single middleware execution is illegal and will cause a `alfi::MiddlewareError` exception to be thrown:

```cpp
app.use([](const alfi::Request& req, alfi::Response& res, alfi::Next next) {
    next();
    // Throws alfi::MiddlewareError: next() called multiple times
    next(); 
});
```
