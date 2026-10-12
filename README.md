<p align="center">
  <img src="icon.svg" alt="n8n Logo" width="21%">
</p>

# n8n on StartOS

> Everything not listed in this document should behave the same as upstream
> n8n. If a feature, setting, or behavior is not mentioned here, the upstream
> documentation is accurate and fully applicable — see the Documentation
> section of `instructions.md` for links.

[n8n](https://github.com/n8n-io/n8n) is a workflow automation tool: you wire together triggers, apps, and code in a visual editor, and it runs them for you. This package runs it self-hosted against a local SQLite database, with telemetry off and a way back in if you lose the owner password.

- **Upstream repo:** <https://github.com/n8n-io/n8n>
- **Wrapper repo:** <https://github.com/Start9-Community/n8n-startos>

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [File Models](#file-models)
- [Dependencies](#dependencies)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Actions](#actions)
- [Tasks](#tasks)
- [Health Checks](#health-checks)
- [Backups and Restore](#backups-and-restore)
- [Limitations and Differences](#limitations-and-differences)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

One upstream image, consumed unmodified.

| Property      | Value                      |
| ------------- | -------------------------- |
| Image         | `n8nio/n8n`                |
| Architectures | x86_64, aarch64            |
| Command       | The image's own entrypoint |

| Subcontainer | Purpose                                  |
| ------------ | ---------------------------------------- |
| `n8n-sub`    | The only daemon — the one to `attach` to |

One oneshot runs first: the volume arrives owned by root, and the image runs the application as an unprivileged user that has to own its own data directory.

**n8n is not open source.** It ships under the Sustainable Use License, which permits self-hosting for internal business purposes but is not an OSI licence — worth knowing before building a product on top of it.

## Volume and Data Layout

One volume, holding everything.

| Volume | Mount Point | Purpose                 |
| ------ | ----------- | ----------------------- |
| `main` | `/data`     | n8n's whole user folder |

| Path              | Written by  | Holds                                     |
| ----------------- | ----------- | ----------------------------------------- |
| `database.sqlite` | n8n         | Workflows, credentials, executions, users |
| `config`          | n8n         | The encryption key                        |
| `binaryData/`     | n8n         | Files that pass through workflows         |
| `config.json`     | The actions | The SMTP settings and the primary URL     |

**The encryption key is the important file.** Every credential in the database is encrypted with it, and it is generated on first start — so the database alone is not enough to recover anything. Both live on this volume, which is what makes the backup sufficient and also what makes it sensitive.

## File Models

One model, and it covers only what StartOS contributes.

| File          | Format | Modelled                | Written by  |
| ------------- | ------ | ----------------------- | ----------- |
| `config.json` | JSON   | Yes — `FileHelper.json` | The actions |

It holds the SMTP configuration and the primary URL, nothing else: n8n's own settings live in its database and are edited in the interface.

The model is seeded with SMTP disabled at install and merged on every later init, so a field added by a newer version picks up its default rather than being missing. `primaryUrl` is the user's choice from **Set Primary URL** and stays unset until one is made; nothing else writes it.

**Everything else n8n needs is passed as environment**, composed at start: the data directory, the port, the database type and path, the timezone, and the switches described below.

## Dependencies

None.

**But most workflows reach the internet**, since automating an external service means talking to it. n8n itself needs no other package here.

## Network Access and Interfaces

One interface.

| Interface | Id   | Type | Port | Description                             |
| --------- | ---- | ---- | ---- | --------------------------------------- |
| Web UI    | `ui` | ui   | 5678 | The workflow editor and everything else |

Bound on the `ui-multi` MultiHost over HTTP and not masked. **n8n's own login gates it**, and StartOS adds no gate of its own.

**The session cookie's `Secure` flag is deliberately turned off.** StartOS fronts the interface with its own reverse proxy and publishes addresses that a browser does not treat as secure origins; a `Secure` cookie would never be sent back over those, and the symptom would be a login that appears to succeed and then bounces straight back to the login screen.

**n8n is told it sits behind one proxy hop** (`N8N_PROXY_HOPS=1`). The StartOS proxy adds `X-Forwarded-For`; with the hop declared, Express takes the client address from that header, so n8n's per-IP login rate limit applies per client rather than lumping everyone behind the proxy together. Without it, every rate-limited request logs `ERR_ERL_UNEXPECTED_X_FORWARDED_FOR` with a stack trace — noisy, but not a failure: the request still goes through. The session cookie's `Secure` flag comes from `N8N_SECURE_COOKIE`, not from the forwarded protocol, so this setting does not interact with the cookie rule above.

**The URLs n8n hands out are set explicitly, not inferred.** Left alone, n8n composes them from `N8N_PROTOCOL`/`N8N_HOST`/`N8N_PORT`, which behind the StartOS proxy yields `http://localhost:5678` — correct inside the container and meaningless to an external service being handed a webhook, or to someone clicking a password-reset link. The package passes the chosen address as both `N8N_WEBHOOK_URL` and `N8N_EDITOR_BASE_URL`.

`N8N_WEBHOOK_URL` is the current name; the older `WEBHOOK_URL` still works but makes n8n log a deprecation warning on every start. n8n normalizes each itself — appending a trailing slash to the webhook base, stripping one from the editor base — so the same raw address is correct for both.

**`N8N_EDITOR_BASE_URL` reaches past the editor.** `/rest/settings` builds `urlBaseEditor`, `oauthCallbackUrls`, and `jwksUri` from one instance base URL, so the **OAuth Redirect URL** n8n tells you to register with Google, Slack, or any other OAuth provider is the primary URL plus `/rest/oauth2-credential/callback`. An OAuth credential can only be authorized if that address is one the provider can reach.

Which address that is comes from the **Set Primary URL** action. While none is chosen, or the chosen hostname is not one of the interface's addresses, the package passes the preferred published address instead (a public domain, HTTPS first, then `.local`, then the first offered address) without overwriting the choice, and returns to it when it is published again. **Open UI opens the same address**, falling back to StartOS's usual choice when it is not available. **A workflow triggered by an external service still needs an address that service can actually reach**, which remains a StartOS address decision: picking a `.local` address as primary does not make it reachable from the internet.

## Installation and First-Run Flow

Install seeds the configuration with SMTP disabled. No credential is generated here.

**The primary URL is asked for, but nothing waits on it.** Install raises an `important` task to choose it; until then n8n uses the preferred published address described above. The same task comes back whenever the chosen hostname stops being one of the interface's addresses — after a restore onto a different server, for example — and clears when it returns or another is chosen.

**The owner account is created in the interface**, on first visit: n8n asks for an email address and a password, and that account owns the instance. Until it exists, the service is running and reachable but has nothing in it — and the password-reset action has nothing to reset.

The daemon carries a generous grace period, because a first start initializes the database and generates the encryption key before it answers.

## Actions

Three actions.

### Set Primary URL

Chooses which of the published addresses n8n treats as its own.

- **What it changes:** `primaryUrl` in the configuration, which becomes `N8N_WEBHOOK_URL` and `N8N_EDITOR_BASE_URL`.
- **Cost:** the service restarts, since the value becomes environment.
- **Repeat safety:** idempotent, and pre-filled with the current choice, or the preferred published address when there is none. Built by `sdk.setupPrimaryUrl`; the options are read live from the interface, so an address added after install shows up without any further change.
- **Why it matters:** it is what makes a webhook URL copied out of the editor work when an external service calls it, what makes the OAuth Redirect URL n8n asks you to register with a provider a real address, and what makes the link in a password-reset email land somewhere real.

**An already-open editor tab keeps showing the old URL until it is reloaded.** The frontend hydrates `urlBaseWebhook`/`urlBaseEditor` into an in-memory store once at app initialization, guarded by an `initialized` flag, so a live tab never re-fetches them — and its hardcoded client-side fallback is `http://localhost:5678/`. The server is serving the new value immediately; only the loaded page is stale. A browser reload fixes it (signing out and back in does the same thing, by re-initializing the app, not because the session matters).

**Changing it is display-only — it never moves or unregisters an endpoint.** n8n stores no URL anywhere: an activated workflow writes a `WebhookEntity` keyed on `webhookPath` + `method` (no host, no scheme — its own comment describes the path as "appended to `${instanceUrl}/webhook/`"), and inbound requests are matched by `findWebhook(method, path)`, which takes no host. So a webhook keeps answering on **every** address StartOS publishes, the old one included, and active workflows are unaffected beyond the URL the editor prints.

**What does go stale is a copy of the old URL held somewhere else.** A URL handed to GitHub or Stripe last month is a string in that service's configuration; changing the primary URL changes what n8n shows from then on, and the external side has to be updated by hand.

### Configure SMTP

Points n8n at a mail server, either the one StartOS provides or one you supply.

- **What it changes:** the SMTP settings in the configuration.
- **Cost:** the service restarts, since the values become environment.
- **Repeat safety:** idempotent, and pre-filled with the current values.
- **Why it matters:** the "Forgot password" link on n8n's login screen sends mail. **Without SMTP that link cannot work**, which is what makes the next action necessary.

Choosing the system option uses the server's own SMTP settings, with an optional override of the From address.

### Reset Owner Password

Generates a new password for the owner account and shows it once.

- **For being locked out** with no SMTP configured.
- **What it changes:** only the owner's password. Workflows, credentials, and any other user accounts are untouched.
- **Cost:** none — no restart. It runs in a temporary container against the database directly, and n8n reads the hash on each login.
- **How it is done:** the password is hashed with **n8n's own bundled bcrypt**, taken from inside the image, so the stored format matches what n8n writes itself.
- **It fails loudly rather than guessing.** If no owner row exists yet, or if it would update more than one, it aborts and says so instead of writing something the application might not understand.
- **Runnable at any status**, including stopped.
- **Asks for confirmation first**, since the current owner password stops working.

## Tasks

One task, and it never holds the service.

| Task            | Severity    | Raised when                                                        | Cleared when                                      |
| --------------- | ----------- | ------------------------------------------------------------------ | ------------------------------------------------- |
| Set Primary URL | `important` | While no URL is chosen, or the chosen hostname is not a UI address | A UI address is chosen, or the chosen one returns |

## Health Checks

One check, on the only daemon.

| Check     | Displayed as    | Method                    | Grace |
| --------- | --------------- | ------------------------- | ----- |
| `primary` | "Web Interface" | n8n's own health endpoint | 60s   |

It queries the application rather than probing the port, so it reports that n8n is actually serving.

**It says nothing about workflows.** A failing trigger, an expired credential, or an execution erroring on every run all show a green check; those are visible in n8n's own executions list.

## Backups and Restore

The `main` volume is copied wholesale — `sdk.Backups.ofVolumes('main')`. That is the database, the encryption key, and the binary data workflows have passed through.

**The backup is equivalent to every credential n8n holds.** The credentials are encrypted in the database, the key that decrypts them is on the same volume, and the backup contains both — which is exactly what makes a restore work.

A restored instance comes back with the same workflows, the same credentials, the same users, and its execution history. Anything that depended on the old address — a webhook URL registered with an external service — has to be re-pointed, since the address is the server's rather than the backup's. If the restored choice is not one of the new server's addresses, n8n uses the preferred published address and the primary-URL task asks for another.

## Limitations and Differences

1. **Not open source.** The Sustainable Use License allows self-hosting but restricts commercial redistribution.
2. **SQLite only.** The database type is fixed; there is no option to point n8n at PostgreSQL.
3. **Single instance.** No queue mode, no separate workers — executions run in the one process.
4. **The backup is as sensitive as the credentials**, because it contains the encryption key alongside them.
5. **Password reset needs either SMTP or the action.** There is no other way back into a locked-out instance.
6. **Telemetry, version notifications, and personalization prompts are turned off** by this package and are not switchable from the interface.
7. **Externally triggered workflows depend on the primary URL being reachable** by whoever triggers them — the package publishes the address you choose, but cannot make a LAN address routable from the internet.
8. **Changing the primary URL does not re-register existing webhooks** with the external services already holding the old URL.
9. **The timezone is fixed to UTC**, so schedules are expressed in UTC.

---

## Quick Reference for AI Consumers

```yaml
package_id: n8n
image: n8nio/n8n
architectures:
  - x86_64
  - aarch64
subcontainers:
  - n8n-sub
volumes:
  main: /data # N8N_USER_FOLDER: database.sqlite, the encryption key, binaryData/
file_models:
  - config.json # SMTP and primaryUrl; n8n's own settings live in its database
startos_managed_env_vars:
  - N8N_USER_FOLDER
  - N8N_PORT
  - N8N_PROTOCOL
  - N8N_SECURE_COOKIE # false — StartOS addresses are not secure origins
  - N8N_WEBHOOK_URL # the primary URL; successor to the deprecated WEBHOOK_URL
  - N8N_EDITOR_BASE_URL # the primary URL; also the OAuth redirect and email links
  - N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS
  - N8N_DIAGNOSTICS_ENABLED
  - N8N_VERSION_NOTIFICATIONS_ENABLED
  - N8N_PERSONALIZATION_ENABLED
  - DB_TYPE
  - DB_SQLITE_DATABASE
  - GENERIC_TIMEZONE
  - TZ
  - N8N_EMAIL_MODE # the N8N_SMTP_* block only when SMTP is configured
dependencies: []
interfaces:
  ui: { type: ui, port: 5678 } # n8n's own login; no gate added by StartOS
actions:
  - set-primary-url # drives N8N_WEBHOOK_URL / N8N_EDITOR_BASE_URL; restarts
  - manage-smtp
  - reset-owner-password # temp container, n8n's own bcrypt, no restart; confirms first
tasks:
  - { action: set-primary-url, severity: important } # while unset or unpublished
health_checks:
  - primary # displayed "Web Interface"; queries /healthz, says nothing about workflows
```
