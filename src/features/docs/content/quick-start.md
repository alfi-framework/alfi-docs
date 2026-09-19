# Quick Start

Get up and running with your first Alfi HTTP server in under 5 minutes.

## Project Structure

Set up a standard C++ project directory:

```bash
<!-- TODO: replace with real Alfi API -->
mkdir my-alfi-service && cd my-alfi-service
touch main.cpp CMakeLists.txt
```

## Creating `main.cpp`

```cpp
<!-- TODO: replace with real Alfi API -->
#include <iostream>

int main() {
    // TODO: replace with real Alfi API server startup & route handler
    std::cout << "Alfi Quick Start Application Running on port 8080..." << std::endl;
    return 0;
}
```

## Configuring `CMakeLists.txt`

```cmake
<!-- TODO: replace with real Alfi API -->
cmake_minimum_required(VERSION 3.20)
project(my_alfi_service CXX)

set(CMAKE_CXX_STANDARD 20)

# TODO: replace with real Alfi CMake target linkage
add_executable(my_alfi_service main.cpp)
```

## Build & Launch

Execute the build pipeline from your terminal:

```bash
<!-- TODO: replace with real Alfi API -->
cmake -B build
cmake --build build
./build/my_alfi_service
```

Test the response payload:

```json
<!-- TODO: replace with real Alfi API -->
{
  "status": "ok",
  "framework": "Alfi C++",
  "version": "0.1.0"
}
```

Next step: Deep dive into [Routing](/docs/routing) to define API endpoints.
