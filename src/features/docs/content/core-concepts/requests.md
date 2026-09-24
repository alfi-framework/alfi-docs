# Request

Every route handler receives a `const alfi::Request&` as its first argument. The `Request` object gives you access to everything about the incoming HTTP request: the URL, path parameters, query parameters, headers, and body.

---

## The Request Object

```cpp
app.get("/example", [](const alfi::Request& req, alfi::Response& res) {
    // req is your window into the incoming request
});
```

The `Request` class is defined with the following public fields and methods:

| Member              | Type                                          | Description                        |
|---------------------|-----------------------------------------------|------------------------------------|
| `method`            | `std::string`                                 | HTTP method (`"GET"`, `"POST"`, …) |
| `path`              | `std::string`                                 | The raw request path               |
| `headers`           | `std::unordered_map<std::string, std::string>`| All request headers (lowercase keys)|
| `queryParams`       | `std::unordered_map<std::string, std::string>`| Parsed query string parameters     |
| `pathParams`        | `std::unordered_map<std::string, std::string>`| Captured `:param` segments         |
| `rawBody`           | `std::string`                                 | The raw request body string        |
| `req.param(name)`   | `std::string`                                 | Access a named path parameter      |
| `req.query(name)`   | `std::string`                                 | Access a named query parameter     |
| `req.header(name)`  | `std::string`                                 | Access a request header            |
| `req.body()`        | `nlohmann::json`                              | Parse the body as JSON             |

---

## Path Parameters

Path parameters are captured from dynamic `:name` segments in your route pattern.

```cpp
app.get("/users/:id", [](const alfi::Request& req, alfi::Response& res) {
    std::string id = req.param("id");
    res.json({ {"user_id", id} });
});
```

- `GET /users/42` → `req.param("id")` → `"42"`
- `GET /users/alice` → `req.param("id")` → `"alice"`

If you need to use the value as a number, convert it yourself:

```cpp
int id;
try {
    id = std::stoi(req.param("id"));
} catch (...) {
    res.status(400).json({ {"error", "Invalid ID format"} });
    return;
}
```

> [!NOTE]
> `req.param("missing")` returns `""` (empty string) — it never throws. If you call `std::stoi("")` on a missing param, that will throw `std::invalid_argument`, which you should handle.

---

## Query Parameters

Query parameters are the `?key=value&...` pairs in the URL.

```cpp
app.get("/users", [](const alfi::Request& req, alfi::Response& res) {
    std::string page  = req.query("page");   // "1" or "" if absent
    std::string limit = req.query("limit");  // "10" or "" if absent

    int p = page.empty()  ? 1  : std::stoi(page);
    int l = limit.empty() ? 10 : std::stoi(limit);

    res.json({ {"page", p}, {"limit", l} });
});
```

- `GET /users?page=2&limit=5` → `page="2"`, `limit="5"`
- `GET /users` → `page=""`, `limit=""`

> [!NOTE]
> `req.query("missing")` always returns `""` — it never throws or crashes.

---

## Headers

Access any request header case-insensitively using `req.header()`. Alfi normalizes all header keys to lowercase at parse time, so `"Content-Type"` and `"content-type"` are equivalent:

```cpp
app.get("/protected", [](const alfi::Request& req, alfi::Response& res) {
    std::string auth   = req.header("Authorization");
    std::string accept = req.header("Accept");

    if (auth.empty()) {
        res.status(401).json({ {"error", "Unauthorized"} });
        return;
    }

    res.json({ {"message", "Access granted"} });
});
```

You can also access the headers map directly:

```cpp
std::string ct = req.headers["content-type"];
```

> [!NOTE]
> `req.header("missing")` returns `""` — it never throws.

---

## Request Body (JSON)

Use `req.body()` to parse the request body as JSON. It returns an `nlohmann::json` object.

```cpp
app.post("/users", [](const alfi::Request& req, alfi::Response& res) {
    nlohmann::json body = req.body();

    if (!body.contains("name") || !body.contains("email")) {
        res.status(400).json({ {"error", "name and email are required"} });
        return;
    }

    std::string name  = body["name"].get<std::string>();
    std::string email = body["email"].get<std::string>();

    // process...
    res.status(201).json({ {"name", name}, {"email", email} });
});
```

### Body Parsing Rules

`req.body()` enforces a strict contract:

| Scenario | Behaviour |
|---|---|
| Empty body (`rawBody` is `""`) | Returns `{}` (empty JSON object) — no error |
| Non-empty body, no `Content-Type` header | Throws `alfi::BadContentTypeException` |
| Non-empty body, wrong `Content-Type` (not `application/json`) | Throws `alfi::BadContentTypeException` |
| Valid JSON with correct `Content-Type` | Returns parsed `nlohmann::json` |
| Malformed JSON with correct `Content-Type` | Throws `alfi::JsonParseException` |

> [!IMPORTANT]
> Always wrap `req.body()` in a try/catch when building production handlers, or let Alfi's global exception handler catch it and return a 500.

```cpp
try {
    auto body = req.body();
    // use body...
} catch (const alfi::BadContentTypeException& e) {
    res.status(415).json({ {"error", e.what()} });
} catch (const alfi::JsonParseException& e) {
    res.status(400).json({ {"error", e.what()} });
}
```

---

## Raw Body

If you need the raw request body string (e.g., for non-JSON payloads or custom parsing), access `req.rawBody` directly:

```cpp
std::string raw = req.rawBody;
```

---

## Full Example

```cpp
app.post("/api/v1/users", [](const alfi::Request& req, alfi::Response& res) {
    // Headers
    std::string contentType = req.header("content-type");

    // Body
    nlohmann::json body = req.body();

    // Validation
    if (!body.contains("name") || !body.contains("email")) {
        res.status(400).json({
            {"error", {{"status", 400}, {"message", "name and email are required"}}}
        });
        return;
    }

    std::string name  = body["name"].get<std::string>();
    std::string email = body["email"].get<std::string>();

    res.status(201).json({ {"name", name}, {"email", email} });
});
```

![Request flow diagram](https://assets.alfi.dev/docs/request-flow.png)
