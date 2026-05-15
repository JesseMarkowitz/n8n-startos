# n8n

## Documentation

- [n8n documentation](https://docs.n8n.io) — upstream guides for building workflows, configuring nodes, managing users, the REST API, and webhook endpoints.

## What you get on StartOS

- A **Web UI** interface — the n8n workflow editor and dashboard where you build, run, and monitor workflows.
- A **REST API & Webhooks** interface — programmatic access for external services to trigger workflows and call the n8n API.
- An auto-generated 32-character **encryption key** that secures every credential you store in n8n. It lives in StartOS-managed state and is included in backups, so a restored package decrypts existing credentials correctly.
- Privacy-hardened defaults out of the box: telemetry, version-update notifications, and workflow templates are disabled.

## Getting set up

After install, n8n posts a **critical task** to set the primary URL. Webhook addresses are built from this URL, so it must be chosen before n8n can run.

1. Run the **Set Primary URL** task. Pick the address (LAN, Tor, or a custom clearnet domain you've added to either interface) you want n8n to advertise for webhook URLs and editor links.
2. Start n8n.
3. n8n also posts an **important task** asking you to finish the owner-account wizard. Open the **Web UI** interface — n8n's own first-run wizard will prompt you to create the owner email and password. No admin account is pre-seeded; this step is required before you can use n8n.
4. Begin building workflows. Once you've confirmed the owner account exists, run the **Complete Owner Account Setup** action to clear the reminder.

## Using n8n

### Interfaces

- **Web UI** — the workflow editor, credentials manager, executions log, and settings. This is where you and any additional users you invite work day-to-day.
- **REST API & Webhooks** — the same n8n instance reached for programmatic use. Webhook trigger nodes register their endpoints here; external services and API tokens hit this interface.

### Actions

- **Set Primary URL** — choose which of your n8n URLs is treated as canonical. The chosen URL is used to build webhook addresses and editor links. Run it again any time you want to switch to a different address (for example, after adding a clearnet domain).
- **Manage SMTP** — configure outbound email for password resets, user invites, and workflow email nodes. Choose **Disabled**, **System** (reuse StartOS's system SMTP, optionally with a custom From address), or **Custom** (host, port, username, password, security mode, From address).
- **Complete Owner Account Setup** — a reminder action paired with the install-time task. Run it once you've created the owner account in the Web UI to dismiss the reminder.
- **Reset User Management** — wipes user accounts so the Web UI returns to the first-run owner wizard. Use this when you've lost the owner password and have no other recovery path. Workflows and credentials are preserved.
- **Disable MFA for User** — clears the MFA enrollment for a single user by email address. Use this when a user has lost their MFA recovery codes and can no longer sign in.
- **Export Workflows** — returns every workflow as a copyable JSON string in the action result. Paste it elsewhere to back up, migrate, or inspect your workflows.
- **Export Credentials** — returns every stored credential decrypted, as a masked JSON string in the action result. Treat the output as sensitive.
- **Run Security Audit** — runs n8n's built-in security audit (credential exposure, webhook hygiene, outdated nodes, etc.) and displays the findings as copyable text.

## Limitations

- **Community Edition only.** Enterprise license keys are not supported.
- **SQLite only.** Upstream supports Postgres; this package does not enable it.
- **Internal task runners only.** Running task runners in a separate container is not supported.
- **Exports are inline, not files.** **Export Workflows** and **Export Credentials** return copyable JSON in the action result; no file is written to disk for retrieval via the file browser.
