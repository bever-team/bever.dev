# Tutorial: an order desk

In this tutorial you build a small order desk: customers, products, and orders, where everyone on the team can see orders but only an order's sales rep may change it. It takes about fifteen minutes.

## 1. Create the project

```sh
bever new "Order Desk"
cd "Order Desk"
```

Do not run `bever dev` yet: you will replace the starter model first, so the first database is created from your model.

## 2. Customers

Replace the contents of `bev/app.bev` with:

```bev
Identity
    Registration Enabled

Entity Customer
    Field Name Text(200)
    Field Email Email
    Field Phone Phone?
    Field Tier Enum(Standard, Gold) = Standard

Action Crud Customer
    By Authenticated
    OrderBy Name
```

- `Identity` turns on sign-in with email and password. `Registration Enabled` lets people create their own accounts.
- `Text(200)` is text of at most 200 characters. `Email` and `Phone` are text with a format the server checks. `Phone?` may be left empty; every field without `?` is required.
- `Enum(Standard, Gold) = Standard` allows exactly those two values and defaults to `Standard`.
- `Action Crud Customer` declares create, read, update, and delete. `By Authenticated` allows any signed-in account. `OrderBy Name` sorts the customer list.

Now start the app:

```sh
bever dev
```

Open <http://localhost:3000>, create an account, and add a customer. Try saving one with the email `nobody`: the form says *Enter a valid email address.* before anything reaches the server, and the server would reject it too.

## 3. Products and orders

Keep `bever dev` running and add two entities:

```bev
Entity Product
    Field Name Text(120)
    Field Price Money
    Field Active Boolean = True

Entity Order
    Field Number Text(20)
    Field Customer -> Customer
    Field Product -> Product
    Field Quantity Int = 1
    Field Status Enum(Open, Shipped, Cancelled) = Open
    Field OrderedOn Date
    Field SalesRep -> Identity

Action Crud Product
    By Authenticated

Action Crud Order
    By Authenticated
```

`Field Customer -> Customer` is a relationship: an order stores a reference to one customer. In forms it becomes a searchable picker that shows customer names, never IDs. `-> Identity` references a signed-in account.

When you save, `bever dev` shows the database change and asks before applying it:

```text
The database schema changed:
  safe              create entity Order
  safe              create entity Product
Create and apply this migration? [y/N]
```

Answer `y`. The sidebar now lists Products and Orders.

By default a customer cannot be deleted while orders reference it (`OnDelete Restrict`). To delete a customer's orders along with the customer, write `Field Customer -> Customer OnDelete Cascade`.

## 4. Permissions

Everyone should see all orders, but only the order's sales rep may change or delete it. Replace the order action:

```bev
Action Create, Read Order
    By Authenticated

Action Update, Delete Order
    By SalesRep
```

`By SalesRep` means "the account stored in this order's `SalesRep` field". The server enforces it on every request: another account that tries to change the order gets `403 Forbidden`, and the app only offers Edit and Delete where they can succeed. This change does not touch the database, so `bever dev` just restarts the API.

Rules on `Read` filter instead of refusing. If you wrote `Action Read Order By SalesRep`, each person's order list would contain only their own orders.

## 5. Presentation

The app shows every field by default. Tell it what matters in the order list and how to edit an order:

```bev
Entity Order
    Field Number Text(20)
    # ... the same fields as before ...

    Present
        RecordLabel Number
        Field OrderedOn
            Label "Order date"

        Listing
            Fields Number, Customer, Status, OrderedOn, SalesRep

        Editing
            Mode Modal

        Creating
            Mode Page
            Fields Number, Customer, Product, Quantity, OrderedOn, SalesRep
            Input Product
                Picker Dropdown
```

- `RecordLabel Number` is how an order is named in page titles, pickers, and other records.
- `Listing` chooses and orders the columns of the list.
- `Editing Mode Modal` edits an order in a dialog instead of a separate page. `Inline` edits it inside the list row.
- `Picker Dropdown` shows products in a simple dropdown; the default is a searchable combobox.

Presentation never changes what the API allows. See [Presentation](/guide/presentation) for every option.

## 6. Administrators

An Administrator may perform every action, regardless of `By` rules. Make your account one:

```sh
bever identity admin add --email you@example.com
```

Use `bever identity bootstrap --email ...` instead on a fresh database without accounts: it creates the first account as an Administrator.

## 7. Ship it

Build a container that serves the app and the API on port 8080:

```sh
docker build -t order-desk .
docker run --rm -v order-desk-data:/app/.bever order-desk migrate
docker run -d -p 8080:8080 -v order-desk-data:/app/.bever order-desk
```

The [deployment guide](/guide/deployment) covers HTTPS, configuration, backups, and hosting without Docker.

## The complete model

```bev
Identity
    Registration Enabled

Entity Customer
    Field Name Text(200)
    Field Email Email
    Field Phone Phone?
    Field Tier Enum(Standard, Gold) = Standard

Entity Product
    Field Name Text(120)
    Field Price Money
    Field Active Boolean = True

Entity Order
    Field Number Text(20)
    Field Customer -> Customer
    Field Product -> Product
    Field Quantity Int = 1
    Field Status Enum(Open, Shipped, Cancelled) = Open
    Field OrderedOn Date
    Field SalesRep -> Identity

    Present
        RecordLabel Number
        Field OrderedOn
            Label "Order date"

        Listing
            Fields Number, Customer, Status, OrderedOn, SalesRep

        Editing
            Mode Modal

        Creating
            Mode Page
            Fields Number, Customer, Product, Quantity, OrderedOn, SalesRep
            Input Product
                Picker Dropdown

Action Crud Customer
    By Authenticated
    OrderBy Name

Action Crud Product
    By Authenticated

Action Create, Read Order
    By Authenticated

Action Update, Delete Order
    By SalesRep
```
