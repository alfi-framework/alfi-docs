# NASR-PG Documentation Overview

Welcome to the documentation for **NASR-PG** (Native Acess & SQL Runtime for PostgreSQL), the official PostgreSQL database driver implementation for the **[Alfi](https://github.com/AbdulKadir-22/Alfi)** C++ HTTP framework.

## Documentation Index

| Document | Content Summary | Target Audience |
|----------|-----------------|-----------------|
| **[USER_GUIDE.md](user-guide)** | Getting started, CMake integration via `FetchContent`, code examples, connection strings, query execution, transaction management. | Application Developers / Library Consumers |
| **[DEVELOPER_GUIDE.md](developer-guide)** | Architecture overview, build system, dependency management, running integration tests, type mapping details, extending the codebase. | Driver Maintainers / Contributors |
| **[CONNECTION_AND_POOLING.md](connection-and-pooling)** | Deep dive into how PostgreSQL connections are established via libpq, connection lifecycle, RAII patterns, and connection pooling analysis. | Developers & System Engineers |
| **[ERROR_HANDLING.md](error-handling)** | Comprehensive list of error handling mechanisms, exception safety guarantees, error classification, and SQLSTATE mapping. | All Developers |

---

## What is NASR-PG?

`NASR-PG` is a lightweight, standalone C++17 driver that bridges the PostgreSQL C library (`libpq`) with the unified database abstraction layer (`alfi::db`) provided by the Alfi framework.

It enables Alfi applications to interact with PostgreSQL databases seamlessly through standard interfaces:
- **`alfi::db::Driver`** — Implemented by `chatterpg::PgDriver`
- **`alfi::db::Connection`** — Implemented by `chatterpg::PgConnection`

### Key Highlights
- **100% Parameterized Execution**: All dynamic SQL queries are executed via `PQexecParams` to eliminate SQL injection vulnerabilities.
- **Strict Exception-Based Error Model**: Converts libpq C-style return status codes and PostgreSQL SQLSTATE codes into `alfi::db::DbError` C++ exceptions.
- **RAII Connection Ownership**: Manages underlying `PGconn*` resources automatically using move-only semantics.
- **Zero Overhead Abstraction**: Direct text-format serialization and parsing without external ORM bloat.
