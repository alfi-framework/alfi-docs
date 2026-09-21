# Routing

Routing is how Alfi maps an incoming HTTP request to the right handler function. You define routes on the `alfi::App` instance, and Alfi's router finds the best match for every request.

---

## Defining a Route

A route is a combination of an **HTTP method**, a **path pattern**, and a **handler function**:

```cpp
app.get("/users", [](const alfi::Request& req, alfi::Response& res) {
    res.json({ {"users", nlohmann::json::array()} });
});
```

The handler is a C++ lambda (or any `std::function<void(const Request&, Response&)>`) that receives the request and populates the response.

---

## Route Methods

Alfi provides a method on `App` for each supported HTTP verb:

```cpp
app.get("/path",    handler);
app.post("/path",   handler);
app.put("/path",    handler);
app.patch("/path",  handler);
app.del("/path",    handler);  // note: del, not delete
```

> [!NOTE]
> `del` is used instead of `delete` because `delete` is a reserved keyword in C++.

---

## Path Parameters

Prefix a path segment with `:` to capture a dynamic value from the URL:

```cpp
app.get("/users/:id", [](const alfi::Request& req, alfi::Response& res) {
    std::string id = req.param("id");
    res.json({ {"id", id} });
});
```

- `GET /users/42` → `req.param("id")` returns `"42"`
- `GET /users/abc` → `req.param("id")` returns `"abc"`

You can have multiple parameters in a single path:

```cpp
app.get("/orgs/:orgId/repos/:repoId", [](const alfi::Request& req, alfi::Response& res) {
    auto org  = req.param("orgId");
    auto repo = req.param("repoId");
    // ...
});
```

---

## Static vs. Param Segments — Precedence

When two routes could match the same URL, **static segments always win over parameterized ones**, regardless of registration order:

```cpp
app.get("/users/:id",  handlerA);  // param route
app.get("/users/me",   handlerB);  // static route
```

`GET /users/me` → **always** calls `handlerB`, even though `handlerA` was registered first.

> [!IMPORTANT]
> This precedence rule is deterministic and registration-order-independent. You don't need to worry about the order in which you register static and parameterized routes.

---

## Route Groups

Use `app.group(prefix)` to scope multiple routes under a shared URL prefix, keeping your code organized:

```cpp
auto api = app.group("/api/v1");

api.get("/users",      listUsersHandler);
api.post("/users",     createUserHandler);
api.get("/users/:id",  getUserHandler);
api.put("/users/:id",  updateUserHandler);
api.del("/users/:id",  deleteUserHandler);
```

This is equivalent to registering:
- `GET  /api/v1/users`
- `POST /api/v1/users`
- `GET  /api/v1/users/:id`
- `PUT  /api/v1/users/:id`
- `DELETE /api/v1/users/:id`

### Nested Groups

Groups can be nested:

```cpp
auto api  = app.group("/api");
auto v1   = api.group("/v1");
auto v2   = api.group("/v2");

v1.get("/users", v1UsersHandler);
v2.get("/users", v2UsersHandler);
```

---

## Trailing Slash Handling

Alfi distinguishes between `/users` and `/users/` as **different routes** in the fast exact-match pass, but treats them as equivalent in the segment-based match pass.

In practice: define routes without trailing slashes unless you specifically need to differentiate them.

---

## OpenAPI / Swagger Documentation

You can attach a **summary** and **description** to any route. Alfi uses these strings to auto-generate OpenAPI 3.0 documentation, served at `/docs`:

```cpp
app.get("/users/:id",
    getUserHandler,
    "Get User By ID",
    "Returns a single user profile identified by their numeric ID"
);
```

![Swagger UI screenshot](https://assets.alfi.dev/docs/swagger-ui-routes.png)

---

## 404 and 405 Responses

Alfi distinguishes between two "not found" cases automatically:

| Scenario | Status Code | Description |
|---|---|---|
| Path is not registered at all | `404 Not Found` | No route matches this path for any method |
| Path is registered but not for this method | `405 Method Not Allowed` | The path exists but the HTTP verb doesn't match |

These responses are handled by the framework automatically — you don't need to write any fallback routes.

---

## Full Example

```cpp
#include <alfi/alfi.hpp>

int main() {
    auto config = alfi::loadServerConfig("app.json");
    alfi::App app;
    
    // Simple static route
    app.get("/health", [](const alfi::Request& req, alfi::Response& res) {
        res.json({ {"status", "ok"} });
    });

    // Route group
    auto api = app.group("/api/v1");

    api.get("/users", [](const alfi::Request& req, alfi::Response& res) {
        res.json({ {"users", nlohmann::json::array()} });
    }, "List Users", "Returns all users");

    api.get("/users/:id", [](const alfi::Request& req, alfi::Response& res) {
        res.json({ {"id", req.param("id")} });
    }, "Get User", "Returns user by ID");

    // Static beats param:
    api.get("/users/me", [](const alfi::Request& req, alfi::Response& res) {
        res.json({ {"user", "current"} });
    }, "Get Current User", "Returns the authenticated user");

    app.listen(config.port);
}
```
