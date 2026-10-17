<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()
const isCompleted = ref(false)
const showCelebration = ref(false)

function checkCompletion() {
  if (typeof window === 'undefined') return
  try {
    const raw = localStorage.getItem('dp750_completed_lessons')
    const completedList = raw ? JSON.parse(raw) : []
    isCompleted.value = completedList.includes(route.path)
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  checkCompletion()
})

watch(() => route.path, () => {
  checkCompletion()
})

function toggleCompletion() {
  if (typeof window === 'undefined') return
  try {
    const raw = localStorage.getItem('dp750_completed_lessons')
    let completedList = raw ? JSON.parse(raw) : []
    
    if (completedList.includes(route.path)) {
      completedList = completedList.filter(p => p !== route.path)
      isCompleted.value = false
    } else {
      completedList.push(route.path)
      isCompleted.value = true
      showCelebration.value = true
      setTimeout(() => {
        showCelebration.value = false
      }, 3000)
    }
    
    localStorage.setItem('dp750_completed_lessons', JSON.stringify(completedList))
    window.dispatchEvent(new Event('dp750-progress-updated'))
  } catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <div v-if="route.path !== '/' && !route.path.includes('privacy') && !route.path.includes('cookie')" class="completion-bar-wrap">
    <div class="completion-box" :class="{ completed: isCompleted }">
      <div class="completion-info">
        <span class="completion-icon">
          <svg v-if="isCompleted" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34D399" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#906BFF" stroke-width="2">
            <circle cx="12" cy="12" r="9"/>
          </svg>
        </span>
        <div class="completion-text">
          <span class="status-label">{{ isCompleted ? 'Lesson Completed' : 'Track Your Progress' }}</span>
          <span class="status-sub">{{ isCompleted ? 'Your mastery performance curve has been updated on your dashboard.' : 'Mark this lesson as finished to advance your exam readiness curve.' }}</span>
        </div>
      </div>

      <button class="btn-toggle-complete" :class="{ 'btn-completed': isCompleted }" @click="toggleCompletion">
        <span v-if="isCompleted">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-right: 6px;">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Completed
        </span>
        <span v-else>Mark as Complete</span>
      </button>
    </div>

    <transition name="fade">
      <div v-if="showCelebration" class="toast-notification">
        🎉 Progress updated! Your performance curve advanced on the dashboard.
      </div>
    </transition>
  </div>
</template>

<style scoped>
.completion-bar-wrap {
  margin: 3rem 0 2rem;
  width: 100%;
}

.completion-box {
  background: #15161E;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 1.25rem 1.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  transition: all 0.25s ease;
}

.completion-box.completed {
  background: rgba(52, 211, 153, 0.08);
  border-color: rgba(52, 211, 153, 0.3);
}

.completion-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.completion-icon {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.completion-text {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.status-label {
  font-family: var(--vp-font-family-headings) !important;
  font-size: 1rem;
  font-weight: 700;
  color: #FFFFFF;
}

.status-sub {
  font-size: 0.85rem;
  color: #9CA3AF;
}

.btn-toggle-complete {
  display: inline-flex;
  align-items: center;
  padding: 0.65rem 1.4rem;
  border-radius: 24px;
  background: #906BFF;
  color: #FFFFFF;
  border: none;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn-toggle-complete:hover {
  background: #7C3AED;
  transform: translateY(-1px);
}

.btn-completed {
  background: #1C2D24 !important;
  color: #34D399 !important;
  border: 1px solid rgba(52, 211, 153, 0.3) !important;
}

.btn-completed:hover {
  background: #253E31 !important;
}

.toast-notification {
  margin-top: 0.75rem;
  padding: 0.75rem 1.25rem;
  background: #906BFF;
  color: #FFFFFF;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  text-align: center;
  box-shadow: 0 4px 14px rgba(144, 107, 255, 0.4);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@media (max-width: 640px) {
  .completion-box {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
