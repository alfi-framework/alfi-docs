# Built-in Middleware

Alfi comes with out-of-the-box, production-ready built-in middleware for logging and Cross-Origin Resource Sharing (CORS).

---

## 1. Logger Middleware

Header file: `<alfi/middleware/logger.hpp>`

The Logger middleware logs HTTP request details (method, path) and response details (HTTP status code, execution duration) to an output stream.

<!-- PLACEHOLDER: Image showing Logger Middleware Output Format in Terminal -->
![Logger Middleware Output Placeholder](docs/images/logger_middleware_output.png)

### Quick Start (Default stdout Logger)

Use `alfi::logger` to write log outputs directly to `std::cout`:

```cpp
#include <alfi/app.hpp>
#include <alfi/middleware/logger.hpp>

int main() {
    alfi::App app;

    // Attach default logger globally
    app.use(alfi::logger);

    app.get("/ping", [](const alfi::Request& req, alfi::Response& res) {
        res.text("pong");
    });

    app.listen(8080);
}
```

### Custom Output Stream Logger (`make_logger`)

If you want to direct logs to a custom file stream, stringstream (for unit testing), or custom log sink, use `alfi::make_logger(std::ostream& sink)`:

```cpp
#include <alfi/app.hpp>
#include <alfi/middleware/logger.hpp>
#include <fstream>

int main() {
    alfi::App app;

    static std::ofstream logFile("server.log", std::ios::app);
    
    // Direct logger output to server.log file
    app.use(alfi::make_logger(logFile));

    app.listen(8080);
}
```

---

## 2. CORS Middleware

Header file: `<alfi/middleware/cors.hpp>`

Cross-Origin Resource Sharing (CORS) middleware manages HTTP headers required for cross-domain browser interactions and automatically responds to preflight `OPTIONS` requests.

<!-- PLACEHOLDER: Image showing CORS Preflight & Request Flow -->
![CORS Execution Flow Placeholder](docs/images/cors_middleware_flow.png)

### Quick Start (Default CORS Configuration)

The default `alfi::cors` middleware allows all origins (`*`) and standard HTTP methods:

```cpp
#include <alfi/app.hpp>
#include <alfi/middleware/cors.hpp>

int main() {
    alfi::App app;

    // Enable default permissive CORS globally
    app.use(alfi::cors);

    app.get("/api/data", [](const alfi::Request& req, alfi::Response& res) {
        res.json({{"status", "success"}});
    });

    app.listen(8080);
}
```

### Custom CORS Configuration (`make_cors`)

For strict production environments, configure specific origins, allowed headers, credentials, and max-age settings using `CorsOptions`:

```cpp
#include <alfi/app.hpp>
#include <alfi/middleware/cors.hpp>

int main() {
    alfi::App app;

    alfi::CorsOptions options;
    options.origins = {"https://example.com", "https://app.example.com"};
    options.methods = {"GET", "POST", "PUT", "DELETE"};
    options.allowedHeaders = {"Content-Type", "Authorization", "X-Custom-Header"};
    options.exposedHeaders = {"X-Request-ID"};
    options.credentials = true;
    options.maxAgeSeconds = 3600;

    // Attach custom CORS configuration
    app.use(alfi::make_cors(options));

    app.listen(8080);
}
```

### `CorsOptions` Property Reference

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `origins` | `std::vector<std::string>` | `{"*"}` | Allowed origin URLs. |
| `methods` | `std::vector<std::string>` | `{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"}` | Allowed HTTP methods. |
| `allowedHeaders` | `std::vector<std::string>` | `{}` | Allowed request headers. If empty, reflects `Access-Control-Request-Headers`. |
| `exposedHeaders` | `std::vector<std::string>` | `{}` | Response headers exposed to browser scripts. |
| `credentials` | `bool` | `false` | Sets `Access-Control-Allow-Credentials: true`. |
| `maxAgeSeconds` | `int` | `600` | Sets `Access-Control-Max-Age` header for preflight caching. |

> **Validation Note**: Passing `origins = {"*"}` while `credentials = true` will throw `std::invalid_argument` as required by the CORS specification.
