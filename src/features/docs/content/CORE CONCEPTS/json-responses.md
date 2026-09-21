# JSON Responses

Alfi is built for API development, and JSON is its native output format. The `res.json()` method is the primary way to respond to requests, and Alfi uses [nlohmann/json](https://github.com/nlohmann/json) as its JSON library throughout.

---

## Sending a JSON Response

```cpp
app.get("/users/1", [](const alfi::Request& req, alfi::Response& res) {
    res.json({
        {"id", 1},
        {"name", "Alice"},
        {"email", "alice@example.com"}
    });
});
```

`res.json()` does two things automatically:
1. Sets the `Content-Type: application/json` header
2. Serializes the `nlohmann::json` value and writes it as the response body

---

## Constructing JSON Objects

Alfi uses `nlohmann::json`, which has excellent support for C++ initializer lists:

```cpp
// Simple key-value object
res.json({ {"status", "ok"} });

// Nested object
res.json({
    {"user", {
        {"id", 42},
        {"name", "Bob"}
    }}
});

// With arrays
res.json({
    {"page", 1},
    {"users", nlohmann::json::array({
        { {"id", 1}, {"name", "Alice"} },
        { {"id", 2}, {"name", "Bob"} }
    })}
});
```

---

## Building JSON from Variables

```cpp
int id       = 1;
std::string name  = "Alice";
std::string email = "alice@example.com";

nlohmann::json user;
user["id"]    = id;
user["name"]  = name;
user["email"] = email;

res.json(user);
```

Or use structured construction:

```cpp
nlohmann::json user = {
    {"id",    id},
    {"name",  name},
    {"email", email}
};
res.json(user);
```

---

## JSON Arrays

```cpp
nlohmann::json list = nlohmann::json::array();
list.push_back({ {"id", 1}, {"name", "Alice"} });
list.push_back({ {"id", 2}, {"name", "Bob"} });

res.json({
    {"users", list},
    {"total", list.size()}
});
```

---

## Standard API Response Patterns

### Success — single resource

```json
{
  "id": 1,
  "name": "Alice",
  "email": "alice@example.com",
  "created_at": "2026-01-01T00:00:00Z"
}
```

```cpp
res.json({
    {"id", 1},
    {"name", "Alice"},
    {"email", "alice@example.com"}
});
```

---

### Success — paginated list

```json
{
  "page": 1,
  "limit": 10,
  "total": 42,
  "users": [
    {"id": 1, "name": "Alice"},
    {"id": 2, "name": "Bob"}
  ]
}
```

```cpp
res.json({
    {"page",  page},
    {"limit", limit},
    {"total", total},
    {"users", usersJson}
});
```

---

### Success — creation

```cpp
res.status(201)
   .header("Location", "/api/v1/users/1")
   .json({
       {"id",    1},
       {"name",  "Alice"},
       {"email", "alice@example.com"}
   });
```

---

### Error — structured error body

Alfi has a built-in `res.error()` helper that produces a consistent error shape:

```cpp
res.error(404, "User not found");
```

Output:

```json
{
  "error": {
    "status": 404,
    "message": "User not found"
  }
}
```

You can also build the same structure manually for consistency:

```cpp
res.status(400).json({
    {"error", {
        {"status", 400},
        {"message", "name and email are required"}
    }}
});
```

---

## Reading JSON from the Request

Use `req.body()` to parse an incoming JSON request body:

```cpp
app.post("/users", [](const alfi::Request& req, alfi::Response& res) {
    nlohmann::json body = req.body();

    std::string name  = body["name"].get<std::string>();
    std::string email = body["email"].get<std::string>();

    res.status(201).json({ {"name", name}, {"email", email} });
});
```

> [!IMPORTANT]
> `req.body()` validates the `Content-Type: application/json` header before parsing. Requests with a non-empty body and the wrong (or missing) content type will throw `alfi::BadContentTypeException`. See the [Request](./request.md#request-body-json) guide for full details.

---

## Working with nlohmann/json

Since Alfi exposes `nlohmann::json` directly, you have access to the full library:

```cpp
#include <nlohmann/json.hpp>

// Check if a key exists
if (body.contains("name")) { ... }

// Safe access with a default
std::string name = body.value("name", "Unknown");

// Type-checked extraction
int age = body["age"].get<int>();

// Check type
if (body["data"].is_array()) { ... }
if (body["id"].is_number())  { ... }
if (body["name"].is_string()) { ... }
```

---

## Pretty Printing (Debug)

For debugging purposes, you can pretty-print JSON using `dump(indent)`:

```cpp
nlohmann::json j = { {"id", 1}, {"name", "Alice"} };
std::cout << j.dump(2) << std::endl;
```

Output:
```json
{
  "id": 1,
  "name": "Alice"
}
```

> [!NOTE]
> `res.json(j)` always sends compact (non-indented) JSON over the wire for efficiency. Pretty printing is only useful for debugging locally.

---

## Serializing Custom Structs

If you have your own C++ structs, you can serialize them to JSON by defining a `toJson()` method or by using nlohmann's `to_json` ADL hook:

```cpp
struct User {
    int id;
    std::string name;
    std::string email;

    nlohmann::json toJson() const {
        return {
            {"id",    id},
            {"name",  name},
            {"email", email}
        };
    }
};

// In your handler:
User user = { 1, "Alice", "alice@example.com" };
res.json(user.toJson());
```

