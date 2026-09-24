# HTTP Methods

HTTP methods (also called HTTP verbs) define the **intended action** of a request against a resource. Alfi supports the five most common methods used in REST API design, each with a dedicated method on `alfi::App` and `alfi::RouteGroup`.

---

## Overview

| Method   | Alfi Method  | Typical Meaning                        | Request Body? | Idempotent? |
|----------|-------------|----------------------------------------|---------------|-------------|
| GET      | `app.get()`  | Read / retrieve a resource             | No            | Yes         |
| POST     | `app.post()` | Create a new resource                  | Yes           | No          |
| PUT      | `app.put()`  | Replace a resource completely          | Yes           | Yes         |
| PATCH    | `app.patch()`| Partially update a resource            | Yes           | No          |
| DELETE   | `app.del()`  | Delete a resource                      | Rarely        | Yes         |

> [!NOTE]
> **Idempotent** means that making the same request multiple times has the same effect as making it once. GET, PUT, and DELETE are idempotent; POST and PATCH are not.

---

## GET

Use `GET` to **read** data. GET requests should not modify any server state and should not have a request body.

```cpp
// List all users
app.get("/users", [](const alfi::Request& req, alfi::Response& res) {
    res.json({ {"users", nlohmann::json::array()} });
});

// Get a specific user by ID
app.get("/users/:id", [](const alfi::Request& req, alfi::Response& res) {
    std::string id = req.param("id");
    res.json({ {"id", id}, {"name", "Alice"} });
});
```

**Common response codes:**
- `200 OK` — resource found and returned
- `404 Not Found` — resource doesn't exist

---

## POST

Use `POST` to **create** a new resource. The request body contains the data for the resource to be created.

```cpp
app.post("/users", [](const alfi::Request& req, alfi::Response& res) {
    auto body = req.body();

    if (!body.contains("name") || !body.contains("email")) {
        res.status(400).json({
            {"error", {{"status", 400}, {"message", "name and email are required"}}}
        });
        return;
    }

    // ... create user in database ...

    res.status(201)
       .header("Location", "/users/42")
       .json({ {"id", 42}, {"name", body["name"]}, {"email", body["email"]} });
});
```

**Common response codes:**
- `201 Created` — resource created successfully
- `400 Bad Request` — invalid or missing input
- `409 Conflict` — resource already exists

> [!TIP]
> Return a `Location` header pointing to the new resource URL. This follows REST conventions and makes it easy for clients to navigate to the created resource.

---

## PUT

Use `PUT` to **completely replace** an existing resource. The request body must contain the full, updated representation — any fields not included are treated as absent/null.

```cpp
app.put("/users/:id", [](const alfi::Request& req, alfi::Response& res) {
    int id = std::stoi(req.param("id"));
    auto body = req.body();

    // PUT requires all fields — it's a full replacement
    if (!body.contains("name") || !body.contains("email")) {
        res.status(400).json({
            {"error", {{"status", 400}, {"message", "PUT requires both name and email"}}}
        });
        return;
    }

    // ... replace user in database ...

    res.json({ {"status", "updated"}, {"id", id} });
});
```

**Common response codes:**
- `200 OK` — replaced successfully
- `400 Bad Request` — incomplete body
- `404 Not Found` — user to replace doesn't exist

---

## PATCH

Use `PATCH` to **partially update** a resource. Unlike PUT, the client only sends the fields they want to change — everything else stays the same.

```cpp
app.patch("/users/:id", [](const alfi::Request& req, alfi::Response& res) {
    int id = std::stoi(req.param("id"));
    auto body = req.body();

    // Only apply fields that are present in the body
    std::optional<std::string> nameOpt;
    std::optional<std::string> emailOpt;

    if (body.contains("name"))  nameOpt  = body["name"].get<std::string>();
    if (body.contains("email")) emailOpt = body["email"].get<std::string>();

    // ... partial update in database ...

    res.json({ {"status", "patched"}, {"id", id} });
});
```

**Common response codes:**
- `200 OK` — updated successfully
- `400 Bad Request` — invalid fields
- `404 Not Found` — resource doesn't exist

> [!NOTE]
> **PUT vs PATCH:** If a client sends `PUT /users/1` with only `{"name": "Alice"}`, the email field would be erased. With `PATCH /users/1 {"name": "Alice"}`, only the name is updated and the email is left unchanged.

---

## DELETE

Use `DELETE` to **remove** a resource. DELETE requests typically don't have a request body.

```cpp
app.del("/users/:id", [](const alfi::Request& req, alfi::Response& res) {
    int id;
    try {
        id = std::stoi(req.param("id"));
    } catch (...) {
        res.status(400).json({
            {"error", {{"status", 400}, {"message", "Invalid user ID"}}}
        });
        return;
    }

    // ... delete from database ...
    bool removed = true; // result of delete operation

    if (removed) {
        res.status(200).json({ {"status", "deleted"}, {"id", id} });
    } else {
        res.status(404).json({
            {"error", {{"status", 404}, {"message", "User not found"}}}
        });
    }
});
```

**Common response codes:**
- `200 OK` — deleted, with a confirmation body
- `204 No Content` — deleted, with no body
- `404 Not Found` — resource to delete doesn't exist

---

## Method Not Allowed (405)

If a request comes in for a path that exists but using a method that isn't registered for it, Alfi automatically returns:

```http
HTTP/1.1 405 Method Not Allowed
```

You don't need to write any special handling for this — Alfi distinguishes 404 (path unknown) from 405 (path known, method not supported) automatically.

---

## Full CRUD Example

Here's a complete set of routes for a `/users` resource:

```cpp
auto api = app.group("/api/v1");

// List all users
api.get("/users", listUsersHandler, "List Users", "Returns paginated users");

// Create a user
api.post("/users", createUserHandler, "Create User", "Creates a new user");

// Get a specific user
api.get("/users/:id", getUserHandler, "Get User", "Returns user by ID");

// Replace a user
api.put("/users/:id", replaceUserHandler, "Replace User", "Full user replacement");

// Partially update a user
api.patch("/users/:id", patchUserHandler, "Patch User", "Partial user update");

// Delete a user
api.del("/users/:id", deleteUserHandler, "Delete User", "Deletes user by ID");
```

![HTTP methods CRUD diagram](https://assets.alfi.dev/docs/http-methods-crud.png)
