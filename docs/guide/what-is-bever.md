# What is Bever?

Bever is an open-source language and framework for business applications. You describe the business in `.bev` files: the entities it tracks, their fields and relationships, and who may create, read, change, or delete them. Bever turns that description into a running application:

- a **validated, authorized HTTP API**, served by an ASP.NET Core library, and
- a **web app** built with Nuxt that lists, shows, creates, and edits records, with sign-in when you want it.

```bev
Entity Customer
    Field Name Text(200)
    Field Email Email
    Field Tier Enum(Free, Pro, Enterprise) = Free

Action Crud Customer
    By Authenticated
```

These seven lines produce `GET`, `POST`, `PATCH`, and `DELETE` routes under `/api/v1/customers`, server-side validation of every value (`Email` must look like an email address, `Tier` must be one of three names), a sign-in requirement on every route, and pages to manage customers.

## How it fits together

```text
bev/*.bev  ──bever compile──▶  bev/.output/model.json  ──▶  server/ (Bever.AspNetCore)
                                                         └─▶  client/ (@bever/sdk + Nuxt)
```

1. **The compiler** (`bever compile`, also run by `bever dev`) checks your `.bev` files and reports problems with file, line, and column. It writes a JSON *semantic model*.
2. **The server** loads the model and maps the HTTP API. It is the authority: it validates values, checks permissions, filters lists, and stores records in SQLite.
3. **The client** reads the same model to decide which pages, columns, fields, and buttons to show. It never decides what is allowed; the server does.

Both `server/` and `client/` are ordinary projects in your repository. Bever provides libraries and conventions, not generated source you are told not to touch.

## What Bever is good for

Bever fits applications whose core is structured records and rules about who may change them: internal tools, back offices, CRMs, ticketing, inventories, approval desks, and the admin side of products.

Today the language covers entities, typed fields, enums, relationships with delete behavior, defaults, validation rules, CRUD actions with permissions (`Anyone`, `Authenticated`, or the account in an owner field), relationship pickers, list ordering, sign-in with email and password, and presentation of the generated app. Workflow features such as state machines, computed fields, and notifications are on the [roadmap](/roadmap); the compiler reports them as "not supported yet" instead of ignoring them.

## Principles

- **Business meaning first.** The `.bev` file names business concepts. Framework details live in `client/` and `server/`.
- **Secure by default.** Every action must say who may perform it. There is no implicit access.
- **Explicit over clever.** Destructive database changes need consent; IDs are never shown to people; missing values are never guessed.
- **You own the code.** Customization means editing normal Vue and C#, not fighting a generator.

## License

The language, compiler, runtime, CLI, SDK, and VS Code extension are licensed under the [Apache License 2.0](https://github.com/bever-team/bever/blob/main/LICENSE). Templates and examples are licensed under [MIT No Attribution](https://github.com/bever-team/bever-templates/blob/main/LICENSE), so a project created with `bever new` is entirely yours, with no notice to keep. "Bever" and the Bever logo are [trademarks](https://github.com/bever-team/bever/blob/main/TRADEMARKS.md).

## Next steps

- [Getting started](/guide/getting-started): install the CLI and run your first app.
- [Tutorial](/guide/tutorial): build an order desk with customers, products, orders, and permissions.
- [Language reference](/reference/language): every construct, precisely.
