---
layout: home
title: Business logic as code
titleTemplate: Bever

hero:
  text: Business logic as code.
  tagline: Write what your business needs in one readable file. Bever turns it into a validated, authorized API and a working web app, on defaults you can replace. Your team reads it, your AI writes it, and nothing hides in the plumbing.
  image:
    light: /brand/bever-mark.svg
    dark: /brand/bever-mark.svg
    alt: Bever
  actions:
    - theme: brand
      text: Get started
      link: /guide/getting-started
    - theme: alt
      text: Why Bever
      link: '#why'
    - theme: alt
      text: GitHub
      link: https://github.com/bever-team
---

<div class="bever-home vp-doc">

<p class="bever-demo-note">A real model, typed change by change. Each change compiles, and the app follows it.</p>

<section id="why" class="bever-section">

<p class="bever-eyebrow">The problem</p>

## Your rules are buried in code

A rule as simple as "signed-in people may change a task's status, and the status is To do, In progress, or Done" ends up spread across a controller, a validator, a migration, a form, client types, and the tests that keep them in step. Nobody can point to where the rule lives, so every change is a search, and every search can miss a copy.

<div class="bever-compare">

<div class="bever-card">
<p class="bever-card-title">A typical stack</p>
<ul class="bever-files">
  <li><code>TasksController.cs</code><span>who may call it</span></li>
  <li><code>TaskValidator.cs</code><span>the allowed values</span></li>
  <li><code>20261028_AddStatus.cs</code><span>the column and its default</span></li>
  <li><code>TaskForm.vue</code><span>the select options</span></li>
  <li><code>api/types.ts</code><span>the client's copy of the shape</span></li>
  <li><code>TaskTests.cs</code><span>the checks that they still agree</span></li>
</ul>
</div>

<div class="bever-card bever-card-accent">
<p class="bever-card-title">Bever</p>

```bev
Entity Task
    Field Status Enum(ToDo, InProgress, Done) = ToDo

Action Crud Task
    By Authenticated
```

<p class="bever-card-foot">One place to read, one place to change. The server enforces it, the database migration follows it, and the app shows it.</p>
</div>

</div>

</section>

<section class="bever-section">

<p class="bever-eyebrow">Built for AI-assisted development</p>

## Your AI writes the model, not the plumbing

Coding agents spend most of their effort reading and rewriting boilerplate. With Bever, a feature is a few lines in a `.bev` file. The server and the app read the compiled model, so the agent has nothing else to keep in sync.

<div class="bever-ai">

<div class="bever-prompt">
<p class="bever-prompt-ask">Add a priority to tasks, Normal by default.</p>

```diff
 Entity Task
     Field Title Text(200)
     Field Status Enum(ToDo, InProgress, Done) = ToDo
+    Field Priority Enum(Low, Normal, High) = Normal
```

<p class="bever-card-foot">The API validates it, the migration adds the column with a value for existing rows, and the list and forms show it.</p>
</div>

<div class="bever-points">
  <div>
    <h3>Fewer tokens per change</h3>
    <p>The agent reads and writes a model of a few dozen lines instead of controllers, forms, and migrations. Smaller context, smaller output, lower cost.</p>
  </div>
  <div>
    <h3>Diffs you can review at a glance</h3>
    <p>A feature is a short change to one readable file, not a pull request across twenty. You see the business change, not the wiring.</p>
  </div>
  <div>
    <h3>Guardrails the agent cannot skip</h3>
    <p>The compiler rejects mistakes with file, line, and column. The server checks every permission, whatever the agent wrote. Destructive migrations wait for your consent.</p>
  </div>
</div>

</div>

</section>

<section id="customizable" class="bever-section">

<p class="bever-eyebrow">Customizable</p>

## Opinionated defaults you can replace

`bever new` picks a stack so you can start in minutes: Nuxt for the app, SQLite for the data, and ASP.NET Core for the server. None of it is locked in. The model is the contract, and every layer around it is a default you can change.

<div class="bever-compare">

<div class="bever-card">
<p class="bever-card-title">The default, and how to change it</p>
<ul class="bever-files">
  <li>Nuxt web app<span>any framework, through <code>@bever/sdk</code> or the HTTP API</span></li>
  <li>SQLite<span>your own <code>IBeverDatabaseProvider</code></span></li>
  <li>shadcn-vue components<span>ordinary files in <code>client/</code></span></li>
  <li>Theme<span>CSS variables for colors, radius, and font</span></li>
  <li>ASP.NET Core server<span>your own endpoints, middleware, and services</span></li>
</ul>
<p class="bever-card-foot"><a class="bever-link" href="/guide/customizing">Read the customizing guide →</a></p>
</div>

<div class="bever-points">
  <div>
    <h3>The rules stay with the model</h3>
    <p>Validation and permissions run in the server, whatever client or database you use. A replacement decides where data is stored or how it looks, never whether a request is allowed.</p>
  </div>
  <div>
    <h3>Nothing to eject</h3>
    <p><code>client/</code> and <code>server/</code> are ordinary projects in your repository, and Bever comes in as packages. Replace one page and the model still drives the rest.</p>
  </div>
  <div>
    <h3>A documented contract</h3>
    <p>The compiled model is JSON in a <a href="/reference/semantic-model">documented format</a>, so your own tools and scripts can read it too.</p>
  </div>
</div>

</div>

</section>

<section class="bever-section">

<p class="bever-eyebrow">What you get</p>

## A complete application from the model

<div class="bever-grid">
  <div>
    <h3>Secure by default</h3>
    <p>Every action names who may perform it. The server checks every request, filters lists to what each person may see, and rejects values that do not match their type.</p>
  </div>
  <div>
    <h3>An app on day one</h3>
    <p>Lists with search and sorting, forms with validation, relationship pickers, sign-in, dark mode, and a phone layout.</p>
  </div>
  <div>
    <h3>Safe database changes</h3>
    <p>Schema changes become reviewed migration files. Destructive changes need consent, and new required fields need a value for existing rows.</p>
  </div>
  <div>
    <h3>Code you own</h3>
    <p><code>client/</code> is a normal Nuxt app and <code>server/</code> is a normal ASP.NET Core app. Change any page, component, or endpoint; Bever stays a library.</p>
  </div>
  <div>
    <h3>Business meaning first</h3>
    <p>A <code>.bev</code> file says what the business needs and nothing about how a framework wires it up. Product owners can read it.</p>
  </div>
  <div>
    <h3>Open source</h3>
    <p>The language, compiler, runtime, and tools are Apache 2.0. A project created with <code>bever new</code> is entirely yours.</p>
  </div>
</div>

</section>

<section class="bever-section bever-start">

<div>

## Run it yourself

Four commands give you a task app with sign-in, projects, and tasks, running locally.

```sh
dotnet tool install --global Bever.Cli
bever new "Acme Tasks"
cd "Acme Tasks"
bever dev
```

<p><a class="bever-link" href="/guide/getting-started">Read the getting started guide →</a></p>

</div>

<div>
  <img class="bever-shot bever-shot-light" src="/screenshots/tasks-light.png" alt="The generated task list: a table of tasks with project, status, priority, due date, and assignee columns.">
  <img class="bever-shot bever-shot-dark" src="/screenshots/tasks-dark.png" alt="The generated task list in dark mode.">
</div>

</section>

</div>
