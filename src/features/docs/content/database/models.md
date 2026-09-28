# Model Creation & Code Generation in Alfi

This document explains how **`.alfi` model creation** works, how models are parsed and generated into native C++ structures, and the **Alfi CLI commands** available for model generation and driver installation.

---

## Table of Contents

1. [Overview & Architecture](#1-overview--architecture)
2. [The `.alfi` DSL Syntax & Grammar](#2-the-alfi-dsl-syntax--grammar)
3. [Model Code Generator (`modelgen`)](#3-model-code-generator-modelgen)
4. [Generated C++ Model API](#4-generated-c-model-api)
5. [Alfi CLI Commands](#5-alfi-cli-commands)
6. [End-to-End Usage Example](#6-end-to-end-usage-example)

---

## 1. Overview & Architecture

Alfi utilizes a **build-time code generation tool** (`tools/modelgen` integrated directly into the `alfi` CLI) to process `.alfi` schema files. A single `.alfi` file serves as the single source of truth for:

- Strongly-typed C++ struct definitions.
- Parameterized database query bindings (`toParams()`, `toAllParams()`, `fromRow()`).
- In-memory data mutation and validation pipelines (`mutate()`, `validate()`).
- JSON serialization (`toJson()`, `fromJson()`).

```
+-------------------+        +----------------------+        +-----------------------+
|   user.alfi       |  --->  |  alfi generate CLI   |  --->  |   user.hpp (C++ Struct|
| (Model Definition)|        | (Lexer/Parser/AST)   |        |   + JSON + DB Params) |
+-------------------+        +----------------------+        +-----------------------+
                                                                         |
                                                                         v
                                                             +-----------------------+
                                                             | alfi::db::Connection  |
                                                             | (nasr-pg / Postgres)  |
                                                             +-----------------------+
```

---

## 2. The `.alfi` DSL Syntax & Grammar

### 2.1 Supported Field Types

- `string`: Maps to `std::string`
- `int`: Maps to `int`
- `int64`: Maps to `int64_t`
- `float`: Maps to `float`
- `double`: Maps to `double`
- `bool`: Maps to `bool`
- `datetime`: Maps to `std::string`

### 2.2 Field Modifiers

| Category | Modifiers | Description |
| :--- | :--- | :--- |
| **Presence** | `required`, `optional` | Defines optionality (`std::optional<T>`) or required checks. |
| **Mutations** | `trim`, `lowercase`, `uppercase` | In-place string transformations applied prior to validation. |
| **Formats** | `email`, `url`, `uuid` | Pattern matching validations. |
| **Constraints** | `min_length(N)`, `max_length(N)`, `range(Min, Max)`, `regex("pattern")` | Structural and numeric constraint checks. |
| **Attributes** | `primary_key`, `unique`, `default(...)` | Model metadata and fallback default values. |

### 2.3 Example `.alfi` Model (`user.alfi`)

```alfi
model User {
    id: int primary_key;
    username: string required lowercase unique min_length(3);
    email: string required lowercase email unique;
    bio: string optional max_length(500);
    is_active: bool default(true);
}
```

---

## 3. Model Code Generator (`modelgen`)

The `tools/modelgen` engine consists of three core components:

1. **Lexer** ([parser.cpp](file:///home/ariont/Code/Experiments/Alfi/tools/modelgen/src/parser.cpp)): Tokenizes `.alfi` text, handling comments (`//`, `/* */`, `(* *)`), identifiers, keywords (`model`, `ref`), strings, and numbers.
2. **Parser** ([parser.cpp](file:///home/ariont/Code/Experiments/Alfi/tools/modelgen/src/parser.cpp)): Builds the Abstract Syntax Tree (AST) representing `ModelDecl`, `FieldDecl`, and `ModifierDecl` objects ([ast.hpp](file:///home/ariont/Code/Experiments/Alfi/tools/modelgen/include/modelgen/ast.hpp)).
3. **Code Generator** ([codegen.cpp](file:///home/ariont/Code/Experiments/Alfi/tools/modelgen/src/codegen.cpp)): Emits standalone C++ header files (`.hpp`) containing the model struct, helper functions, and serialization/validation logic.

---

## 4. Generated C++ Model API

When `alfi generate` runs, it generates a header file containing a C++ struct with the following capabilities:

```cpp
struct User {
    int id{0};
    std::string username;
    std::string email;
    std::optional<std::string> bio{std::nullopt};
    bool is_active{true};

    // 1. Mutate: Applies lowercase/trim transformations in-place
    void mutate();

    // 2. Validate: Executes presence, format, and constraint validations
    ValidationResult validate() const;

    // 3. JSON Serialization: Converts struct to and from nlohmann::json
    nlohmann::json toJson() const;
    static User fromJson(const nlohmann::json& j);

    // 4. Database Parameterization: Converts fields into alfi::db::Param vectors
    std::vector<alfi::db::Param> toParams() const;    // Excludes primary key (for INSERT)
    std::vector<alfi::db::Param> toAllParams() const; // Includes all fields

    // 5. Database Row Deserialization: Maps query result values into struct fields
    static User fromRow(const std::vector<alfi::db::Value>& row);
};
```

---

## 5. Alfi CLI Commands

The `alfi` CLI utility provides direct commands for project management, driver installation, model generation, and running applications:

### 5.1 `alfi generate [dir]`
Generates C++ header models from `.alfi` schema files.

```bash
# Generate models from the default "models" directory (or current dir)
alfi generate

# Generate models from a custom directory
alfi generate schemas/
```

- **Behavior**: Finds all `.alfi` files in the specified directory, parses them, and writes `<model_name>.hpp` output files.

### 5.2 `alfi install <driver>`
Installs and configures a database driver (such as `nasr-pg` for PostgreSQL) into an Alfi project.

```bash
alfi install nasr-pg
```

- **Automated Actions**:
  1. Updates `CMakeLists.txt`: Adds `FetchContent` declarations for the `nasr-pg` driver.
  2. Updates `app.json`: Adds database configuration settings (`driver` and `dsn`).
  3. Updates `main.cpp`: Injects driver registration (`alfi::db::DriverRegistry::registerDriver(...)`) and initializes database connection startup logic.

### 5.3 `alfi new <project-name>`
Scaffolds a new Alfi C++ web application project with pre-configured directory layouts and build system files.

### 5.4 `alfi run`
Builds and runs the current Alfi project.

---

## 6. End-to-End Usage Example

1. **Define Schema (`models/user.alfi`)**:
   ```alfi
   model User {
       id: int primary_key;
       username: string required lowercase min_length(3);
       email: string required lowercase email;
   }
   ```

2. **Generate C++ Header**:
   ```bash
   alfi generate models
   # Produces models/user.hpp
   ```

3. **Install Database Driver**:
   ```bash
   alfi install nasr-pg
   ```

4. **Use in Route Handlers**:
   ```cpp
   #include "models/user.hpp"

   app.post("/users", [&dbConn](const alfi::Request& req, alfi::Response& res) {
       auto bodyJson = nlohmann::json::parse(req.body());
       User u = User::fromJson(bodyJson);

       auto validation = u.validate();
       if (!validation.valid) {
           res.status(400).json({{"error", "Validation failed"}});
           return;
       }

       dbConn->execute("INSERT INTO users (username, email) VALUES ($1, $2)", u.toParams());
       res.status(201).json(u.toJson());
   });
   ```

---

## Related Documentation

- [Database Connections & Architecture](/docs/database/connection) — Driver registry, connection setup, DSN formats, CMake integration.
- [Executing Queries & Transactions](/docs/database/queries) — SELECT, INSERT, UPDATE, DELETE, parameter binding, transactions.