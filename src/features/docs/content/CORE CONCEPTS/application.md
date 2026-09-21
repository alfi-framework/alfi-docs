# Application

The `alfi::App` class is the **heart of every Alfi server**. It owns the router, manages the HTTP server lifecycle, and is the single object you interact with to define routes and start listening for connections.

---

## Creating an App Instance

```cpp
#include <alfi/alfi.hpp>

int main() {
    alfi::App app;

    // define routes...

    app.listen(2804);
}
```

That's it. One include, one instance, one call to `listen()`.

---

## Loading Configuration

Rather than hardcoding the port and host, Alfi apps typically load configuration from `app.json` using `alfi::loadServerConfig()`:

```cpp
int main() {
    auto config = alfi::loadServerConfig("app.json");

    alfi::App app;

    // ...

    app.listen(config.port);
}
```

`loadServerConfig` returns a `ServerConfig` struct with sensible defaults (`host: 127.0.0.1`, `port: 2804`) so the app runs even if `app.json` is missing or incomplete.

> [!NOTE]
> See [`app.json`](../docs/project-structure#appjson) in the Project Structure guide for the full configuration schema.

---

## The App API

### Route Registration

`alfi::App` exposes one method per HTTP method for registering routes:

```cpp
app.get(path, handler);
app.post(path, handler);
app.put(path, handler);
app.patch(path, handler);
app.del(path, handler);   // "del" because "delete" is a C++ keyword
```

Each method optionally accepts a **summary** and **description** string used for auto-generated OpenAPI documentation:

```cpp
app.get("/health", [](const alfi::Request& req, alfi::Response& res) {
    res.json({ {"status", "ok"} });
}, "Health Check", "Returns service health status");
```

---

### Route Groups

Use `app.group(prefix)` to create a `RouteGroup` — a scoped set of routes that share a common URL prefix:

```cpp
auto api = app.group("/api/v1");

api.get("/users", listUsersHandler);
api.post("/users", createUserHandler);
api.get("/users/:id", getUserHandler);
```

This registers the routes at `/api/v1/users`, `/api/v1/users`, and `/api/v1/users/:id` respectively. See the [Routing](./routing.md) guide for more on route groups.

---

### Starting the Server

`app.listen()` is overloaded with three signatures:

```cpp
// 1. Listen on a specific port (binds to 0.0.0.0)
app.listen(2804);

// 2. Listen with a full ServerConfig struct
alfi::ServerConfig config = alfi::loadServerConfig("app.json");
app.listen(config);

// 3. Load config from a file path and listen
app.listen("app.json");  // default argument
```

> [!IMPORTANT]
> All routes **must** be registered before `app.listen()` is called. The route table is immutable after the server starts — this is by design for thread safety.

---

### Stopping the Server

```cpp
app.stop();
```

This gracefully signals the HTTP server to stop accepting new connections. Typically called in a signal handler for `SIGINT` / `SIGTERM`.

---

## Full Minimal Example

```cpp
#include <alfi/alfi.hpp>

int main() {
    auto config = alfi::loadServerConfig("app.json");

    alfi::App app;

    app.get("/", [](const alfi::Request& req, alfi::Response& res) {
        res.json({ {"message", "Welcome to my API"} });
    });

    app.get("/health", [](const alfi::Request& req, alfi::Response& res) {
        res.json({ {"status", "ok"} });
    });

    app.listen(config.port);
    return 0;
}
```

![App lifecycle diagram](https://assets.alfi.dev/docs/app-lifecycle.png)

---

## Built-in Endpoints

Every Alfi app automatically exposes:

| Path     | Description                                               |
|----------|-----------------------------------------------------------|
| `/docs`  | Auto-generated Swagger UI for your API                    |

> [!TIP]
> Open `http://localhost:2804/docs` in your browser after starting your server — you'll see interactive documentation for all registered routes, built from the optional `summary` and `description` strings you provide.

---

## Error Handling

Alfi wraps every handler invocation in a try/catch. If your handler throws an uncaught exception, the framework automatically responds with:

```json
{
  "error": {
    "status": 500,
    "message": "Internal Server Error"
  }
}
```

This prevents unhandled exceptions from crashing the server process.
