# Semantic model

`bever compile` writes the model as JSON. It is the contract between the compiler and everything that runs or inspects a Bever app: the ASP.NET Core runtime, the JavaScript SDK, and your own tools. Consumers read the structured model and never parse `.bev` source.

The current version is **`0.10`** (language `0.6`). Runtimes accept exactly the version they were built for and report a mismatch with both versions at startup; recompile with a matching CLI to fix it.

## Top level

```json
{
  "beverLanguageVersion": "0.6",
  "semanticModelVersion": "0.10",
  "identity": { ... },
  "roles": [ ... ],
  "entities": [ ... ],
  "actions": [ ... ]
}
```

Properties appear in this order. Source spans (`sourceSpan`) give the file (relative to the project folder), line, and column of each declaration, for tools; runtimes ignore them. `Import` and `Export` are checked by the compiler and leave no trace in the model.

## identity

```json
{
  "enabled": true,
  "capabilities": ["Login", "Logout", "Session", "Register"],
  "summary": { "labelSource": "Email" },
  "systemTargets": [
    { "name": "Identity", "kind": "SystemIdentity", "lookup": { "summaryShape": "IdLabel", "contextBound": true, "generalReadAction": false } }
  ]
}
```

Without `Identity` in the source: `{ "enabled": false, "capabilities": [], "summary": null, "systemTargets": [] }`. `Register` appears only with `Registration Enabled`.

## roles

```json
[{ "name": "Agent", "sourceSpan": { ... } }]
```

One object per `Role` declaration, in source order; `[]` without roles. Role assignments are not part of the model.

## entities

```json
{
  "name": "Order",
  "kind": "Application",
  "sourceSpan": { "start": { "path": "bev/app.bev", "line": 12, "column": 1 }, "end": { ... } },
  "fields": [ { ...field } ],
  "rules": [ { ...rule } ],
  "presentation": null
}
```

### Fields

```json
{
  "name": "Status",
  "type": {
    "kind": "Enum",
    "name": null,
    "nullable": false,
    "arguments": [],
    "options": [{ "name": "Open", "value": null }, { "name": "Shipped", "value": null }],
    "targets": [],
    "onDelete": null,
    "targetKind": null,
    "picker": null
  },
  "defaultValue": { "kind": "Identifier", "value": "Open" },
  "sourceSpan": { ... }
}
```

| `type.kind` | Meaning | Other properties |
| --- | --- | --- |
| `Primitive` | A primitive value | `name`: `Text`, `Boolean`, `Int`, `Decimal`, `Money`, `Date`, `DateTime`, `Time`, `Email`, `Phone`, `Url`. `Text(n)` has `arguments: [{ "maxLength": n }]`. |
| `Enum` | One of `options` | `options[].value` is the optional integer. |
| `Relationship` | A reference | `targets`: one entity name or `"Identity"`; `targetKind`: `Application` or `SystemIdentity`; `onDelete`: `Restrict`, `Cascade`, or `SetNull`; `picker`: a named picker or `null`. |

`defaultValue.kind` is `Text`, `Boolean`, `Integer`, `Decimal`, or `Identifier` (an enum option).

### Rules

`Rule Amount > 0 Or Status = Draft "Amount must be positive"` becomes:

```json
{
  "condition": {
    "kind": "Or",
    "operator": null,
    "operands": [
      {
        "kind": "Compare",
        "operator": ">",
        "operands": [
          { "kind": "Field", "operator": null, "operands": [], "path": { "segments": ["Amount"] }, "literal": null },
          { "kind": "Literal", "operator": null, "operands": [], "path": null, "literal": { "kind": "Decimal", "value": 0 } }
        ],
        "path": null,
        "literal": null
      },
      { "kind": "Compare", "operator": "=", "operands": [ ... ], "path": null, "literal": null }
    ],
    "path": null,
    "literal": null
  },
  "message": "Amount must be positive",
  "sourceSpan": { ... }
}
```

Every condition node has all five properties.

| `kind` | Meaning | Properties |
| --- | --- | --- |
| `And`, `Or` | All or any of `operands` hold | two or more condition `operands` |
| `Not` | The operand does not hold | one condition operand |
| `Compare` | A comparison | `operator`: `=`, `!=`, `<`, `<=`, `>`, or `>=`; two value `operands`, at least one a `Field` |
| `In` | A field equals one of the values | value `operands`: a `Field`, then one or more `Literal`s |
| `Field` | A field of the entity | `path` |
| `Literal` | A value | `literal`, with the same kinds as `defaultValue`; dates and times are `Text` |
| `Null`, `Today`, `Now` | Empty, the current UTC date, the current UTC date and time | none |

Literals are typed by the field they are compared with. An entity without rules has `"rules": []`.

### presentation

`null` when the entity has no `Present` block. Otherwise every member of [`Present`](/reference/language#present) appears, with `null` for omitted ones:

```json
{
  "label": "Order",
  "pluralLabel": null,
  "recordLabel": { "segments": ["Number"] },
  "fields": [{ "field": { "segments": ["OrderedOn"] }, "label": "Order date", "sourceSpan": { ... } }],
  "listing": { "fields": [ ...paths ], "sourceSpan": { ... } },
  "details": null,
  "creating": { "mode": "Page", "fields": [ ...paths ], "inputs": [{ "field": { ... }, "widget": "ReferencePicker", "display": "Dropdown", "sourceSpan": { ... } }], "sourceSpan": { ... } },
  "editing": { "mode": "Modal", "fields": null, "inputs": [], "sourceSpan": { ... } },
  "actionOverrides": [{ "action": { "name": "Delete" }, "label": null, "emphasis": null, "confirm": "Delete this order?", "placements": null, "order": null, "hidden": null, "sourceSpan": { ... } }],
  "sourceSpan": { ... }
}
```

The model stores what the source says; defaults are resolved by consumers. The JavaScript SDK's `resolveEntityPresentation` is the reference implementation of those defaults.

## actions

One object per entity and verb (`Crud` is expanded):

```json
{
  "verb": "Read",
  "entity": "Order",
  "name": null,
  "sourceSpan": { ... },
  "authorizations": [{ "kind": "Path", "path": { "segments": ["SalesRep"] }, "role": null }, { "kind": "Role", "path": null, "role": "Manager" }],
  "orderBy": { "path": { "segments": ["OrderedOn"] }, "direction": "Desc" },
  "searchBy": null
}
```

| Property | Meaning |
| --- | --- |
| `verb` | `Create`, `Read`, `Update`, `Delete`, or `Pick` |
| `name` | The picker name on named `Pick` actions; otherwise `null` |
| `authorizations[].kind` | `Anyone`, `Authenticated`, `Path` (with `path`), or `Role` (with `role`, a declared role) |
| `orderBy` | `Read` only; `direction` is `Asc` or `Desc` |
| `searchBy` | `Read` and `Pick` only; field paths, or `null` |

`name`, `searchBy`, `authorizations[].role`, and `type.picker` are always present, even when `null`.
