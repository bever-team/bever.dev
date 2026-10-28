# Presentation

A `Present` block inside an entity tells the generated app how to show it: labels, list columns, the fields of each form, how editing opens, and how actions appear. It never changes what the API allows.

```bev
Entity Task
    Field Title Text(200)
    Field Notes Text(4000)?
    Field Status Enum(ToDo, Done) = ToDo
    Field Assignee -> Identity?

    Present
        Label "Task"
        PluralLabel "Tasks"
        RecordLabel Title

        Field Notes
            Label "Internal notes"

        Listing
            Fields Title, Status, Assignee

        Details
            Fields Title, Status, Assignee, Notes

        Creating
            Mode Page
            Fields Title, Assignee

        Editing
            Mode Inline
            Fields Title, Status

        Actions
            Delete
                Confirm "Delete this task and its history?"
```

Everything is optional. Omitted settings keep the defaults described below.

## Labels

| Setting | Default |
| --- | --- |
| `Label "Order"` | the entity name in words: `SalesOrder` becomes *Sales order* |
| `PluralLabel "Orders"` | the label with its last word pluralized |
| `RecordLabel Number` | the first `Text` field, otherwise the first other text, number, date, or enum field |
| `Field DueDate` + `Label "Due"` | the field name in words: *Due date* |

The record label names a record in page titles, pickers, breadcrumbs, and references from other records. The app never falls back to the record ID.

## Surfaces

`Listing`, `Details`, `Creating`, and `Editing` each take `Fields`, an ordered list of fields to show. Without it, a surface shows every field in declaration order.

`Creating` and `Editing` also take a `Mode`:

| Mode | Creating | Editing |
| --- | --- | --- |
| `Page` | a separate page (default) | a separate page (default) |
| `Modal` | a dialog over the list | a dialog over the list or detail page |
| `Inline` | not allowed | a form inside the list row |
| `None` | no create control | no edit control |

`None` removes the generated control only. The API action still exists for other clients.

A create form must include every required field that has no default; otherwise the server rejects the request.

## Reference pickers

An `Input` inside `Creating` or `Editing` chooses how a relationship is picked:

```bev
        Creating
            Input Customer
                Picker Modal
```

| Picker | Use when |
| --- | --- |
| `Combobox` (default) | Any size of list: a searchable popover that loads 20 records at a time |
| `Dropdown` | Short lists: up to 50 records in a plain select; larger lists show a message instead of a truncated list |
| `Modal` | A dialog with search, for a roomier choice |

Search uses the target's picker `SearchBy` fields, or its record label when that is text. See [Relationships](/guide/relationships#who-may-pick-a-record).

## Actions

`Actions` adjusts the buttons of the declared CRUD actions. List an action by verb and set any of:

| Setting | Values | Default |
| --- | --- | --- |
| `Label` | quoted text | Create, View, Edit, Delete |
| `Emphasis` | `Default`, `Primary`, `Destructive` | Primary for Create, Destructive for Delete |
| `Confirm` | quoted text | Delete asks for confirmation |
| `Place` | `Navigation`, `ListingToolbar`, `ListingRow`, `DetailsToolbar` | see below |
| `Order` | a whole number | 0 |
| `Hidden` | `true` or `false` | false |

Default places: Create in the `ListingToolbar`; Read in the `Navigation` (the sidebar) and each `ListingRow`; Update and Delete in each `ListingRow` and the `DetailsToolbar`.

```bev
        Actions
            Read
                Place ListingRow           # do not list the entity in the sidebar
            Update
                Label "Change"
            Delete
                Hidden true
```

`Hidden true` removes the control and its page, not the permission.
