# Response

Every route handler receives an `alfi::Response&` as its second argument. You use the `Response` object to set the HTTP status code, add response headers, and write the response body — either as JSON or plain text.

The `Response` API is **fluent**: methods return `*this`, so you can chain calls.

---

## The Response Object

```cpp
app.get("/example", [](const alfi::Request& req, alfi::Response& res) {
    res.status(200).json({ {"message", "Hello!"} });
});
```

| Member          | Type                                          | Default      | Description                          |
|-----------------|-----------------------------------------------|--------------|--------------------------------------|
| `statusCode`    | `int`                                         | `200`        | HTTP status code                     |
| `headers`       | `std::unordered_map<std::string, std::string>`| `{}`         | Response headers map                 |
| `bodyStr`       | `std::string`                                 | `""`         | Raw response body string             |

---

## Setting the Status Code

```cpp
res.status(201);  // Created
res.status(404);  // Not Found
res.status(500);  // Internal Server Error
```

`status()` is chainable, so you typically combine it with `json()` or `send()`:

```cpp
res.status(404).json({ {"error", "User not found"} });
```

---

## Sending a JSON Response

Use `res.json()` to send a JSON body. It automatically sets the `Content-Type: application/json` header for you:

```cpp
res.json({ {"message", "ok"} });
res.json({ {"id", 42}, {"name", "Alice"} });
res.json(nlohmann::json::array({"a", "b", "c"}));
```

The argument is an `nlohmann::json` value — which can be constructed from initializer lists, variables, or existing JSON objects.

---

## Sending a Plain Text Response

Use `res.send()` to write a plain text body. If no `Content-Type` has already been set, it defaults to `text/plain`:

```cpp
res.send("pong");
res.status(200).send("Server is running");
```

---

## Setting Response Headers

Use `res.header(key, value)` to add or override individual response headers:

```cpp
res.header("X-Request-Id", "abc123")
   .header("Cache-Control", "no-store")
   .json({ {"status", "ok"} });
```

Some headers are set automatically:
- `Content-Type` — set by `json()` (`application/json`) or `send()` (`text/plain`)
- `Content-Length` — computed from the body length unless you override it
- `Connection: close` — always added unless you explicitly set your own

---

## Sending Error Responses

Use `res.error(statusCode, message)` for a consistent JSON error format across your entire API:

```cpp
res.error(404, "User not found");
res.error(400, "name and email are required");
res.error(500, "Database connection failed");
```

Every error response follows this shape:

```json
{
  "error": {
    "status": 404,
    "message": "User not found"
  }
}
```

> [!TIP]
> Using `res.error()` throughout your handlers ensures consistent error payloads, which makes client-side error handling much easier to implement.

---

## Common Status Codes

| Code | Name                  | Common Use Case                            |
|------|-----------------------|--------------------------------------------|
| 200  | OK                    | Successful GET, PUT, PATCH                 |
| 201  | Created               | Successful POST that creates a resource    |
| 204  | No Content            | Successful DELETE with no body             |
| 400  | Bad Request           | Invalid input, missing required fields     |
| 401  | Unauthorized          | Missing or invalid authentication          |
| 403  | Forbidden             | Authenticated but not permitted            |
| 404  | Not Found             | Resource doesn't exist                     |
| 405  | Method Not Allowed    | Route exists but wrong HTTP verb used      |
| 409  | Conflict              | Duplicate resource, constraint violation   |
| 415  | Unsupported Media Type| Wrong Content-Type for a body request      |
| 422  | Unprocessable Entity  | Valid JSON but semantically invalid        |
| 500  | Internal Server Error | Unhandled exception or server-side failure |

---

## Fluent Chaining Examples

```cpp
// 201 Created with a Location header
res.status(201)
   .header("Location", "/api/v1/users/42")
   .json({ {"id", 42}, {"name", "Alice"} });

// 401 with WWW-Authenticate header
res.status(401)
   .header("WWW-Authenticate", "Bearer realm=\"Alfi API\"")
   .json({ {"error", {{"status", 401}, {"message", "Unauthorized"}}} });

// 204 No Content (empty body)
res.status(204).send("");
```

---

## Full CRUD Response Example

```cpp
// POST /users — create
api.post("/users", [](const alfi::Request& req, alfi::Response& res) {
    auto body = req.body();
    // ... create user ...
    res.status(201)
       .header("Location", "/api/v1/users/1")
       .json({ {"id", 1}, {"name", body["name"]} });
});

// GET /users/:id — read
api.get("/users/:id", [](const alfi::Request& req, alfi::Response& res) {
    // ... find user ...
    if (!found) {
        res.error(404, "User not found");
        return;
    }
    res.json({ {"id", 1}, {"name", "Alice"} });
});

// DELETE /users/:id — delete
api.del("/users/:id", [](const alfi::Request& req, alfi::Response& res) {
    // ... delete user ...
    res.status(200).json({ {"status", "deleted"}, {"id", req.param("id")} });
});
```

![Response flow diagram](https://assets.alfi.dev/docs/response-flow.png)
