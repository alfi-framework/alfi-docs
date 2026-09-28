# Writing Database Queries & Transactions

This guide details how to execute parameterized queries, process query results, and manage transactions in Alfi using `nasr-pg`.

---

## 🛡️ Parameterized Queries (Preventing SQL Injection)

`nasr-pg` uses libpq's `PQexecParams` to execute parameterized queries. User input is **never** interpolated into SQL strings. PostgreSQL parameter placeholders use `$1, $2, ...` syntax.

### Parameter Types (`alfi::db::Param`)

Parameters support implicit conversions for common types:
- `bool`
- `int` / `int64_t`
- `double`
- `std::string` / `const char*`
- `alfi::db::Param::null()` (for SQL `NULL`)

---

## 📥 1. SELECT Queries & Fetching Results

`conn->execute(sql, params)` returns an `alfi::db::QueryResult`.

```cpp
// Execute SELECT with parameters
auto result = conn->execute(
    "SELECT id, name, email FROM users WHERE id = $1 AND active = $2;",
    { alfi::db::Param(42), alfi::db::Param(true) }
);

// Iterate through rows
for (const auto& row : result.rows) {
    int64_t id = row[0].asInt();
    std::string name = row[1].asString();
    std::string email = row[2].asString();

    std::cout << "User ID: " << id << ", Name: " << name << ", Email: " << email << std::endl;
}
```

### Accessing Cell Values (`alfi::db::Value`)

Cells in a row are accessed by index (`row[colIndex]`):
- `row[i].asInt()` -> `int64_t`
- `row[i].asString()` -> `std::string`
- `row[i].asBool()` -> `bool`
- `row[i].asDouble()` -> `double`
- `row[i].isNull()` -> `bool`

> [!NOTE]
> `Value` accessors throw `alfi::db::DbError` on type mismatch.

---

## 📤 2. INSERT, UPDATE, & DELETE Queries

For mutation operations (`INSERT`, `UPDATE`, `DELETE`), inspect `result.affectedRows`.

### INSERT with `RETURNING` Clause

```cpp
auto result = conn->execute(
    "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id, name, email;",
    { alfi::db::Param("Alice"), alfi::db::Param("alice@example.com") }
);

if (!result.empty()) {
    int64_t newId = result.rows[0][0].asInt();
    std::cout << "Created user with ID: " << newId << std::endl;
}
```

### UPDATE

```cpp
auto result = conn->execute(
    "UPDATE users SET email = $1 WHERE id = $2;",
    { alfi::db::Param("newemail@example.com"), alfi::db::Param(42) }
);

std::cout << "Rows updated: " << result.affectedRows << std::endl;
```

### DELETE

```cpp
auto result = conn->execute(
    "DELETE FROM users WHERE id = $1;",
    { alfi::db::Param(42) }
);

std::cout << "Rows deleted: " << result.affectedRows << std::endl;
```

---

## 🔄 3. Transaction Management

Use `beginTransaction()`, `commit()`, and `rollback()` for atomic operations.

```cpp
try {
    conn->beginTransaction();

    conn->execute(
        "UPDATE accounts SET balance = balance - $1 WHERE id = $2;",
        { alfi::db::Param(100.0), alfi::db::Param(1) }
    );

    conn->execute(
        "UPDATE accounts SET balance = balance + $1 WHERE id = $2;",
        { alfi::db::Param(100.0), alfi::db::Param(2) }
    );

    conn->commit();
    std::cout << "Transfer successful!" << std::endl;
} catch (const alfi::db::DbError& e) {
    conn->rollback();
    std::cerr << "Transaction failed and rolled back: " << e.what() << std::endl;
}
```

---

## 🏛️ Repository Pattern Example (`UserStore`)

Integrating `nasr-pg` into an HTTP route handler:

```cpp
class UserStore {
private:
    std::shared_ptr<alfi::db::Connection> conn_;

public:
    explicit UserStore(std::shared_ptr<alfi::db::Connection> conn)
        : conn_(std::move(conn)) {}

    std::vector<User> list(int page, int limit) const {
        int64_t offset = static_cast<int64_t>((page - 1) * limit);
        auto result = conn_->execute(
            "SELECT id, name, email FROM users ORDER BY id ASC LIMIT $1 OFFSET $2;",
            { alfi::db::Param(static_cast<int64_t>(limit)), alfi::db::Param(offset) }
        );

        std::vector<User> users;
        for (const auto& row : result.rows) {
            users.push_back({ row[0].asInt(), row[1].asString(), row[2].asString() });
        }
        return users;
    }
};
```