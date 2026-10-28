# Relationships

A field of type `-> Entity` stores a reference to one record of another entity.

```bev
Entity Customer
    Field Name Text(200)

Entity Order
    Field Number Text(20)
    Field Customer -> Customer
    Field Referrer -> Customer?
```

In the API a reference is the target's `id`. In the app it is a picker that searches the target's records by label and never shows IDs. Every record returned by the API includes `_labels`, the label of each reference it holds, so lists and detail pages can show *Northwind* instead of an ID:

```json
{ "id": "6f3a…", "number": "SO-1001", "customer": "c81b…", "_labels": { "customer": "Northwind" } }
```

## Labels

A record's label is the value of its `RecordLabel` field (see [Presentation](/guide/presentation)), or by default its first `Text` field, otherwise its first other text, number, date, or enum field. An entity that other entities reference must have such a field; the compiler tells you when it does not.

## Deleting referenced records

`OnDelete` decides what happens to references when their target is deleted:

| Behavior | Effect |
| --- | --- |
| `Restrict` (default) | The delete is refused while records still reference the target. The API answers `409 Conflict`. |
| `Cascade` | Referencing records are deleted too. |
| `SetNull` | References are cleared. Only for optional (`?`) relationships. |

```bev
Field Customer -> Customer OnDelete Cascade
Field Referrer -> Customer? OnDelete SetNull
```

## Who may pick a record

To store a reference, a person must be allowed to *pick* the target. By default the target's `Read` action decides: if you may open a customer, you may pick it.

When picking should differ from reading, declare a picker:

```bev
Action Read Customer
    By Owner                 # open only your own customers

Action Pick Customer
    By Authenticated          # but pick any customer
    SearchBy Name, Email    # and search by name or email
```

A picker never returns full records, only `{ id, label }`. It may be wider than `Read` (pick records you cannot open) or narrower. A field can use a named picker:

```bev
Action Pick Project As Managed
    By Manager

Entity Task
    Field Project -> Project Pick Managed
```

When saving, the server checks every submitted reference against the field's picker for the current account. An unknown, deleted, or unpickable target is rejected with *The selected record is unavailable.*

## References to accounts

With a top-level [`Identity`](/guide/accounts) block, `-> Identity` references a signed-in account. It is how `By Owner` rules know who owns a record:

```bev
Field Owner -> Identity
Field Reviewer -> Identity?
```

The app picks accounts by email. Account pickers only work inside create and edit forms the person may use; there is no general directory of accounts.
