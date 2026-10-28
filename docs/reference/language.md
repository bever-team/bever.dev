# Language reference

This is the complete Bever language, version 0.6. Anything not described here is reported by the compiler as an error; constructs that are planned but not implemented yet are reported as *not supported yet* and listed on the [roadmap](/roadmap).

## Files and layout

- Source files end in `.bev`. All files under `bev/` form one model; a file sees the entities it declares and the ones it [imports](#export-and-import).
- Indentation is significant and uses spaces. A declaration starts at the beginning of a line; its members are indented below it.
- `#` starts a comment that runs to the end of the line (except inside a quoted string).
- Names of entities, fields, enum options, pickers, and roles start with an ASCII letter and contain only ASCII letters and digits.

A model consists of these top-level declarations:

```text
Import ... From ...     entities of another file used in this one
[Export] Entity <Name>  a kind of record
Identity                sign-in with accounts (at most one)
Role <Name>             a group of accounts that By rules can name
Action ...              what may be done, and by whom
```

## Field paths

Clauses that refer to a field name it directly: `OrderBy DueDate`, `By Owner`, `Fields Title, Status`. The field belongs to the entity of the surrounding declaration. Paths through relationships (`Owner/Team`) are planned; a leading `/` (`/Title`) is an error.

## Export and import

```bev
# crm/customers.bev
Export Entity Customer
    Field Name Text(100)

# sales/orders.bev
Import Customer From "../crm/customers.bev"

Entity Order
    Field Customer -> Customer
```

`Export Entity` lets other files import the entity; an entity without `Export` is private to its file. `Import <Name>, ... From "<path>"` names exported entities of another file of the model, by a path relative to the importing file that ends in `.bev`.

A file may use the entities it declares and the ones it imports, as relationship targets and in `Action` declarations. An imported entity brings its named pickers. `Identity` needs no import. Entity names are unique across the whole model even when they are not exported, because they decide HTTP routes and tables.

## Identity

```bev
Identity
    Registration Enabled
```

| Member | Meaning |
| --- | --- |
| `Registration Enabled` | People may create their own accounts. |
| `Summary Label Email` | Accounts are labeled by email. This is the default and the only option. |

Declaring `Identity` enables sign-in, sign-out, and session endpoints, the `-> Identity` relationship target, roles, and `By <Field>` rules. `Identity` is reserved: it cannot be an entity name or an action target.

## Role

```bev
Identity

Role Agent
Role Manager

Action Read Ticket
    By Agent
    By Owner
```

```text
Role <Name>
```

A role names a group of accounts. It requires `Identity`, has no members, and is visible in every file without an import. Role names are unique across the model ignoring case, and cannot be `Anyone`, `Authenticated`, `Administrator`, or `Identity`. Accounts are assigned to roles outside the model: with [`bever identity role`](/reference/cli#bever-identity), or by an Administrator in the app. Levels and inheritance between roles are [planned](/roadmap).

## Entity

```text
[Export] Entity <Name>
    Field <Name> <Type> [= <Default>]
    ...
    [Rule <Condition> "<Message>"
    ...]
    [Present
        ...]
```

An entity has fields, any number of [rules](#rules), and at most one `Present` block. Two entities may not produce the same HTTP route (for example `Box` and `Boxe` both map to `/boxes`).

### Fields

```text
Field <Name> <Type>[?] [= <Default>]
```

`?` makes the field optional. Names are unique within an entity (ignoring case) and may not be a system field: `Id`, `CreatedOn`, `CreatedBy`, `ModifiedOn`, `ModifiedBy`, `DeletedOn`, `DeletedBy`.

### Types

| Type | JSON value | Validation |
| --- | --- | --- |
| `Text` | string | Required text must not be blank |
| `Text(n)` | string | At most `n` characters (`n` ≥ 1) |
| `Boolean` | `true` / `false` | |
| `Int` | number | 32-bit integer |
| `Decimal` | number | Exact decimal |
| `Money` | number | Exact decimal |
| `Date` | `"YYYY-MM-DD"` | |
| `DateTime` | `"YYYY-MM-DDTHH:MM[:SS[.fff]]Z"` or with `±HH:MM` | Stored as UTC |
| `Time` | `"HH:MM"` or `"HH:MM:SS"` | |
| `Email` | string | `name@domain.tld`, at most 254 characters |
| `Phone` | string | `+`, digits, spaces, `( ) - .`; at least 3 digits; at most 32 characters |
| `Url` | string | Absolute `http` or `https` URL |
| `Enum(A, B, ...)` | `"A"` | One of the option names |
| `-> Entity` | `"<id>"` | A record the caller may pick |
| `-> Identity` | `"<id>"` | A live account (requires `Identity`) |

### Enums

```text
Enum(<Option>[ = <Integer>], ...)
```

Options are unique names. An option may have an integer value; the API then also accepts the integer on input, and always stores and returns the name.

### Relationships

```text
Field <Name> -> <Entity>[?] [OnDelete Restrict|Cascade|SetNull] [Pick <Picker>]
```

| Clause | Meaning |
| --- | --- |
| `OnDelete Restrict` | Default. Deleting the target is refused while references exist. |
| `OnDelete Cascade` | Deleting the target deletes the referencing records. |
| `OnDelete SetNull` | Deleting the target clears the reference. Requires `?`. |
| `Pick <Picker>` | Pick targets with the named picker `Action Pick <Entity> As <Picker>`. |

The clauses may appear in either order, each at most once. An entity that is the target of a relationship needs a field that can label its records (see `RecordLabel`).

### Defaults

| Field type | Default syntax |
| --- | --- |
| `Boolean` | `True` or `False` |
| `Int` | a whole number, e.g. `= 1` |
| `Decimal`, `Money` | a number, e.g. `= 9.95` |
| `Enum(...)` | an option name, e.g. `= Open` |
| `Text`, `Email`, `Phone`, `Url`, `Date`, `DateTime`, `Time` | a quoted value in the type's format, e.g. `= "NL"`, `= "09:00"` |

Relationships have no defaults. A default applies when a create request leaves the field out.

### Rules

```bev
Entity Refund
    Field Amount Money
    Field Status Enum(Draft, Approved, Rejected) = Draft
    Field Reason Text(500)?
    Field Minimum Int?
    Field Maximum Int?
    Field DueDate Date?

    Rule Amount > 0 "Amount must be positive"
    Rule Status In (Draft, Approved) Or Reason != Null "Give a reason for a rejection"
    Rule Minimum <= Maximum "Minimum cannot exceed maximum"
    Rule Not (DueDate < Today) "Due date cannot be in the past"
```

```text
Rule <Condition> "<Message>"
```

A rule is checked on every create and update, against the record as it will be after the change. When the condition is false, the change is refused with the message as a validation error on the first field the rule names.

| Condition | Meaning |
| --- | --- |
| `<Field> = <Value>` | Comparison; also `!=`, `<`, `<=`, `>`, `>=`. The field may stand on either side. |
| `<Field> = <Field>` | Comparison of two fields of the same type |
| `<Field> In (<Value>, ...)` | The field equals one of the values |
| `<Field> = Null`, `<Field> != Null` | The field is empty, or not |
| `<Condition> And <Condition>` | Both hold |
| `<Condition> Or <Condition>` | Either holds |
| `Not <Condition>` | The condition does not hold |
| `( <Condition> )` | Grouping. `Not` binds tightest, then `And`, then `Or`. |

Values are written as in [defaults](#defaults): numbers, `True` or `False`, enum option names, and quoted values for text, dates, and times. `Today` is the current date (for `Date` fields) and `Now` the current date and time (for `DateTime` fields), both in UTC. An enum option name means the option even when a field has the same name.

| Field type | Comparisons |
| --- | --- |
| `Int`, `Decimal`, `Money` | all; these types compare with each other |
| `Date`, `DateTime`, `Time` | all |
| `Text`, `Email`, `Phone`, `Url` | `=`, `!=`, `In`; exact and case-sensitive |
| `Boolean`, `Enum(...)` | `=`, `!=`, `In` |
| `-> Entity`, `-> Identity` | `= Null` and `!= Null` only |

An empty field makes a comparison unknown, and a rule fails only when its condition is false, as with SQL `CHECK` constraints. `Amount > 0` therefore passes when `Amount` is empty; write `Amount != Null And Amount > 0` to require a value as well. Rules are enforced by the server only, not by the database, and apply to records as they are saved: existing records that break a new rule are not changed until someone updates them.

## Action

```text
Action <Verbs> <Entity> [As <Picker>]
    By <Subject>
    [By <Subject> ...]
    [OrderBy <Field> [Asc|Desc]]
    [SearchBy <Field>, ...]
```

### Verbs

`Create`, `Read`, `Update`, `Delete`, `Pick`, and `Crud` (the first four). Separate several with commas: `Action Create, Read Order`. Each verb may be declared once per entity, except `Pick`: one default picker plus any number of named ones (`Action Pick Project As Managed`). `As` is valid only on `Pick`.

### By

| Subject | Allows |
| --- | --- |
| `Anyone` | everyone |
| `Authenticated` | any signed-in account |
| `<Role>` | any account assigned the [role](#role) |
| `<Field>` | the account in the field, which must be a `-> Identity` field of this entity |

`Anyone` and `Authenticated` always name the subjects, never fields. A name that is both a role and a field of the entity is an error; rename one. Every action needs at least one `By`; any matching rule allows the request. On `Read` and `Pick`, role rules allow every record, and field rules filter lists and lookups to the matching records. Administrators and grants (managed with `bever identity`) allow in addition to the rules.

### OrderBy

Valid where the declaration includes `Read`. Sorts lists by a non-relationship field, or by `CreatedOn` or `ModifiedOn`. `Asc` is the default. Without `OrderBy`, lists show the newest records first.

### SearchBy

Valid where the declaration includes `Read` or `Pick`. Lists the fields that relationship pickers search, which must be `Text`, `Email`, `Phone`, `Url`, or enum fields. `SearchBy` on `Read` is unused, and an error, when the entity declares a default `Pick`. Without `SearchBy`, pickers search the record label when it is text.

## Present

```text
Present
    Label "<text>"
    PluralLabel "<text>"
    RecordLabel <Field>
    Field <Field>
        Label "<text>"
    Listing
        Fields <Field>, ...
    Details
        Fields <Field>, ...
    Creating
        Mode Page|Modal|None
        Fields <Field>, ...
        Input <Field>
            Picker Dropdown|Combobox|Modal
    Editing
        Mode Page|Modal|Inline|None
        Fields <Field>, ...
        Input <Field>
            Picker Dropdown|Combobox|Modal
    Actions
        <Create|Read|Update|Delete>
            Label "<text>"
            Emphasis Default|Primary|Destructive
            Confirm "<text>"
            Place <Placement>, ...
            Order <integer>
            Hidden true|false
```

Every member is optional and may appear at most once. Field paths are fields of the same entity (`Title`). `RecordLabel` must be a `Text`, `Email`, `Phone`, `Url`, `Int`, `Decimal`, `Date`, `DateTime`, `Boolean`, or enum field. `Input` applies to single-target relationships in the experience's fields. A non-`None` `Creating` mode requires a `Create` action; a non-`None` `Editing` mode requires `Update`.

Placements by action:

| Action | Allowed places | Default |
| --- | --- | --- |
| `Create` | `ListingToolbar` | `ListingToolbar` |
| `Read` | `Navigation`, `ListingRow`, `DetailsToolbar` | `Navigation`, `ListingRow` |
| `Update` | `ListingRow`, `DetailsToolbar` | both |
| `Delete` | `ListingRow`, `DetailsToolbar` | both |

`Present` is presentation only: it adds, removes, or changes no API route or permission. See the [Presentation guide](/guide/presentation) for the defaults.

## Reserved words

These planned constructs are reserved and currently produce *not supported yet*: `State`, `Computed`, `Aggregate`, `Rule` under `Action`, `When`, `Transition`, `Approval`, `On`, `Schedule`, `Notify`, `Query`, `Audit`, `Seed`, and the types `Duration`, `File`, `Image`, and `Multiple`. Relationships to several entities (`-> A Or B`), conditional rules (`By ... Where ...`), and members of a `Role` (`Levels`, `Inherits`) are reserved the same way.
