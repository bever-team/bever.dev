# CLI reference

```sh
dotnet tool install --global Bever.Cli
```

Commands that work on a project find it by looking for a `bev/` folder in the current directory and its parents. `--bev <dir>` chooses the folder explicitly. Database commands use `.bever/bever.db` next to `bev/` unless you pass `--database <path>`.

Every command prints errors to standard error and exits with `0` on success and `1` on failure. Set `NO_COLOR` to turn off colors.

## bever new

```sh
bever new <name> [--template <directory>]
```

Creates `<name>/` with `bev/`, `client/`, `server/`, a `Dockerfile`, and a README. The name starts with a letter and may contain letters, digits, spaces, `_`, and `-`; it becomes the app title, the .NET project name (`AcmeTasks.Server`), and the npm package name (`acme-tasks`). New projects reference the Bever packages of the CLI's version.

`--template` uses another template folder. Templates replace `__PROJECT_DISPLAY_NAME__`, `__PROJECT_DOTNET_NAME__`, `__PROJECT_NPM_NAME__`, and `__BEVER_VERSION__` in file names and contents.

## bever dev

```sh
bever dev [--port <port>] [--api-port <port>]
```

Runs the app for development:

1. compiles `bev/` (and waits for fixes when there are errors),
2. creates the initial migration on the first run, or shows schema changes and asks before creating and applying a migration,
3. creates or upgrades the account tables when the model declares `Identity`,
4. installs the client's packages when `client/node_modules` is missing,
5. starts the server on `--api-port` (default 5100) and the client on `--port` (default 3000), prefixing their output with `[api]` and `[web]`,
6. watches `bev/`: each save recompiles, migrates when needed, and restarts the server.

`Ctrl+C` stops everything. Without an interactive terminal, schema changes are not applied and `bever dev` explains how to apply them.

## bever check

```sh
bever check [file-or-directory]
```

Reports errors and warnings as `path:line:column: error BEV1234: message`. Defaults to the project's `bev/`.

## bever compile

```sh
bever compile [file-or-directory] [--output <file>]
```

Writes the [semantic model](/reference/semantic-model). Defaults to `bev/` and `bev/.output/model.json`.

## bever migration

```sh
bever migration add <name> [--backfill Entity.Field=value]... [--allow-destructive]
bever migration apply [--database <path>]
bever migration status [--database <path>]
```

| Command | Effect |
| --- | --- |
| `add` | Compares `bev/` with `bev/schema.snapshot.json`, prints the plan, writes `bev/migrations/<UTC timestamp>_<name>.json`, and updates the snapshot. New required fields on existing entities need `--backfill`; changes that delete data need `--allow-destructive`. |
| `apply` | Applies pending migrations in hash-chain order, each in a transaction, then creates or upgrades the account tables when the model declares `Identity`. |
| `status` | Prints the database status and exits with `1` unless it matches the accepted schema. |

## bever identity

```sh
bever identity schema status|apply
bever identity bootstrap --email <email> [--password <password>]
bever identity list
bever identity admin add|revoke --email <email>
bever identity role add|revoke --email <email> --role <Role>
bever identity grant add --email <email> --entity <Entity> --action <Action> [--record <id>]
bever identity grant list --email <email>
bever identity grant revoke --grant <grant-id>
```

| Command | Effect |
| --- | --- |
| `schema status` | Reports the account tables' status. |
| `schema apply` | Creates or upgrades the account tables. |
| `bootstrap` | Creates the first account as an Administrator. Prompts for the password when `--password` is omitted. Refuses when an Administrator exists. |
| `list` | Lists accounts with their ID, email, and roles, Administrator first. |
| `admin add` | Makes an existing account an Administrator. |
| `admin revoke` | Removes Administrator; refuses for the last one. |
| `role add` | Assigns a role the model declares (`Role <Name>`). Assigning a role the account has changes nothing. |
| `role revoke` | Removes a role from the account, also one the model no longer declares. |
| `grant add` | Lets the account perform one action on the entity, or on one record with `--record` (`Read`, `Update`, `Delete`, or `Pick`). |
| `grant list` | Lists the account's grants. |
| `grant revoke` | Removes a grant by ID. |

Select an account with `--email` or `--identity <id>`. Every change is written to a private audit table.
