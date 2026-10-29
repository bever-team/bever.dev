# Roadmap

Bever is pre-alpha, and the language is expected to change, including what is already implemented (see [Status](/guide/what-is-bever#status)). This page lists what is planned, so you can see where the language is going and what to expect from the compiler today. Planned keywords are reserved: the compiler reports them as *not supported yet* instead of ignoring them.

Discuss priorities and proposals in the [issue tracker](https://github.com/bever-team/bever/issues).

## Language

| Feature | Sketch |
| --- | --- |
| Rules on actions | `Rule Status = Pending "Can only modify pending orders"` under `Action Update`, checked against the stored record |
| More rule expressions | `Length(Reason) >= 50`, arithmetic, and rules through relationships |
| State machines and transitions | `State Status` with allowed transitions and who may make them |
| Computed fields | `Computed Total = Quantity * UnitPrice` |
| Aggregates | `Aggregate OpenTickets = Count(Tickets Where Status != Closed)` |
| Role levels and inheritance | `Levels Junior < Senior < Lead` and `Inherits Agent` under `Role` |
| Custom actions | Named actions such as `Approve` with their own input and permissions |
| Conditional permissions | `By Authenticated Where Status = Draft` |
| Events and notifications | `On Order/Status IsChangedInto Shipped` with `Notify Customer` |
| Scheduled tasks | `Schedule Every 1h` |
| Named queries | Reusable filtered and sorted views |
| Auditing | `Audit Order` with a change history |
| Seed data | Records created on deployment |
| More types | `Duration`, `File`, `Image`, `Multiple(n)` collections |
| Polymorphic relationships | `-> Agent Or Customer` |
| Paths through relationships | `By Project/Owner`, `Fields Customer/Name` |
| Explicit renames | Renaming a field or entity without dropping its data |

## Runtime and tooling

- Server-side paging, filtering, and sorting for large lists
- More databases (PostgreSQL first)
- Password reset and email delivery
- More project templates and client frameworks
- A language server for richer editor support
