# Database migrations

Bever stores records in SQLite. When the model changes in a way that affects storage (a new entity, a new field, a changed type), the database must change too. Bever plans those changes for you and records each one as a migration file you commit.

## During development

`bever dev` handles migrations:

- The first run creates `bev/migrations/<timestamp>_initial.json` and the database.
- When you save a model change that affects storage, it shows the plan and asks before creating and applying a migration:

```text
The database schema changed:
  safe              add field Task.Estimate
  deletes data      drop field Task.Legacy
This change deletes data in your development database.
Create and apply this migration? [y/N]
```

Presentation and permission changes never need a migration.

## Risk classes

Every planned change has a risk:

| Risk | Examples | What you need to do |
| --- | --- | --- |
| safe | new entity, new optional field, longer text limit, new enum option, required to optional | nothing |
| needs a backfill | new required field on an entity that has records; optional to required | supply a value for existing records |
| deletes data | dropped entity or field, changed type, shorter text limit, removed enum option | confirm explicitly |

Renaming an entity or field is planned as a drop and an add, so it deletes data.

## Creating migrations yourself

```sh
bever migration add add-currency
```

compares `bev/` with the accepted schema (`bev/schema.snapshot.json`) and writes a migration file. When a new required field needs values for existing records, pass a literal:

```sh
bever migration add add-currency --backfill Product.Currency=EUR
```

A migration that deletes data needs `--allow-destructive`.

## Applying migrations

```sh
bever migration status        # is the database up to date?
bever migration apply         # apply pending migrations
```

Both use `.bever/bever.db` unless you pass `--database <path>`. `apply` checks every migration's schema hashes, applies each in a transaction, and also creates or upgrades the account tables when the model declares `Identity`.

## In production

Production databases are never changed implicitly. The server starts with a database that is behind and logs a critical message; requests that touch missing tables fail. Run `bever migration apply` (or `docker run ... migrate`) as a deployment step before starting the new version. See [Deployment](/guide/deployment).

## Working in a team

Migration files form a chain: each one starts at the schema hash the previous one ended with. If two branches both add a migration, the second to merge fails with *Migration history branches*. Keep one of the files, update the model, and run `bever migration add` again.
