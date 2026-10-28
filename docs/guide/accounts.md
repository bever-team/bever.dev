# Sign-in and accounts

A top-level `Identity` block turns on sign-in with an email address and a password:

```bev
Identity
    Registration Enabled
```

| Member | Effect |
| --- | --- |
| *(none)* | Sign-in and sign-out. Accounts are created from the command line. |
| `Registration Enabled` | People can create their own accounts in the app. |

With `Identity` you can reference accounts with `-> Identity` fields, write [owner rules](/guide/permissions#owner-rules) such as `By Owner`, and declare [roles](/guide/permissions#roles) such as `Role Agent`.

## How sign-in works

- Passwords are hashed with ASP.NET Core's password hasher (PBKDF2). New passwords need at least 8 characters.
- A successful sign-in sets an `HttpOnly`, `SameSite=Lax` cookie. Outside development the cookie is `Secure`, so production must use HTTPS.
- Every change request carries an antiforgery token. The generated app fetches one before each change.
- The project's `server/Program.cs` allows at most 10 sign-in or registration attempts per minute from one address.
- Accounts, their password hashes, and their roles live in private tables in the same SQLite database, separate from your entities.

## Managing accounts

```sh
bever identity bootstrap --email you@example.com       # create the first account, as an Administrator
bever identity list                                    # accounts and their roles
bever identity admin add --email teammate@example.com   # make an existing account an Administrator
bever identity admin revoke --email teammate@example.com
```

`bootstrap` prompts for a password when you leave out `--password`, and refuses once an Administrator exists. The last Administrator cannot be revoked.

## Roles

Accounts get the roles the model declares in one of two ways:

- **In the app.** When the model declares a role, Administrators see a *People* page listing every account with a switch per role.
- **From the command line.** `bever identity role add --email ada@example.com --role Agent` assigns a role, and `role revoke` removes it. `role add` only accepts roles the model declares; `role revoke` also removes a role you have since deleted from the model.

Role changes apply to the account's next request. Every assignment and removal is written to a private audit table, with the Administrator who made it in the app. Administrators themselves are only ever made from the command line.

## Grants

Grants give one account one action without changing the model:

```sh
bever identity grant add --email auditor@example.com --entity Order --action Read
bever identity grant add --email helper@example.com --entity Order --action Update --record 6f3a2c…
bever identity grant list --email auditor@example.com
bever identity grant revoke --grant <grant-id>
```

An entity-wide `Read` grant lets the account see every record in lists. A record grant (`--record`) applies to that record only and works with `Read`, `Update`, `Delete`, and `Pick`.

## The identity schema

Account tables are created with the database. `bever dev` and `bever migration apply` create or upgrade them whenever the model declares `Identity`. To manage them separately:

```sh
bever identity schema status
bever identity schema apply
```

Outside development, the server refuses to start when the model declares `Identity` but the account tables are missing or out of date, or when sign-in cookies would not be `Secure`.
