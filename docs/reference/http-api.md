# HTTP API

`MapBeverApi()` maps these routes under `/api/v1` (configurable with `ApiPrefix`). Routes exist only for declared actions. Entity routes are the entity name in kebab case, pluralized: `Product` → `/products`, `SalesOrder` → `/sales-orders`, `Category` → `/categories`.

Request and response bodies are JSON with camelCase field names.

## Records

| Method and route | Action | Success |
| --- | --- | --- |
| `GET /{entity}` | `Read` | `200` with an array of records |
| `GET /{entity}/{id}` | `Read` | `200` with the record |
| `POST /{entity}` | `Create` | `201` with the record and a `Location` header |
| `PATCH /{entity}/{id}` | `Update` | `200` with the record |
| `DELETE /{entity}/{id}` | `Delete` | `204` |

A record contains its fields, the system fields, and `_labels`:

```json
{
  "id": "6f3a2c0e9b8d4e0f8a1b2c3d4e5f6a7b",
  "number": "SO-1001",
  "customer": "c81b0f3e2d1c4b5a9e8f7d6c5b4a3e2d",
  "quantity": 2,
  "orderedOn": "2026-10-28",
  "createdOn": "2026-10-28T09:12:44.1234567+00:00",
  "createdBy": "idn_0c2f…",
  "modifiedOn": "2026-10-28T09:12:44.1234567+00:00",
  "modifiedBy": "idn_0c2f…",
  "deletedOn": null,
  "deletedBy": null,
  "_labels": { "customer": "Northwind" }
}
```

`_labels` maps each set relationship field to the target's label, or `null` when the caller may neither read nor pick the target. Requests must not contain `_labels`, system fields, or unknown fields.

- **Create** applies defaults for omitted fields and requires every required field.
- **Patch** changes only the fields sent; `null` clears an optional field.
- **Lists** contain the records the caller may see (owner rules filter them), ordered by the `Read` action's `OrderBy`, otherwise newest first.
- **Delete** is a soft delete and applies each relationship's `OnDelete` behavior.

## Lookups

For entities with `Read` or `Pick`:

```text
GET  /{entity}/_lookup?search=<text>&limit=<1-50>&cursor=<token>&picker=<Name>
POST /{entity}/_lookup/hydrate      { "ids": ["<id>", ...] }
```

Lookup returns `{ "items": [{ "id": "…", "label": "…" }], "nextCursor": "…" | null }`, 20 items by default. It searches the picker's `SearchBy` fields (or a text record label), ranking prefix matches first, and sorts by label. `picker` selects a named picker; without it the default `Pick`, otherwise `Read`, decides. Hydrate returns the labels of up to 50 IDs the caller may see.

Account pickers inside forms use context-bound routes:

```text
GET  /{entity}/_identity-lookup/{field}?action=Create&search=…
GET  /{entity}/{id}/_identity-lookup/{field}?action=Update&search=…
```

## Sign-in

With `Identity`:

| Route | Body | Success |
| --- | --- | --- |
| `POST /_identity/login` | `{ "email", "password" }` | `200` with a session; sets the cookie |
| `POST /_identity/register` | `{ "email", "password" }` | `201` with a session (only with `Registration Enabled`) |
| `POST /_identity/logout` | `{}` or empty | `204` |
| `GET /_identity/session` | | `200` with a session |

A session is `{ "authenticated": true, "identity": { "id": "…", "label": "ada@example.com" }, "administrator": false, "roles": ["Agent"] }`; signed out, `identity` is `null` and `roles` is empty. `roles` lists the account's roles that the model declares.

## Accounts

When the model declares at least one [role](/reference/language#role), Administrators assign roles to accounts:

| Route | Body | Success |
| --- | --- | --- |
| `GET /_identity/accounts?search=…&limit=…&cursor=…` | | `200` with `{ "items": [account, …], "nextCursor" }` |
| `PATCH /_identity/accounts/{id}` | `{ "roles": ["Agent", …] }` | `200` with the account |

An account is `{ "id", "label", "administrator", "roles" }`. The list searches and pages like the [account pickers](#lookups), ordered by email. `PATCH` replaces the account's roles; every name must be a declared role, each once. Both routes answer `401` when signed out and `403` to anyone but an Administrator. Making someone an Administrator stays a [CLI](/reference/cli#bever-identity) task.

## Antiforgery

`POST`, `PATCH`, and `DELETE` require an antiforgery token in the `RequestVerificationToken` header. Generated servers expose `GET /api/v1/_antiforgery/token`, which returns `{ "token": "…" }` bound to the current sign-in. The [JavaScript SDK](/reference/sdk) sends it for you.

## Errors

| Status | When | Body |
| --- | --- | --- |
| `400` | Invalid values, or a failed [rule](/reference/language#rules) | `{ "errors": [{ "field": "email", "message": "Enter a valid email address." }] }` |
| `400` | Invalid sign-in request or antiforgery token | `{ "error": { "code": "ValidationFailed", "message": "…" } }` |
| `401` | Sign-in needed, or wrong email or password | `{ "error": { "code": "Unauthenticated" \| "InvalidCredentials", … } }` |
| `403` | Signed in but not allowed | empty |
| `404` | No such record, or deleted | empty |
| `409` | Delete refused by `OnDelete Restrict`, or email already registered | `{ "error": { "code": "DeleteRestricted" \| "Conflict", "message": "…" } }` |
| `429` | Too many sign-in attempts (generated servers) | empty |

A failed rule is reported on the first field the rule names, with the rule's message. Rules are checked after values are valid and the caller is allowed to make the change, against the record as it will be after the change.
