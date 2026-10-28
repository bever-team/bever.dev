# Entities and fields

An entity is a kind of record your application stores. A field is one value on that record.

```bev
Entity Product
    Field Name Text(120)
    Field Price Money
    Field Active Boolean = True
    Field Launched Date?
    Field Category Enum(Hardware, Software, Service) = Hardware
```

## Names

Entity and field names start with a letter and contain only letters and digits. Use `PascalCase`: `SalesOrder`, `DueDate`. The app turns them into readable labels (*Sales order*, *Due date*), and the API uses camelCase (`dueDate`) in JSON and kebab-case plurals in routes (`/api/v1/sales-orders`).

## Types

| Type | Stores | Notes |
| --- | --- | --- |
| `Text` | text of any length | Shown as a multi-line box |
| `Text(n)` | text of at most `n` characters | Up to 255 is a single line |
| `Boolean` | true or false | A switch in forms |
| `Int` | a whole number | 32-bit |
| `Decimal` | an exact decimal number | Stored without floating-point rounding |
| `Money` | an exact decimal amount | Shown with two decimals |
| `Date` | a calendar date | JSON `"2026-01-31"` |
| `DateTime` | a moment in time | JSON with a time zone; stored in UTC |
| `Time` | a time of day | JSON `"09:30"` |
| `Email` | an email address | Format checked |
| `Phone` | a phone number | Digits, spaces, `+ ( ) - .`; at least three digits |
| `Url` | a web address | Must start with `http://` or `https://` |
| `Enum(A, B, C)` | one of the listed names | Stored by name |
| `-> Entity` | a reference to another record | See [Relationships](/guide/relationships) |

## Required and optional

Every field is required unless its type ends with `?`:

```bev
Field Notes Text(2000)?      # may be empty
Field Title Text(200)        # required, and must not be blank
```

The server rejects a create request that omits a required field, and rejects `null` or blank text for one. The app marks optional fields and checks required ones before submitting.

## Defaults

A default fills a field when a create request leaves it out, and pre-fills new-record forms:

```bev
Field Active Boolean = True
Field Quantity Int = 1
Field Price Money = 9.95
Field Status Enum(Open, Closed) = Open
Field Country Text(2) = "NL"
Field Opens Time = "09:00"
```

Defaults must match the field's type: `True` or `False` for booleans, a number for numbers, an option name for enums, and quoted text for text-like types. The compiler checks formats too, so `Field Contact Email = "nobody"` is an error.

## Enums

```bev
Field Priority Enum(Low, Normal, High) = Normal
```

Options are names that start with a letter. The API accepts and returns the name (`"High"`). You may give options numbers, `Enum(Low = 1, High = 2)`; the API then also accepts the number on input, but records always store and return the name. Adding options later is a safe migration; removing one is destructive.

## Rules

Types check one value at a time. A rule checks the record as a whole:

```bev
Entity Booking
    Field Guests Int
    Field StartsOn Date
    Field EndsOn Date?
    Field Status Enum(Requested, Confirmed, Cancelled) = Requested
    Field CancelReason Text(500)?

    Rule Guests > 0 "Book for at least one guest"
    Rule Status != Requested Or StartsOn >= Today "Requests cannot start in the past"
    Rule EndsOn >= StartsOn "The stay must end after it starts"
    Rule Status != Cancelled Or CancelReason != Null "Say why the booking was cancelled"
```

The server checks every rule when a record is created or updated. If a condition is false, the save is refused and the app shows the message next to the first field the rule names. A comparison with an empty field does not fail: `EndsOn >= StartsOn` holds while `EndsOn` is empty. See [Rules](/reference/language#rules) for every condition you can write.

Rules apply to saves, not to records already stored. Rules that use `Today` or `Now` also apply when an old record is edited later, which is why the date rule above only checks open requests.

## System fields

Every record also has fields you do not declare:

| Field | Meaning |
| --- | --- |
| `id` | Opaque identifier. The app never shows it. |
| `createdOn`, `modifiedOn` | UTC timestamps |
| `createdBy`, `modifiedBy` | The account that made the change, when signed in |

Deleting a record is a soft delete: the record disappears from the API and the app, and its row keeps `deletedOn` and `deletedBy` in the database. You cannot declare fields with these names.
