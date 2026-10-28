# JavaScript SDK

`@bever/sdk` reads Bever semantic models and calls the Bever HTTP API from browsers and Node.js. The generated client uses it; you can use it in any JavaScript or TypeScript project.

```sh
npm install @bever/sdk
```

## Read a model

```ts
import { createBeverApp, parseBeverModel } from '@bever/sdk'
import { readFileSync } from 'node:fs'

const app = createBeverApp(parseBeverModel(readFileSync('bev/.output/model.json', 'utf8')))

const order = app.requireEntity('Order')
order.routeName                       // "orders"
order.getFields().map((field) => field.name)
order.presentation.label              // "Order"
order.presentation.listing            // [{ field, label }, ...] in display order
order.presentation.getActionsForPlacement('ListingRow')
```

`parseBeverModel` rejects JSON with duplicate keys, then `createBeverApp` validates the model against the supported semantic model version (`SUPPORTED_SEMANTIC_MODEL_VERSION`, currently `0.9`) and throws `BeverModelVersionError` or `BeverModelValidationError` when it does not match.

`entity.presentation` applies every [presentation](/guide/presentation) default: readable labels, field projections, editing modes, action labels and placements, and the picker each relationship uses (`creating.inputs`, `editing.inputs`).

## Call the API

```ts
import { createBeverClient } from '@bever/sdk'

const client = createBeverClient({
  baseUrl: 'https://orders.example.com',   // omit in the browser for same-origin requests
  model,                                   // enables the sign-in helpers that the model declares
  antiforgeryToken: async () => (await (await fetch('/api/v1/_antiforgery/token', { credentials: 'include' })).json()).token,
})

const orders = await client.list('orders')
const order = await client.get('orders', orders[0].id)
const created = await client.create('orders', { number: 'SO-1002', customer: customerId, orderedOn: '2026-10-28', salesRep: me })
await client.patch('orders', created.id, { status: 'Shipped' })
await client.delete('orders', created.id)
```

| Method | Route |
| --- | --- |
| `list(route)` | `GET /api/v1/{route}` |
| `get(route, id)` | `GET /api/v1/{route}/{id}` |
| `create(route, values)` | `POST /api/v1/{route}` |
| `patch(route, id, values)` | `PATCH /api/v1/{route}/{id}` |
| `delete(route, id)` | `DELETE /api/v1/{route}/{id}` |
| `lookupReferences(route, { search, limit, cursor, picker })` | `GET /api/v1/{route}/_lookup` |
| `hydrateReferences(route, { ids })` | `POST /api/v1/{route}/_lookup/hydrate` |
| `lookupIdentities(context, request)` | context-bound account picker |
| `login({ email, password })` | `POST /api/v1/_identity/login` |
| `register({ email, password })` | `POST /api/v1/_identity/register` |
| `logout()` | `POST /api/v1/_identity/logout` |
| `getSession()` | `GET /api/v1/_identity/session` |
| `listAccounts({ search, limit, cursor })` | `GET /api/v1/_identity/accounts` |
| `setAccountRoles(id, roles)` | `PATCH /api/v1/_identity/accounts/{id}` |

The sign-in helpers exist only when the model passed to `createBeverClient` declares them (`register` needs `Registration Enabled`), and the account helpers only when it declares roles; `setAccountRoles` accepts declared role names only. A session is `{ authenticated, identity, administrator, roles }`. Requests send cookies (`credentials: 'include'`) and add the antiforgery token to changes. Every method accepts `{ signal, headers }` as its last argument.

A failed request throws `BeverHttpError` with `status` and the parsed `body`:

```ts
import { BeverHttpError } from '@bever/sdk'

try {
  await client.create('customers', { name: 'Northwind', email: 'nobody' })
} catch (error) {
  if (error instanceof BeverHttpError && error.status === 400) {
    console.log(error.body)  // { errors: [{ field: 'email', message: 'Enter a valid email address.' }] }
  }
}
```

## Helpers

| Export | Purpose |
| --- | --- |
| `entityRouteName(name)` | `"SalesOrder"` → `"sales-orders"` |
| `toRequestFieldName(name)` | `"DueDate"` → `"dueDate"` |
| `humanize(name)` | `"DueDate"` → `"Due date"` |
| `pluralizeLabel(label)` | `"Category"` → `"Categories"` |
| `resolveEntityPresentation(entity, entities, actions)` | Presentation for one entity |

All model types (`BeverModel`, `EntityModel`, `FieldModel`, `ActionModel`, ...) are exported for TypeScript.
