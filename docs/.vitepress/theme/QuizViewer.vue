<script setup>
import { ref, computed, onMounted } from 'vue'

const questions = ref([])
const currentIndex = ref(0)
const selectedAnswers = ref({})
const showExplanation = ref({})
const searchQuery = ref('')
const filterMode = ref('all') // 'all', 'unanswered', 'incorrect'

onMounted(async () => {
  try {
    const res = await fetch('/DP-750/questions.json')
    if (res.ok) {
      questions.value = await res.json()
    } else {
      const fallback = await fetch('/questions.json')
      questions.value = await fallback.json()
    }
  } catch (e) {
    console.error('Failed to load questions', e)
  }
})

const filteredQuestions = computed(() => {
  return questions.value.filter((q) => {
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      const matchTitle = q.title && q.title.toLowerCase().includes(query)
      const matchExpl = q.explanation && q.explanation.toLowerCase().includes(query)
      const matchOpts = q.options && q.options.some(o => o.text.toLowerCase().includes(query))
      if (!matchTitle && !matchExpl && !matchOpts) return false
    }
    const sel = selectedAnswers.value[q.id]
    if (filterMode.value === 'unanswered') {
      return !sel
    }
    if (filterMode.value === 'incorrect') {
      return sel && sel !== q.correct
    }
    return true
  })
})

const currentQuestion = computed(() => {
  return filteredQuestions.value[currentIndex.value] || null
})

function selectOption(qid, optKey) {
  selectedAnswers.value[qid] = optKey
  showExplanation.value[qid] = true
}

function prevQ() {
  if (currentIndex.value > 0) currentIndex.value--
}

function nextQ() {
  if (currentIndex.value < filteredQuestions.value.length - 1) currentIndex.value++
}

function resetQuiz() {
  selectedAnswers.value = {}
  showExplanation.value = {}
  currentIndex.value = 0
}

const stats = computed(() => {
  let answered = 0
  let correct = 0
  for (const q of questions.value) {
    if (selectedAnswers.value[q.id]) {
      answered++
      if (selectedAnswers.value[q.id] === q.correct) {
        correct++
      }
    }
  }
  return {
    total: questions.value.length,
    answered,
    correct,
    score: answered > 0 ? Math.round((correct / answered) * 100) : 0
  }
})
</script>

<template>
  <div class="sim-wrapper">
    <!-- Telemetry Control Bar -->
    <div class="sim-matrix">
      <div class="matrix-cell">
        <span class="cell-label">TOTAL SCENARIOS</span>
        <span class="cell-value">{{ stats.total }}</span>
      </div>
      <div class="matrix-cell">
        <span class="cell-label">EVALUATED</span>
        <span class="cell-value">{{ stats.answered }}</span>
      </div>
      <div class="matrix-cell">
        <span class="cell-label">CORRECT</span>
        <span class="cell-value green-val">{{ stats.correct }}</span>
      </div>
      <div class="matrix-cell">
        <span class="cell-label">ACCURACY RATE</span>
        <span class="cell-value cyan-val">{{ stats.score }}%</span>
      </div>
    </div>

    <!-- Search & Filter Controls -->
    <div class="sim-filter-row">
      <div class="search-wrap">
        <span class="search-prefix">&gt;</span>
        <input 
          v-model="searchQuery" 
          placeholder="Filter scenarios by keyword (e.g. catalyst, spill, lineage, lakeflow)..." 
          class="sim-search"
        />
      </div>
      <div class="filter-actions">
        <select v-model="filterMode" class="sim-select">
          <option value="all">ALL SCENARIOS</option>
          <option value="unanswered">UNANSWERED ONLY</option>
          <option value="incorrect">INCORRECT ONLY</option>
        </select>
        <button @click="resetQuiz" class="btn-terminal-inline">RESET RIG</button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!currentQuestion" class="sim-empty">
      <p class="mono-label">// NO MATCHING SPECIFICATIONS LOCATED FOR GIVEN QUERY</p>
    </div>

    <!-- Question Box -->
    <div v-else class="sim-card">
      <div class="card-meta">
        <div class="meta-tag">
          <span class="mono-code">INDEX: {{ currentIndex + 1 }} / {{ filteredQuestions.length }}</span>
          <span class="pipe-sep">|</span>
          <span class="mono-code">ID: #{{ currentQuestion.id }}</span>
        </div>
        <div v-if="currentQuestion.objective" class="meta-obj">
          <span class="mono-label">{{ currentQuestion.objective }}</span>
        </div>
      </div>

      <h3 class="scenario-prompt">{{ currentQuestion.title }}</h3>
      <p v-if="currentQuestion.subtitle" class="scenario-sub">{{ currentQuestion.subtitle }}</p>

      <div class="options-container">
        <div 
          v-for="opt in currentQuestion.options" 
          :key="opt.key"
          class="option-row"
          :class="{
            chosen: selectedAnswers[currentQuestion.id] === opt.key,
            valid: showExplanation[currentQuestion.id] && opt.key === currentQuestion.correct,
            invalid: showExplanation[currentQuestion.id] && selectedAnswers[currentQuestion.id] === opt.key && opt.key !== currentQuestion.correct
          }"
          @click="selectOption(currentQuestion.id, opt.key)"
        >
          <div class="opt-key-col">
            <span class="opt-bracket">[</span>
            <span class="opt-letter">{{ opt.key }}</span>
            <span class="opt-bracket">]</span>
          </div>
          <div class="opt-text-col">{{ opt.text }}</div>
        </div>
      </div>

      <div v-if="showExplanation[currentQuestion.id]" class="explanation-pane">
        <div class="expl-header">
          <span class="mono-label">VERIFIED SPECIFICATION // OPTION {{ currentQuestion.correct }}</span>
        </div>
        <p class="expl-content">{{ currentQuestion.explanation }}</p>
      </div>

      <div class="sim-nav-row">
        <button :disabled="currentIndex === 0" @click="prevQ" class="btn-sim-nav">
          &larr; PREVIOUS SPEC
        </button>
        <button :disabled="currentIndex === filteredQuestions.length - 1" @click="nextQ" class="btn-sim-nav active">
          NEXT SPEC &rarr;
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sim-wrapper {
  margin-top: 1.5rem;
}

/* Telemetry Grid */
.sim-matrix {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-elv);
  margin-bottom: 1.25rem;
}

@media (max-width: 640px) {
  .sim-matrix {
    grid-template-columns: repeat(2, 1fr);
  }
}

.matrix-cell {
  padding: 0.9rem 1.1rem;
  border-right: 1px solid var(--vp-c-border);
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.matrix-cell:last-child {
  border-right: none;
}

.cell-label {
  font-family: var(--vp-font-family-mono);
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  color: var(--vp-c-text-3);
}

.cell-value {
  font-family: var(--vp-font-family-mono);
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.green-val { color: #10B981; }
.cyan-val { color: var(--vp-c-brand-1); }

/* Filter Row */
.sim-filter-row {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.search-wrap {
  flex: 1;
  min-width: 280px;
  display: flex;
  align-items: center;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  padding: 0 0.85rem;
}

.search-prefix {
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-brand-1);
  font-weight: bold;
  margin-right: 0.5rem;
}

.sim-search {
  flex: 1;
  padding: 0.65rem 0;
  background: transparent;
  border: none;
  outline: none;
  color: var(--vp-c-text-1);
  font-size: 0.88rem;
}

.filter-actions {
  display: flex;
  gap: 0.5rem;
}

.sim-select {
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  color: var(--vp-c-text-1);
  padding: 0.65rem 0.9rem;
  font-family: var(--vp-font-family-mono);
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  outline: none;
}

.btn-terminal-inline {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  color: var(--vp-c-text-2);
  padding: 0.65rem 1rem;
  font-family: var(--vp-font-family-mono);
  font-size: 0.75rem;
  cursor: pointer;
  letter-spacing: 0.05em;
  transition: all 0.15s ease;
}

.btn-terminal-inline:hover {
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-text-1);
}

/* Card */
.sim-card {
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-elv);
  padding: 1.75rem;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.meta-tag {
  display: flex;
  gap: 0.5rem;
  font-family: var(--vp-font-family-mono);
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
}

.pipe-sep {
  color: var(--vp-c-border);
}

.meta-obj {
  padding: 0.2rem 0.5rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  color: var(--vp-c-text-2);
}

.scenario-prompt {
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.45;
  color: var(--vp-c-text-1);
  margin: 0 0 0.5rem;
}

.scenario-sub {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  margin: 0 0 1.5rem;
  line-height: 1.5;
}

/* Options */
.options-container {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-bottom: 1.5rem;
}

.option-row {
  display: flex;
  align-items: flex-start;
  gap: 0.9rem;
  padding: 0.85rem 1rem;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg);
  cursor: pointer;
  transition: all 0.12s ease;
}

.option-row:hover {
  border-color: var(--vp-c-text-1);
}

.opt-key-col {
  font-family: var(--vp-font-family-mono);
  font-weight: 700;
  color: var(--vp-c-text-3);
  display: flex;
  font-size: 0.85rem;
  user-select: none;
}

.option-row.chosen .opt-key-col {
  color: var(--vp-c-brand-1);
}

.opt-text-col {
  font-size: 0.92rem;
  line-height: 1.5;
  color: var(--vp-c-text-1);
}

.option-row.valid {
  border-color: #10B981 !important;
  background: rgba(16, 185, 129, 0.05);
}

.option-row.valid .opt-key-col {
  color: #10B981;
}

.option-row.invalid {
  border-color: #EF4444 !important;
  background: rgba(239, 68, 68, 0.05);
}

.option-row.invalid .opt-key-col {
  color: #EF4444;
}

/* Explanation */
.explanation-pane {
  border: 1px solid var(--vp-c-border);
  border-left: 2px solid var(--vp-c-brand-1);
  background: var(--vp-c-bg-soft);
  padding: 1.25rem;
  margin-bottom: 1.5rem;
}

.expl-header {
  color: var(--vp-c-brand-1);
  margin-bottom: 0.5rem;
}

.expl-content {
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  margin: 0;
}

/* Actions */
.sim-nav-row {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid var(--vp-c-border);
  padding-top: 1.25rem;
}

.btn-sim-nav {
  padding: 0.65rem 1.2rem;
  font-family: var(--vp-font-family-mono);
  font-size: 0.78rem;
  letter-spacing: 0.06em;
  font-weight: 600;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-sim-nav:hover:not(:disabled) {
  border-color: var(--vp-c-text-1);
  color: var(--vp-c-text-1);
}

.btn-sim-nav.active {
  background: var(--vp-c-text-1);
  color: var(--vp-c-bg);
  border-color: var(--vp-c-text-1);
}

.btn-sim-nav.active:hover:not(:disabled) {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: #FFFFFF;
}

.btn-sim-nav:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.sim-empty {
  padding: 4rem 2rem;
  text-align: center;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-elv);
}
</style>
