# Actions and permissions

Nothing in a Bever app is allowed until an action allows it. An action names what may be done to an entity and who may do it.

```bev
Action Read Product
    By Anyone

Action Create, Update, Delete Product
    By Authenticated
```

## Verbs

| Verb | API | Notes |
| --- | --- | --- |
| `Create` | `POST /api/v1/products` | |
| `Read` | `GET /api/v1/products` and `GET /api/v1/products/{id}` | Also the default picker for references |
| `Update` | `PATCH /api/v1/products/{id}` | Only the fields sent are changed |
| `Delete` | `DELETE /api/v1/products/{id}` | Soft delete; see [Relationships](/guide/relationships) for references |
| `Crud` | all four | Shorthand |
| `Pick` | lookups only | See [Relationships](/guide/relationships#who-may-pick-a-record) |

Several verbs may share one declaration: `Action Create, Read Order`. An entity without a `Read` action has no list or detail routes; one without `Update` cannot be changed. That is often what you want: `Create` alone makes a write-only form, such as a contact request.

## Who: By rules

| Rule | Allows |
| --- | --- |
| `By Anyone` | everyone, signed in or not |
| `By Authenticated` | any signed-in account |
| `By <Role>` | any account assigned that [role](#roles) |
| `By <Field>` | the account stored in that field of the record, which must be a `-> Identity` field |

Each action needs at least one `By`. With several, any one is enough:

```bev
Action Update Ticket
    By Assignee
    By Reporter
```

## Owner rules

`By <Field>` compares the signed-in account with a field on the record:

- **Create**: the submitted value must be the signed-in account. Use it to make people create records they own.
- **Update and Delete**: the stored value decides, so nobody can take over a record by changing its owner in the same request.
- **Read and Pick**: instead of refusing, the rule filters. Lists and pickers contain only the records whose field holds the signed-in account.

```bev
Identity

Entity Note
    Field Title Text(200)
    Field Owner -> Identity

Action Create, Read, Update, Delete Note
    By Owner
```

Here everyone has their own notes: lists show only your notes, and opening someone else's note by URL returns `403 Forbidden`.

If `Read` only shows records by owner but `Create` lets people set that owner to someone else, the compiler warns (`BEV3028`): people could create records they then cannot see.

## Roles

A role names a group of accounts, such as support agents or managers. Declare it once, anywhere in the model, and name it in `By`:

```bev
Identity

Role Agent
Role Manager

Action Create, Read, Update Ticket
    By Agent

Action Delete Ticket
    By Manager
```

A role rule allows every account assigned the role, and on `Read` and `Pick` it shows every record. Roles combine with other rules: with `By Agent` and `By Owner` on `Read`, agents see every ticket and everyone else sees their own.

The model only says which roles exist. Who has them is decided where the app runs: an Administrator assigns roles on the app's *People* page, or you use the command line:

```sh
bever identity role add --email ada@example.com --role Agent
bever identity role revoke --email ada@example.com --role Agent
```

A change applies to the account's next request; nobody needs to sign in again. A name that is both a role and a field of the entity is an error (`BEV3036`), so adding a role never changes what an existing rule means.

## Administrators and grants

An Administrator may perform every action on every record. A grant lets one account perform one action, on a whole entity or on one record. Both are managed from the command line, never through the app:

```sh
bever identity admin add --email lead@example.com
bever identity grant add --email auditor@example.com --entity Order --action Read
bever identity grant add --email helper@example.com --entity Order --action Update --record <id>
```

See [Sign-in and accounts](/guide/accounts).

## What the server does

For every request the server, in order:

1. checks the antiforgery token on changes (`POST`, `PATCH`, `DELETE`),
2. validates the body against the entity's fields,
3. checks the action's rules, the account's roles, Administrators, and grants,
4. checks that every submitted reference may be picked,
5. stores the change and returns the record with its reference labels.

A request without a valid sign-in, where one is needed, gets `401 Unauthorized`; a signed-in account that is not allowed gets `403 Forbidden`.

## What the app shows

The app hides what a visitor cannot use: signed out, only `By Anyone` actions appear; signed in, actions for roles the visitor does not have are hidden, and record actions with owner rules appear on the records the visitor owns. Administrators see everything. This is a convenience, not security. The server decides every request.
