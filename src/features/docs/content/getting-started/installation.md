# Installation

Alfi is currently built from source using CMake. This guide covers the initial setup required to build the Alfi CLI and make the `alfi` command available in your terminal.

## Requirements

Before installing Alfi, make sure the following tools are available on your system:

* **Git**
* **CMake**
* **C++ compiler with C++20 support**

You can verify your environment with:

```bash
git --version
cmake --version
g++ --version
```

## Clone the Repository

Clone the Alfi repository:

```bash
git clone https://github.com/alfi-framework/alfi.git
```

Then move into the repository:

```bash
cd Alfi
```

## Build Alfi

Configure the project with CMake:

```bash
cmake -B build -S .
```

Then build the project:

```bash
cmake --build build
```

CMake will configure the project, build the Alfi framework, and compile the CLI.

After a successful build, the CLI binary will be located at:

```text
build/cli/alfi
```

## Add Alfi to PATH

To use the `alfi` command from anywhere, add the CLI directory to your `PATH`.

For the current terminal session:

```bash
export PATH="$PATH:/path/to/Alfi/build/cli"
```

For example:

```bash
export PATH="$PATH:$HOME/Code/Alfi/build/cli"
```

If you use Bash and want this change to persist across terminal sessions:

```bash
echo 'export PATH="$PATH:$HOME/Code/Alfi/build/cli"' >> ~/.bashrc
source ~/.bashrc
```

For another shell, add the equivalent `PATH` entry to that shell's configuration file.

## Verify the Installation

Verify that the Alfi CLI is available:

```bash
alfi
```

You should see the CLI help or available commands.

You can also verify the executable being used:

```bash
which alfi
```

It should point to the Alfi CLI you just built.

## Installation Complete

Alfi is now available from your terminal.

The next step is to create your first project:

```bash
alfi new example-project
```

Continue with **[Quick Start](/docs/quick-start.md)** to create and run your first Alfi application.
