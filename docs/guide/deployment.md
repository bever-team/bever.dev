# Deployment

A Bever app deploys as one ASP.NET Core application that serves both the API and the built client, with a SQLite database on persistent storage.

## Checklist

- Serve over **HTTPS**. Outside development, sign-in cookies are `Secure`, so browsers send them only over HTTPS.
- Keep `.bever/` on **persistent storage**: it holds the database and the keys that encrypt sign-in cookies.
- Run **migrations** as a release step, before starting a new version.
- **Back up** `.bever/bever.db`.

## With Docker

Every project includes a `Dockerfile`:

```sh
docker build -t my-app .
docker volume create my-app-data

# Release step: bring the database up to date, then exit.
docker run --rm -v my-app-data:/app/.bever my-app migrate

# Start the app on port 8080.
docker run -d --name my-app -p 8080:8080 -v my-app-data:/app/.bever my-app
```

The image compiles `bev/`, builds the client into the server's `wwwroot`, and publishes the server. It runs as a non-root user and stores data in the `/app/.bever` volume.

Put a reverse proxy that terminates TLS (Caddy, nginx, a cloud load balancer) in front of port 8080, and set `ASPNETCORE_FORWARDEDHEADERS_ENABLED=true` so the app sees the original scheme and client address:

```sh
docker run -d -p 8080:8080 -e ASPNETCORE_FORWARDEDHEADERS_ENABLED=true -v my-app-data:/app/.bever my-app
```

## Without Docker

On a machine with the .NET 10 SDK, Node.js, and the Bever CLI:

```sh
bever compile                              # bev/.output/model.json
npm --prefix client ci                     # or npm install
npm --prefix client run generate           # builds the client into server/wwwroot
dotnet publish server -c Release -o out
```

Copy `out/` and `bev/` to the server so that `bev/` sits next to the published folder, then:

```sh
bever migration apply --bev ./bev          # creates ./.bever/bever.db
cd out && dotnet MyApp.Server.dll
```

The runtime needs only the ASP.NET Core 10 runtime. Configure it with environment variables:

| Variable | Example | Purpose |
| --- | --- | --- |
| `ASPNETCORE_HTTP_PORTS` | `8080` | Listening port |
| `Bever__DatabasePath` | `/var/lib/my-app/bever.db` | Database location |
| `Bever__ModelPath` | `/srv/my-app/bev/.output/model.json` | Compiled model location |
| `ASPNETCORE_FORWARDEDHEADERS_ENABLED` | `true` | Behind a reverse proxy |

## Upgrading

1. Pull the new version of your project (model, migrations, client, server).
2. Run migrations: `docker run --rm -v my-app-data:/app/.bever my-app migrate`, or `bever migration apply`.
3. Restart the app.

At startup the server logs a critical message when the database is behind the model. Database changes that delete data are never applied unless a migration file you committed says so.

## Backups

SQLite keeps everything in one file. Back it up with the SQLite online backup, which is safe while the app runs:

```sh
sqlite3 /path/to/.bever/bever.db ".backup '/backups/bever-$(date +%F).db'"
```

## Scale

One SQLite database serves one app instance. That covers a large share of business applications: thousands of records, dozens of concurrent users. Lists currently return all visible records of an entity, and the app pages them in the browser; plan for that when an entity grows into the tens of thousands of records. Other databases and server-side paging are on the [roadmap](/roadmap).
