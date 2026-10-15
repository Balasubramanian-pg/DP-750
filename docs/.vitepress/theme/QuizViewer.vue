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
  <div class="quiz-container">
    <div class="quiz-header">
      <div class="stats-banner">
        <div class="stat-box">
          <span class="stat-num">{{ stats.total }}</span>
          <span class="stat-lbl">Total Questions</span>
        </div>
        <div class="stat-box">
          <span class="stat-num">{{ stats.answered }}</span>
          <span class="stat-lbl">Answered</span>
        </div>
        <div class="stat-box">
          <span class="stat-num green">{{ stats.correct }}</span>
          <span class="stat-lbl">Correct</span>
        </div>
        <div class="stat-box">
          <span class="stat-num blue">{{ stats.score }}%</span>
          <span class="stat-lbl">Accuracy</span>
        </div>
      </div>

      <div class="controls-bar">
        <input 
          v-model="searchQuery" 
          placeholder="🔍 Search questions, topics, keywords..." 
          class="search-input"
        />
        <select v-model="filterMode" class="filter-select">
          <option value="all">All Questions</option>
          <option value="unanswered">Unanswered</option>
          <option value="incorrect">Incorrect</option>
        </select>
        <button @click="resetQuiz" class="btn-reset">Reset Progress</button>
      </div>
    </div>

    <div v-if="!currentQuestion" class="empty-state">
      <p>No questions match your current search/filter.</p>
    </div>

    <div v-else class="question-card">
      <div class="card-top">
        <span class="badge-idx">Question {{ currentIndex + 1 }} of {{ filteredQuestions.length }} (ID: #{{ currentQuestion.id }})</span>
        <span v-if="currentQuestion.objective" class="badge-obj">{{ currentQuestion.objective }}</span>
      </div>

      <h3 class="q-title">{{ currentQuestion.title }}</h3>
      <p v-if="currentQuestion.subtitle" class="q-sub">{{ currentQuestion.subtitle }}</p>

      <div class="options-list">
        <div 
          v-for="opt in currentQuestion.options" 
          :key="opt.key"
          class="option-item"
          :class="{
            selected: selectedAnswers[currentQuestion.id] === opt.key,
            correct: showExplanation[currentQuestion.id] && opt.key === currentQuestion.correct,
            incorrect: showExplanation[currentQuestion.id] && selectedAnswers[currentQuestion.id] === opt.key && opt.key !== currentQuestion.correct
          }"
          @click="selectOption(currentQuestion.id, opt.key)"
        >
          <span class="opt-letter">{{ opt.key }}</span>
          <span class="opt-text">{{ opt.text }}</span>
        </div>
      </div>

      <div v-if="showExplanation[currentQuestion.id]" class="explanation-box">
        <h4>💡 Answer & Explanation</h4>
        <p><strong>Correct Answer: Option {{ currentQuestion.correct }}</strong></p>
        <p class="expl-body">{{ currentQuestion.explanation }}</p>
      </div>

      <div class="card-actions">
        <button :disabled="currentIndex === 0" @click="prevQ" class="btn-nav">← Previous</button>
        <button :disabled="currentIndex === filteredQuestions.length - 1" @click="nextQ" class="btn-nav primary">Next Question →</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.quiz-container {
  margin-top: 1.5rem;
}
.stats-banner {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}
.stat-box {
  flex: 1;
  min-width: 120px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
}
.stat-num {
  font-size: 1.6rem;
  font-weight: 700;
  display: block;
}
.stat-num.green { color: #107c41; }
.stat-num.blue { color: #0078d4; }
.stat-lbl {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}
.controls-bar {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}
.search-input {
  flex: 2;
  padding: 0.6rem 1rem;
  border-radius: 6px;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}
.filter-select {
  padding: 0.6rem 1rem;
  border-radius: 6px;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}
.btn-reset {
  padding: 0.6rem 1rem;
  border-radius: 6px;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-soft);
  cursor: pointer;
}
.question-card {
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
}
.card-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.badge-idx {
  font-size: 0.85rem;
  font-weight: 600;
  color: #0078d4;
}
.badge-obj {
  font-size: 0.8rem;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  padding: 2px 8px;
  border-radius: 4px;
}
.q-title {
  margin-top: 0;
  font-size: 1.25rem;
  line-height: 1.4;
}
.q-sub {
  color: var(--vp-c-text-2);
  font-style: italic;
  font-size: 0.95rem;
  margin-bottom: 1.25rem;
}
.options-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 1.25rem 0;
}
.option-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.85rem 1.1rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg);
  cursor: pointer;
  transition: all 0.2s ease;
}
.option-item:hover {
  border-color: #0078d4;
}
.opt-letter {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--vp-c-bg-soft);
  font-weight: bold;
}
.opt-text {
  flex: 1;
}
.option-item.correct {
  border-color: #107c41;
  background: rgba(16, 124, 65, 0.1);
}
.option-item.incorrect {
  border-color: #d13438;
  background: rgba(209, 52, 56, 0.1);
}
.explanation-box {
  margin-top: 1.25rem;
  padding: 1rem 1.25rem;
  border-left: 4px solid #0078d4;
  background: var(--vp-c-bg);
  border-radius: 0 8px 8px 0;
}
.explanation-box h4 {
  margin: 0 0 0.5rem 0;
  color: #0078d4;
}
.expl-body {
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--vp-c-text-2);
}
.card-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
}
.btn-nav {
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg);
  font-weight: 600;
  cursor: pointer;
}
.btn-nav.primary {
  background: #0078d4;
  color: #fff;
  border-color: #0078d4;
}
.btn-nav:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.empty-state {
  padding: 3rem;
  text-align: center;
  color: var(--vp-c-text-2);
}
</style>
