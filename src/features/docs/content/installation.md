# Installation

Learn how to fetch, build, and link Alfi into your C++ project using CMake or package managers.

## Requirements

Before installing Alfi, ensure your toolchain meets the following prerequisites:

- **C++ Compiler**: GCC 11+, Clang 13+, or MSVC 2022+ (C++20 standard support required).
- **Build System**: CMake 3.20 or newer.
- **Platforms**: Linux, macOS, or Windows.

## FetchContent (Recommended)

Add the following declaration to your `CMakeLists.txt`:

```cmake
<!-- TODO: replace with real Alfi API -->
include(FetchContent)

FetchContent_Declare(
    alfi
    # TODO: replace with real Alfi repository URL & tag
    GIT_REPOSITORY https://github.com/alfi-cpp/alfi.git
    GIT_TAG        v0.1.0
)
FetchContent_MakeAvailable(alfi)

target_link_libraries(your_target PRIVATE alfi::alfi)
```

## Package Managers

```bash
<!-- TODO: replace with real Alfi API -->
# vcpkg installation placeholder
vcpkg install alfi

# Conan package placeholder
conan install --requires=alfi/0.1.0
```

## Build Configuration Verification

```cmake
<!-- TODO: replace with real Alfi API -->
find_package(alfi REQUIRED)
message(STATUS "Alfi library configured successfully.")
```

Next step: Follow the [Quick Start](/docs/quick-start) guide to launch your first HTTP server.
