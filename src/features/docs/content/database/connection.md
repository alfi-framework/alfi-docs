# Database Connections & Architecture

This guide covers the Alfi database layer architecture, driver registration, connection setup, and CMake integration for `nasr-pg` (the PostgreSQL driver).

---

## 🏗️ Architecture & Core Components

```
+-------------------------------------------------------------+
|                      Alfi Application                       |
|               (Routes, Controllers, Handlers)               |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|                   alfi::db::DriverRegistry                  |
|          Global registry managing process-wide drivers      |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|                       nasrpg::PgDriver                      |
|           Implements alfi::db::Driver for PostgreSQL        |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|                     nasrpg::PgConnection                    |
|       Implements alfi::db::Connection (RAII PQconn*)        |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|                    PostgreSQL Database                      |
+-------------------------------------------------------------+
```

### 1. `alfi::db::Driver` & `nasrpg::PgDriver`
- `alfi::db::Driver` is an abstract base class defining the `connect(const std::string& dsn)` interface.
- `nasrpg::PgDriver` implements `alfi::db::Driver` for PostgreSQL using libpq's `PQconnectdb`.

### 2. `alfi::db::DriverRegistry`
- Process-wide thread-safe singleton registry.
- Maps driver names (e.g., `"postgres"`) to `std::shared_ptr<alfi::db::Driver>`.

### 3. `alfi::db::Connection` & `nasrpg::PgConnection`
- `alfi::db::Connection` is an abstract interface providing:
  - `execute(sql, params)`
  - `beginTransaction()`, `commit()`, `rollback()`
- `nasrpg::PgConnection` wraps an RAII-managed PostgreSQL `PGconn*` pointer and executes parameterized queries using libpq's `PQexecParams`.

### 4. Parameter & Value Mapping (`Param`, `Value`, `QueryResult`)
- **`alfi::db::Param`**: Represents bound parameters for queries (`std::variant<monostate, bool, int64_t, double, std::string>`). Prevents SQL injection.
- **`alfi::db::Value`**: Represents a result row cell. Throws `alfi::db::DbError` on type mismatch.
- **`alfi::db::QueryResult`**: Contains `columns`, `rows`, and `affectedRows`.

---

## 🛠️ Build & CMake Integration

To use `nasr-pg` with Alfi, integrate it in your `CMakeLists.txt` using `FetchContent`:

```cmake
include(FetchContent)

# Fetch nasr-pg database driver
FetchContent_Declare(
    nasr-pg
    GIT_REPOSITORY https://github.com/alfi-framework/nasr-pg.git
    GIT_TAG main
)
FetchContent_MakeAvailable(nasr-pg)

# Link your executable against alfi_core and nasr-pg
target_link_libraries(my_app PRIVATE alfi_core nasr-pg)
```

---

## 🔌 Connection Setup & Driver Registration

`nasr-pg` provides `nasrpg::PgDriver`, which implements the `alfi::db::Driver` interface.

### Step 1: Include Headers

Include the umbrella header:

```cpp
#include <nasrpg/nasrpg.hpp>
#include <alfi/db/driver_registry.hpp>
#include <alfi/db/db_error.hpp>
```

### Step 2: Register the Driver

Register `PgDriver` with `alfi::db::DriverRegistry` under the name `"postgres"`:

```cpp
// Register driver in global registry
auto pgDriver = std::make_shared<nasrpg::PgDriver>();
alfi::db::DriverRegistry::registerDriver(pgDriver);
```

### Step 3: Open a Connection

Retrieve the driver and establish a connection using a libpq-compatible Data Source Name (DSN):

```cpp
try {
    auto driver = alfi::db::DriverRegistry::get("postgres");

    // Connect using PostgreSQL URI or key-value DSN
    std::string dsn = "postgres://postgres:password@localhost:5432/my_database";
    std::shared_ptr<alfi::db::Connection> conn = driver->connect(dsn);

    // Connection is now ready for use
} catch (const alfi::db::DbError& e) {
    std::cerr << "Failed to connect to database: " << e.what() << std::endl;
}
```

---

## 🔑 DSN Format Support

`nasr-pg` delegates connection handling to PostgreSQL `libpq`. Supported DSN formats include:

1. **URI Format**:
   ```
   postgres://username:password@hostname:port/database_name
   ```
2. **Key-Value String Format**:
   ```
   host=localhost port=5432 dbname=my_database user=postgres password=secret
   ```

---

## ⚙️ Connection Lifetime & Thread Safety

- **RAII Ownership**: `nasrpg::PgConnection` owns the underlying `PGconn*` handle. When the `PgConnection` object is destroyed, `PQfinish` is automatically called.
- **Move-Only**: `PgConnection` is non-copyable and move-only.
- **Shared Pointer Usage**: Pass `std::shared_ptr<alfi::db::Connection>` across store repositories (such as `UserStore`) or app routes.
- **Error Handling**: Connection failures throw `alfi::db::DbError` containing descriptive libpq error output.

---

