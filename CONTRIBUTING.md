# Contributing to n8n on StartOS

## Prerequisites

- [start-cli](https://docs.start9.com/latest/developer-guide/sdk/installing-the-sdk)
- [Node.js](https://nodejs.org/) (v18+) and npm
- [Docker](https://docs.docker.com/get-docker/)

## Build

```bash
git clone https://github.com/JesseMarkowitz/n8n-startos.git
cd n8n-startos
npm install
make
```

This produces an `.s9pk` file in the project root.

## Sideload

1. Configure your StartOS host in `~/.startos/config.yaml`:

   ```yaml
   host: http://your-server.local
   ```

2. Run:

   ```bash
   make install
   ```

## Architecture

The package uses the upstream unmodified Docker image `docker.n8n.io/n8nio/n8n` with no custom Dockerfile. All StartOS integration is handled via the `startos/` TypeScript source.

## Project Structure

```
startos/
  manifest/      # Package identity, metadata, Docker image config
  fileModels/    # Zod-typed file models (store.json)
  actions/       # User-triggered actions (Set Primary URL, SMTP, exports, etc.)
  init/          # Initialization logic (install, restore, container rebuild)
  main.ts        # Daemon definition, env vars, health checks
  interfaces.ts  # Network interfaces (Web UI, API)
  backups.ts     # Backup configuration
```
