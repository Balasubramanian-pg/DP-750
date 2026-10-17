<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { withBase, useRoute } from 'vitepress'
import LessonCompletion from './LessonCompletion.vue'

const { Layout } = DefaultTheme
const route = useRoute()

// Global Floating Pomodoro Focus Pill
const POMO_ACTIVE_KEY = 'dp750_pomodoro_active'
const pomoRunning = ref(false)
const pomoRemainingSeconds = ref(0)
const pomoMode = ref('25')
let pomoWatcherTimer = null

const pomoFormattedTime = computed(() => {
  const m = Math.floor(pomoRemainingSeconds.value / 60)
  const s = pomoRemainingSeconds.value % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
})

function checkPomoGlobal() {
  if (typeof window === 'undefined') return
  try {
    const raw = localStorage.getItem(POMO_ACTIVE_KEY)
    if (!raw) {
      pomoRunning.value = false
      return
    }
    const data = JSON.parse(raw)
    pomoMode.value = data.mode || '25'
    if (data.status === 'running') {
      const now = Date.now()
      const rem = Math.max(0, Math.round((data.targetEndTime - now) / 1000))
      pomoRemainingSeconds.value = rem
      pomoRunning.value = rem > 0
    } else if (data.status === 'paused') {
      pomoRemainingSeconds.value = data.remaining || 0
      pomoRunning.value = false
    } else {
      pomoRunning.value = false
    }
  } catch (e) {
    pomoRunning.value = false
  }
}

onMounted(() => {
  checkPomoGlobal()
  pomoWatcherTimer = setInterval(checkPomoGlobal, 1000)
  window.addEventListener('storage', checkPomoGlobal)
})

onUnmounted(() => {
  if (pomoWatcherTimer) clearInterval(pomoWatcherTimer)
  window.removeEventListener('storage', checkPomoGlobal)
})
</script>

<template>
  <Layout>
    <template #doc-after>
      <LessonCompletion />
    </template>

    <!-- Global Floating Focus Pill (visible across lessons / labs when timer is ticking) -->
    <template #layout-top>
      <a 
        v-if="pomoRunning && route.path !== '/' && route.path !== '/index.html'" 
        href="/DP-750/" 
        class="global-floating-focus-pill"
        title="Pomodoro Session Active &middot; Click to return to dashboard"
      >
        <span class="focus-flame">🔥</span>
        <span class="focus-time">{{ pomoFormattedTime }}</span>
        <span class="focus-pulse-dot"></span>
      </a>
    </template>

    <template #layout-bottom>
      <footer v-if="route.path !== '/' && route.path !== '/index.html'" class="site-footer-custom">
        <div class="site-footer-inner">
          <div class="footer-col brand-col">
            <div class="footer-logo">
              <img :src="withBase('/databricks.svg')" width="22" height="22" alt="Databricks Logo" class="brand-logo-img" />
              <span class="brand-text">DP-750 Study Portal</span>
            </div>
            <p class="brand-desc">
              Structured preparation portal for the Microsoft DP-750 Azure Databricks Data Engineer certification. Includes deep architectural modules, hands-on enterprise labs, and interactive practice quizzes.
            </p>
            <div class="author-tag">
              <span>Maintained by Balasubramanian PG</span>
            </div>
          </div>

          <div class="footer-col">
            <h4>Curriculum Modules</h4>
            <ul>
              <li><a href="/DP-750/01-setup-and-configure/">Module 1: Setup & Runtime</a></li>
              <li><a href="/DP-750/02-secure-and-govern/">Module 2: Unity Catalog Security</a></li>
              <li><a href="/DP-750/03-prepare-and-process/">Module 3: Medallion Ingestion</a></li>
              <li><a href="/DP-750/04-deploy-and-maintain/">Module 4: Lakeflow Orchestration</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>Practice & Execution</h4>
            <ul>
              <li><a href="/DP-750/labs/">Hands-on Labs (12 Labs)</a></li>
              <li><a href="/DP-750/question-bank/">Practice Quizzes</a></li>
              <li><a href="https://notebook.google.com/notebook/939d1225-31a8-4583-a0f3-c0002b0a5557/preview" target="_blank" rel="noopener">NotebookLM Study Companion</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>Policies & Resources</h4>
            <ul>
              <li><a href="/DP-750/privacy-policy">Privacy Policy</a></li>
              <li><a href="/DP-750/cookie-policy">Cookie Policy</a></li>
              <li><a href="https://learn.microsoft.com/en-us/credentials/certifications/azure-data-engineer/" target="_blank" rel="noopener">Official Exam Scope</a></li>
              <li><a href="https://github.com/Balasubramanian-pg/DP-750/issues" target="_blank" rel="noopener">Report an Issue</a></li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <span>&copy; 2026 Balasubramanian PG. All rights reserved. Zero tracking cookies.</span>
          <span>Open Educational Resource</span>
        </div>
      </footer>
    </template>
  </Layout>
</template>

<style scoped>
.brand-logo-img {
  display: inline-block;
}
.footer-logo {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  font-family: var(--vp-font-family-headings) !important;
  font-weight: 700;
  font-size: 1.05rem;
  color: var(--vp-c-text-1);
}
.brand-desc {
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin: 0.9rem 0 1.1rem;
  font-size: 0.88rem;
  max-width: 420px;
}
.author-tag {
  font-size: 0.82rem;
  color: var(--vp-c-text-2);
}
.author-tag a {
  color: #906BFF;
  text-decoration: underline;
  font-weight: 600;
}

/* Global Floating Pomodoro Focus Pill */
.global-floating-focus-pill {
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  background: #181923;
  border: 1px solid rgba(144, 107, 255, 0.45);
  box-shadow: 0 8px 24px rgba(144, 107, 255, 0.35), 0 2px 8px rgba(0, 0, 0, 0.5);
  border-radius: 9999px;
  padding: 0.55rem 1.1rem;
  color: #FFFFFF;
  text-decoration: none;
  font-family: var(--vp-font-family-headings) !important;
  font-weight: 700;
  font-size: 0.92rem;
  z-index: 999;
  backdrop-filter: blur(12px);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.global-floating-focus-pill:hover {
  transform: translateY(-2px) scale(1.03);
  border-color: #906BFF;
  box-shadow: 0 12px 28px rgba(144, 107, 255, 0.5);
  background: #202230;
}

.focus-flame {
  font-size: 1rem;
}

.focus-time {
  letter-spacing: 0.02em;
  color: #FFFFFF;
}

.focus-pulse-dot {
  width: 8px;
  height: 8px;
  background: #34D399;
  border-radius: 50%;
  box-shadow: 0 0 8px #34D399;
  animation: focusDotPulse 1.5s infinite ease-in-out;
}

@keyframes focusDotPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.8); }
}
</style>
