<p align="center">
  <img src="icon.svg" alt="n8n Logo" width="21%">
</p>

# n8n on StartOS

> **Upstream docs:** <https://docs.n8n.io/>
>
> Everything not listed in this document should behave the same as upstream
> n8n. If a feature, setting, or behavior is not mentioned here,
> the upstream documentation is accurate and fully applicable.

[n8n](https://github.com/n8n-io/n8n) is a fair-code workflow automation platform that lets you build complex automations with a visual editor. Connect hundreds of apps, transform data, and automate tasks with a self-hosted, privacy-respecting solution.

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Configuration Management](#configuration-management)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Actions (StartOS UI)](#actions-startos-ui)
- [Backups and Restore](#backups-and-restore)
- [Health Checks](#health-checks)
- [Dependencies](#dependencies)
- [Limitations and Differences](#limitations-and-differences)
- [What Is Unchanged from Upstream](#what-is-unchanged-from-upstream)
- [Contributing](#contributing)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

- **Image source:** Upstream unmodified `docker.n8n.io/n8nio/n8n`
- **Architectures:** x86_64, aarch64
- **Entrypoint:** Default upstream entrypoint via `sdk.useEntrypoint()` (tini + docker-entrypoint.sh)

---

## Volume and Data Layout

- Single volume `main` mounted at `/home/node/.n8n` inside the container
- **SQLite database** at `/home/node/.n8n/database.sqlite` (WAL mode enabled via `DB_SQLITE_POOL_SIZE=5`)
- **Encryption key** stored in StartOS-managed `store.json` on the `main` volume and passed via `N8N_ENCRYPTION_KEY`
- **StartOS-specific files:** `store.json` (encryption key, primary URL, SMTP config)
- No external database container -- embedded SQLite only

---

## Installation and First-Run Flow

1. On install, a **critical task** is created prompting you to run the **Set Primary URL** action. This must be completed before webhooks work correctly, as n8n uses the primary URL to generate webhook addresses.
2. An **important task** reminds you to open the n8n Web UI and complete the **owner-account setup wizard** on first visit. n8n's own setup wizard runs in the browser -- no admin account is pre-seeded.
3. A random 32-character **encryption key** is auto-generated and persisted in `store.json`. This key encrypts all stored credentials. It is included in StartOS backups automatically.

---

## Configuration Management

| StartOS-Managed | Upstream-Managed |
|---|---|
| Primary URL -> WEBHOOK_URL, N8N_EDITOR_BASE_URL, N8N_HOST, N8N_PROTOCOL, N8N_SECURE_COOKIE | Workflows, credentials, users, MFA settings |
| SMTP (via Manage SMTP action) -> N8N_EMAIL_MODE, N8N_SMTP_* | All other in-app settings |
| Encryption key (auto-generated) -> N8N_ENCRYPTION_KEY | Community nodes (installed via UI) |
| Privacy-hardened defaults (telemetry, templates, version notifications all disabled) | Execution data pruning settings |

---

## Network Access and Interfaces

Two interfaces on port 5678, both available via LAN, .onion, and clearnet:

| Interface | ID | Type | Description |
|---|---|---|---|
| Web UI | `ui` | ui | n8n workflow editor and dashboard |
| REST API & Webhooks | `api` | api | Programmatic access and webhook endpoints for external services |

---

## Actions (StartOS UI)

- **Complete Owner Account Setup** -- Reminds you to open the Web UI and finish n8n's first-run owner-account wizard. Paired with the install-time task. Visibility: enabled. Availability: any status. Input: none. Output: confirmation message.
- **Set Primary URL** -- Choose the hostname n8n uses for webhooks. Visibility: enabled. Availability: any status. Input: URL select. Output: confirmation.
- **Manage SMTP** -- Configure email (disabled/system/custom). Visibility: enabled. Availability: any status. Input: SMTP form. Output: confirmation.
- **Reset User Management** -- Recover from forgotten owner password by returning to setup wizard state. Visibility: enabled. Availability: only stopped. Input: none. Output: confirmation message.
- **Disable MFA for User** -- Recover from lost MFA recovery codes. Visibility: enabled. Availability: only stopped. Input: email address. Output: confirmation.
- **Export Workflows** -- Copy all workflows as JSON inline. Visibility: enabled. Availability: any status. Input: none. Output: copyable JSON string (no file written).
- **Export Credentials** -- Copy all credentials decrypted as JSON inline. Visibility: enabled. Availability: any status. Input: none. Output: masked, copyable JSON string (no file written).
- **Run Security Audit** -- Display security audit findings. Visibility: enabled. Availability: only running. Input: none. Output: copyable text.

---

## Backups and Restore

StartOS backups capture the entire `main` volume, including:

- SQLite database (all workflows, credentials, execution history)
- Encryption key (via `store.json`)
- Binary data and any user-installed community nodes
- All `~/.n8n` contents

On restore, all data is reinstated. The encryption key is part of the backup, so restored credentials decrypt correctly.

---

## Health Checks

- **Endpoint:** TCP port 5678 listening
- **Grace period:** default
- **Success:** "n8n is ready"
- **Failure:** "n8n is not ready"

---

## Dependencies

None.

---

## Limitations and Differences

1. Community Edition only -- no enterprise license key support.
2. SQLite only -- Postgres is supported by upstream but not enabled in this package.
3. Internal task runners only -- external task runners (separate container) not supported.
4. The Export Workflows / Export Credentials actions deliver JSON inline as copyable strings; no file is written to disk for the user to retrieve via file browser.
5. Reset User Management requires the service to be stopped first.
6. SMTP is optional and disabled by default.

---

## What Is Unchanged from Upstream

- All workflow features, node behaviors, and integrations work exactly as upstream.
- Community node installation via the in-app UI works as upstream.
- Webhook routing, REST API, execution engine: unchanged.
- All n8n-managed settings under Settings in the web UI behave as documented upstream.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for build instructions and development setup.

---

## Quick Reference for AI Consumers

```yaml
package_id: n8n
architectures: [x86_64, aarch64]
volumes:
  main: /home/node/.n8n
ports:
  ui: 5678
  api: 5678
dependencies: []
startos_managed_env_vars:
  - N8N_ENCRYPTION_KEY
  - N8N_HOST
  - N8N_PORT
  - N8N_PROTOCOL
  - N8N_SECURE_COOKIE
  - N8N_LISTEN_ADDRESS
  - WEBHOOK_URL
  - N8N_EDITOR_BASE_URL
  - DB_TYPE
  - DB_SQLITE_POOL_SIZE
  - N8N_RUNNERS_ENABLED
  - N8N_REINSTALL_MISSING_PACKAGES
  - N8N_LOG_LEVEL
  - N8N_METRICS
  - N8N_DIAGNOSTICS_ENABLED
  - N8N_VERSION_NOTIFICATIONS_ENABLED
  - N8N_TEMPLATES_ENABLED
  - N8N_PERSONALIZATION_ENABLED
  - GENERIC_TIMEZONE
  - TZ
  - N8N_EMAIL_MODE
  - N8N_SMTP_HOST
  - N8N_SMTP_PORT
  - N8N_SMTP_USER
  - N8N_SMTP_PASS
  - N8N_SMTP_SENDER
  - N8N_SMTP_SSL
actions:
  - complete-setup
  - set-primary-url
  - manage-smtp
  - reset-user-management
  - disable-mfa
  - export-workflows
  - export-credentials
  - security-audit
```
