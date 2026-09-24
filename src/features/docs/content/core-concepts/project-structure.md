# Project Structure

When you run `alfi new <project-name>`, Alfi scaffolds a clean, minimal project ready to build and run. Here's what gets generated and what each file does.

---

## Generated File Tree

```
my-api/
├── main.cpp
├── CMakeLists.txt
└── app.json
```

![Project structure diagram](https://assets.alfi.dev/docs/project-structure-tree.png)

---

## File-by-File Breakdown

### `main.cpp`

This is your **application entry point**. It contains the `main()` function, where you create an `alfi::App` instance, define your routes, and call `app.listen()` to start the server.

```cpp
#include <alfi/alfi.hpp>

int main() {
    auto config = alfi::loadServerConfig("app.json");

    alfi::App app;

    app.get("/", [](const alfi::Request& req, alfi::Response& res) {
        res.json({ {"message", "Hello from my-api!"} });
    }, "Root", "Default welcome route");

    app.get("/health", [](const alfi::Request& req, alfi::Response& res) {
        res.json({ {"status", "ok"} });
    }, "Health check", "Returns service health status");

    app.listen(config.port);
}
```

**What happens here:**
1. The server configuration is loaded from `app.json`.
2. An `alfi::App` instance is created — this is your server.
3. Routes are registered on the app.
4. `app.listen()` binds the server to the configured port and starts accepting connections.

---

### `CMakeLists.txt`

The build configuration file for your project using **CMake**. It links your application against the Alfi library, which is fetched automatically via CMake's `FetchContent` if not already present locally.

```cmake
cmake_minimum_required(VERSION 3.14)
project(my-api VERSION 0.1.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Alfi is pulled in automatically
FetchContent_Declare(
    alfi
    GIT_REPOSITORY https://github.com/AbdulKadir-22/Alfi.git
    GIT_TAG        main
    GIT_SHALLOW    TRUE
)
FetchContent_MakeAvailable(alfi)

add_executable(app main.cpp)
target_link_libraries(app PRIVATE alfi)
```

> [!NOTE]
> If you have Alfi installed locally or available via the `ALFI_PATH` environment variable, CMake will prefer that over fetching from GitHub — making local development fast.

---

### `app.json`

The **server configuration file**. It controls the host, port, and optionally the database connection your app uses. Alfi reads this file at startup via `alfi::loadServerConfig("app.json")`.

```json
{
  "host": "0.0.0.0",
  "port": 2804,
  "env": "development"
}
```

| Field  | Type   | Default       | Description                          |
|--------|--------|---------------|--------------------------------------|
| `host` | string | `"127.0.0.1"` | The host address to bind to          |
| `port` | int    | `2804`        | The port the server listens on       |
| `env`  | string | —             | Optional environment tag (informational) |

> [!TIP]
> You can also configure a database connection in `app.json`:
> ```json
> {
>   "host": "0.0.0.0",
>   "port": 2804,
>   "database": {
>     "driver": "postgres",
>     "dsn": "host=localhost dbname=mydb user=postgres password=secret"
>   }
> }
> ```

---

## Running Your Project

After scaffolding, build and run your app in three steps:

```bash
cd my-api
mkdir build && cd build
cmake ..
make
./app
```

Or use the Alfi CLI shorthand:

```bash
cd my-api
alfi run
```

Your API will be live at `http://localhost:2804` by default.

![Project running in terminal](https://assets.alfi.dev/docs/project-running.png)

---

## What Comes Next

As your project grows, you'll typically add more files alongside these three:

```
my-api/
├── main.cpp          ← routes & app setup
├── CMakeLists.txt    ← build config
├── app.json          ← server config
├── models/           ← .alfi model files (optional)
│   └── user.alfi
└── handlers/         ← route handler logic (optional, user-created)
    └── user_handler.cpp
```

> [!NOTE]
> The `models/` directory and `.alfi` files are used with Alfi's optional **modelgen** tool, which generates C++ structs and JSON serialization code from a declarative DSL. This is not required for basic API development.
