# Customizing

The generated app and API are a starting point, not a cage. `client/` and `server/` are ordinary projects in your repository; change them like any other code.

## Theme

Colors, radius, and font are CSS variables in `client/src/assets/index.css`, in the [shadcn-vue](https://www.shadcn-vue.com/docs/theming) format. For example, a blue primary color:

```css
:root {
  --primary: oklch(0.45 0.16 255);
  --primary-foreground: oklch(0.98 0 0);
}
```

Dark mode follows the visitor's system and can be switched in the sidebar. Replace `client/public/favicon.svg` and `client/src/components/AppMark.vue` to add your logo.

## Pages

Routes live in `client/src/pages`:

| Route | File |
| --- | --- |
| `/` | `index.vue` (renders `HomePage.vue`) |
| `/sign-in` | `sign-in.vue` |
| `/:entity` | `[entityRoute]/index.vue` (renders `EntityListPage.vue`) |
| `/:entity/new` | `[entityRoute]/new.vue` |
| `/:entity/:id` | `[entityRoute]/[id]/index.vue` |
| `/:entity/:id/edit` | `[entityRoute]/[id]/edit.vue` |

Nuxt prefers a specific route over a dynamic one, so a custom page for one entity is a new file:

```vue
<!-- client/src/pages/orders/index.vue -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { BeverRecord } from '@bever/sdk'
import { useBeverClient } from '@/bever/model'

const orders = ref<BeverRecord[]>([])
onMounted(async () => { orders.value = await useBeverClient().list('orders') })
</script>

<template>
  <h1 class="text-2xl font-semibold">Open orders</h1>
  <ul>
    <li v-for="order in orders.filter((item) => item.status === 'Open')" :key="order.id">
      {{ order.number }} for {{ order._labels?.customer }}
    </li>
  </ul>
</template>
```

`useBeverClient()` returns the [JavaScript SDK](/reference/sdk) client, already configured for sign-in and antiforgery tokens. `app` from `@/bever/model` describes the model: entities, fields, actions, and resolved presentation.

## Components

`client/src/components` holds the building blocks the pages use: `RecordTable`, `DynamicForm`, `DynamicField`, `ReferencePicker`, `FieldValue`, and `SignInPanel`. Edit them to change every page at once; for example, `FieldValue.vue` decides how each type is displayed. The primitives in `components/ui` come from shadcn-vue; add more with `npx shadcn-vue@latest add <component>`.

## Server

`server/Program.cs` is a normal ASP.NET Core application. Add your own endpoints, middleware, and services around Bever:

```csharp
app.MapBeverApi();

app.MapGet("/api/v1/health", () => Results.Ok(new { status = "ok" }));
```

Options can also come from configuration (the `Bever` section, or environment variables such as `Bever__DatabasePath`):

| Option | Default | Meaning |
| --- | --- | --- |
| `ModelPath` | `../bev/.output/model.json` | The compiled model, relative to the server folder |
| `DatabasePath` | `../.bever/bever.db` | The SQLite file |
| `ApiPrefix` | `/api/v1` | Where the API routes live |

To store records somewhere else, register your own `IBeverDatabaseProvider` before `AddBever()`. The provider decides storage only; validation, permissions, and reference checks stay in Bever.
