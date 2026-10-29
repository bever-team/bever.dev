<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

// Each source line appears at a step. The final model passes `bever check`.
const lines: [string, number][] = [
  ['Entity Project', 3],
  ['    Field Name Text(120)', 3],
  ['', 3],
  ['Entity Task', 0],
  ['    Field Title Text(200)', 0],
  ['    Field Project -> Project', 3],
  ['    Field Status Enum(ToDo, InProgress, Done) = ToDo', 1],
  ['    Field DueDate Date?', 2],
  ['', 5],
  ['    Present', 5],
  ['        Label "Work item"', 5],
  ['        Listing', 5],
  ['            Fields Title, Status, Project, DueDate', 5],
  ['', 0],
  ['Action Crud Project', 3],
  ['    By Authenticated', 3],
  ['', 3],
  ['Action Crud Task', 0],
  ['    By Authenticated', 0],
  ['    OrderBy DueDate', 4],
]

const captions = [
  'Declare an entity and who may use it',
  'Add a field with allowed values',
  'Add an optional date',
  'Relate tasks to projects',
  'Order the list',
  'Rename it and choose the columns',
]
const last = captions.length - 1

const rows = [
  { id: 1, title: 'Write the homepage copy', project: 'Website relaunch', status: 'In progress', due: 'Nov 4', sort: 4 },
  { id: 2, title: 'Collect Q3 sales figures', project: 'Quarterly report', status: 'Done', due: 'Oct 30', sort: 0 },
  { id: 3, title: 'Compare moving companies', project: 'Office move', status: 'To do', due: 'Nov 20', sort: 20 },
  { id: 4, title: 'Review the new navigation', project: 'Website relaunch', status: 'To do', due: 'Nov 6', sort: 6 },
]

const columnLabels: Record<string, string> = { title: 'Title', project: 'Project', status: 'Status', due: 'Due date' }

const step = ref(0) // the step being typed
const typed = ref(0) // characters of this step's new lines typed so far
const applied = ref(-1) // the step the app reflects
const compiling = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

const stepLength = (s: number) => lines.filter(([, at]) => at === s).reduce((n, [text]) => n + text.length + 1, 0)

const shownLines = computed(() => {
  let budget = typed.value
  const out: { text: string; fresh: boolean; cursor: boolean }[] = []
  for (const [text, at] of lines) {
    if (at < step.value) out.push({ text, fresh: false, cursor: false })
    else if (at === step.value && budget > 0) {
      const visible = text.slice(0, budget)
      budget -= text.length + 1
      out.push({ text: visible, fresh: true, cursor: budget <= 0 && typed.value < stepLength(step.value) })
    }
  }
  return out
})

const label = computed(() => (applied.value >= 5 ? 'Work item' : 'Task'))
const columns = computed(() => {
  const a = applied.value
  if (a < 0) return []
  if (a >= 5) return ['title', 'status', 'project', 'due']
  return ['title', a >= 3 && 'project', a >= 1 && 'status', a >= 2 && 'due'].filter(Boolean) as string[]
})
const sortedRows = computed(() => (applied.value >= 4 ? [...rows].sort((x, y) => x.sort - y.sort) : rows))

const freshColumns = ref<string[]>([])
watch(columns, (now, before) => {
  freshColumns.value = now.filter((c) => !before.includes(c))
})

const keywords = /\b(Entity|Field|Action|Crud|By|OrderBy|Present|Label|Listing|Fields)\b/g
const types = /\b(Text|Enum|Date|Authenticated)\b/g
function highlight(text: string) {
  const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  return escaped
    .replace(/"[^"]*"?/g, (m) => `<span class="s">${m}</span>`)
    .replace(keywords, '<span class="k">$1</span>')
    .replace(types, '<span class="t">$1</span>')
    .replace(/\d+/g, '<span class="n">$&</span>')
}

function tick() {
  if (typed.value < stepLength(step.value)) {
    typed.value++
    timer = setTimeout(tick, 12 + Math.random() * 22)
    return
  }
  compiling.value = true
  timer = setTimeout(() => {
    compiling.value = false
    applied.value = step.value
    timer = setTimeout(() => {
      if (step.value === last) {
        step.value = 0
        applied.value = -1
      } else step.value++
      typed.value = 0
      tick()
    }, step.value === last ? 4500 : 2200)
  }, 450)
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    step.value = applied.value = last
    typed.value = stepLength(last)
  } else timer = setTimeout(tick, 600)
})
onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <section class="live-demo" aria-label="A .bev model and the app it produces, updating together">
    <div class="pane editor">
      <div class="bar">
        <span class="dots"><i /><i /><i /></span>
        <span class="file">bev/tasks.bev</span>
        <span class="status" :class="{ busy: compiling }">{{ compiling ? 'Compiling' : 'No errors' }}</span>
      </div>
      <pre class="code"><code><span v-for="(line, i) in shownLines" :key="i" class="line" :class="{ fresh: line.fresh }"><span v-html="highlight(line.text)" /><span v-if="line.cursor" class="cursor" />
</span></code></pre>
      <div class="caption">
        <span class="step">{{ step + 1 }}/{{ captions.length }}</span>
        {{ captions[step] }}
      </div>
    </div>

    <div class="pane app" aria-hidden="true">
      <div class="bar">
        <span class="dots"><i /><i /><i /></span>
        <span class="url">localhost:3000/tasks</span>
      </div>
      <div class="frame">
        <aside class="side">
          <div class="brand"><span class="avatar">A</span>Acme Tasks</div>
          <nav>
            <span>Home</span>
            <span v-if="applied >= 3" class="appear">Projects</span>
            <span v-if="applied >= 0" class="active">{{ label }}s</span>
          </nav>
          <div class="user">ada@acme.test</div>
        </aside>
        <main class="main">
          <template v-if="applied >= 0">
            <div class="head">
              <div>
                <h3 :key="label" class="appear">{{ label }}s</h3>
                <p>{{ rows.length }} {{ label.toLowerCase() }}s</p>
              </div>
              <span :key="label" class="new appear">+ New {{ label.toLowerCase() }}</span>
            </div>
            <div class="search">Search {{ label.toLowerCase() }}s</div>
            <table>
              <thead>
                <tr>
                  <th v-for="c in columns" :key="c" :class="{ flash: freshColumns.includes(c) }">
                    {{ columnLabels[c] }}<span v-if="c === 'due' && applied >= 4" class="sorted"> ↑</span>
                  </th>
                </tr>
              </thead>
              <TransitionGroup tag="tbody" name="row">
                <tr v-for="r in sortedRows" :key="r.id">
                  <td v-for="c in columns" :key="c" :class="{ flash: freshColumns.includes(c) }">
                    <span v-if="c === 'status'" class="badge">{{ r.status }}</span>
                    <template v-else>{{ r[c as keyof typeof r] }}</template>
                  </td>
                </tr>
              </TransitionGroup>
            </table>
          </template>
          <div v-else class="empty">Waiting for a model</div>
        </main>
      </div>
    </div>
  </section>
</template>

<style scoped>
.live-demo {
  display: grid;
  gap: 20px;
  max-width: 1152px;
  margin: 0 auto;
  padding: 0 24px;
}

@media (min-width: 960px) {
  .live-demo {
    grid-template-columns: minmax(0, 5fr) minmax(0, 6fr);
  }
}

.pane {
  display: flex;
  flex-direction: column;
  min-width: 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  overflow: hidden;
  background: var(--vp-c-bg);
  box-shadow: 0 1px 2px rgba(15, 30, 36, 0.06), 0 24px 60px -20px rgba(15, 30, 36, 0.25);
}

.bar {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 40px;
  padding: 0 14px;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  font-size: 12px;
  color: var(--vp-c-text-2);
}

.dots {
  display: flex;
  gap: 6px;
}

.dots i {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--vp-c-divider);
}

.file,
.url {
  font-family: var(--vp-font-family-mono);
}

.status {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 6px;
}

.status::before {
  content: '';
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #2f9e6e;
}

.status.busy::before {
  background: var(--bever-copper);
  animation: pulse 0.6s ease-in-out infinite alternate;
}

.editor {
  background: #0f1e24;
  border-color: #1d3640;
}

.editor .bar {
  background: #0b171c;
  border-color: #1d3640;
  color: #9fb3ba;
}

.editor .dots i {
  background: #2a4652;
}

.code {
  flex: 1;
  margin: 0;
  padding: 16px 0;
  min-height: 480px;
  overflow-x: auto;
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  line-height: 1.7;
  color: #d5e2e6;
}

.line {
  display: block;
  padding: 0 18px;
  white-space: pre;
  border-left: 2px solid transparent;
}

.line.fresh {
  background: rgba(124, 195, 205, 0.09);
  border-left-color: #7cc3cd;
}

.code :deep(.k) {
  color: #7cc3cd;
}

.code :deep(.t) {
  color: #e8a274;
}

.code :deep(.s) {
  color: #a5d6a7;
}

.code :deep(.n) {
  color: #f0c987;
}

.cursor {
  display: inline-block;
  width: 7px;
  height: 15px;
  margin-left: 1px;
  vertical-align: -2px;
  background: #7cc3cd;
  animation: blink 1s steps(1) infinite;
}

.caption {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  border-top: 1px solid #1d3640;
  font-size: 13px;
  color: #d5e2e6;
}

.step {
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(124, 195, 205, 0.16);
  color: #7cc3cd;
}

.frame {
  display: flex;
  flex: 1;
  min-height: 480px;
  font-size: 13px;
  color: var(--vp-c-text-1);
}

.side {
  display: flex;
  flex-direction: column;
  width: 140px;
  flex-shrink: 0;
  padding: 14px 10px;
  border-right: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-alt);
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  margin: 0 4px 16px;
  white-space: nowrap;
}

.avatar {
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 6px;
  background: var(--vp-c-text-1);
  color: var(--vp-c-bg);
  font-size: 11px;
}

.side nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.side nav span {
  padding: 6px 8px;
  border-radius: 6px;
  color: var(--vp-c-text-2);
}

.side nav .active {
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-1);
}

.user {
  margin-top: auto;
  padding: 0 4px;
  font-size: 11px;
  color: var(--vp-c-text-2);
}

.main {
  flex: 1;
  min-width: 0;
  padding: 20px;
  overflow: hidden;
}

.head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.head h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.head p {
  margin: 2px 0 0;
  font-size: 12px;
  color: var(--vp-c-text-2);
}

.new {
  padding: 6px 10px;
  border-radius: 7px;
  background: var(--vp-c-text-1);
  color: var(--vp-c-bg);
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.search {
  margin: 14px 0 12px;
  max-width: 220px;
  padding: 6px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 7px;
  font-size: 12px;
  color: var(--vp-c-text-3);
}

table {
  display: table;
  table-layout: fixed;
  width: 100%;
  margin: 0;
  border-collapse: separate;
  border-spacing: 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  overflow: hidden;
  font-size: 12px;
}

th,
td {
  padding: 9px 10px;
  border: 0;
  border-bottom: 1px solid var(--vp-c-divider);
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

th:first-child {
  width: 38%;
}

th {
  font-weight: 600;
  background: var(--vp-c-bg-soft);
}

tr {
  background: var(--vp-c-bg);
  border: 0;
}

tbody tr:last-child td {
  border-bottom: 0;
}

.badge {
  padding: 2px 7px;
  border-radius: 999px;
  background: var(--vp-c-default-soft);
  font-size: 11px;
}

.sorted {
  color: var(--bever-copper);
}

.dark .sorted {
  color: #e8a274;
}

.empty {
  display: grid;
  place-items: center;
  height: 100%;
  color: var(--vp-c-text-3);
}

.flash {
  animation: flash 1.4s ease-out;
}

.appear {
  animation: appear 0.4s ease-out;
}

.row-move {
  transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
}

@keyframes flash {
  from {
    background: rgba(124, 195, 205, 0.35);
  }
}

@keyframes appear {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

@keyframes pulse {
  to {
    opacity: 0.3;
  }
}

@media (max-width: 640px) {
  .live-demo {
    padding: 0 16px;
  }

  .side {
    display: none;
  }

  .code {
    min-height: 420px;
    font-size: 11.5px;
  }

  .frame {
    min-height: 300px;
  }
}
</style>
