# Introduction

Alfi is a modern C++ framework for building HTTP APIs and web services with minimal boilerplate and a focus on a simple developer experience.

Alfi provides the core building blocks needed to create an HTTP application, including routing, request and response handling, JSON responses, application configuration, and automatic API documentation.

## What is Alfi?

Alfi is designed to keep your application code focused on the API you are building rather than the underlying HTTP and server implementation.

With Alfi, you can:

* Create HTTP applications with C++
* Define routes using a simple API
* Handle incoming requests and responses
* Work with JSON
* Organize routes into groups
* Configure your application through `app.json`
* Automatically expose OpenAPI documentation and Swagger UI
* Create and run projects through the `alfi` CLI

## Your First Alfi Project

The easiest way to start an Alfi application is through the `alfi` CLI.

Create a new project:

```bash
alfi new example-project
```

Move into the project:

```bash
cd example-project
```

Then build and run it:

```bash
alfi run
```

The CLI configures the project, builds the application, and starts the server.

Once the application is running, you should see output similar to:

```text
Server running at http://127.0.0.1:2804/
Swagger UI available at http://127.0.0.1:2804/docs
```

You now have a running Alfi application.

## A Minimal Alfi Application

A newly created project includes a starter application:

```cpp
#include <alfi/alfi.hpp>

int main() {
    auto config = alfi::loadServerConfig("app.json");

    alfi::App app;

    app.get("/health", [](const alfi::Request& req, alfi::Response& res) {
        (void)req;
        res.json({ {"status", "ok"} });
    }, "Health check", "Returns service health status");

    app.listen(config.port);
}
```

Even this small application demonstrates the basic structure of an Alfi server:

* `alfi::App` represents the application.
* `app.get()` registers an HTTP GET route.
* `alfi::Request` provides information about the incoming request.
* `alfi::Response` is used to construct the response.
* `res.json()` returns a JSON response.
* `app.listen()` starts the server.

Alfi also provides API documentation for the application through `/docs`.

## Where to Go Next

The **Getting Started** section introduces Alfi step by step:

1. **Installation** — Set up Alfi on your system.
2. **Quick Start** — Create and run your first application.
3. **New Project** — Understand what `alfi new` generates and how to work with your project.

If you haven't installed Alfi yet, continue with **[Installation](/docs/installation)**.

If Alfi is already installed, continue with **[Quick Start](/docs/quick-start)**.
