<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { withBase } from 'vitepress'

// Interactive metrics & state
const selectedFilter = ref('all')
const hoursSpent = ref(124)
const completedLessons = ref(0)
const totalLessons = 163

const progressPercentage = computed(() => {
  return Math.min(100, Math.round((completedLessons.value / totalLessons) * 100))
})

const readinessScore = computed(() => {
  if (completedLessons.value === 0) return 18
  return Math.min(100, Math.round(18 + (completedLessons.value / totalLessons) * 82))
})

const readinessVerdict = computed(() => {
  const score = readinessScore.value
  if (score >= 85) return 'Exam Ready'
  if (score >= 65) return 'High Readiness'
  if (score >= 40) return 'Advancing'
  return 'Foundations'
})

// Dynamic Spline Wave Chart coordinates for Widget 4
const waveData = computed(() => {
  const score = readinessScore.value
  const t = Math.max(0.12, Math.min(1.0, score / 100))
  const peakX = Math.round(25 + t * 185)
  const peakY = Math.round(68 - t * 48)

  const cp1x = Math.round(10 + (peakX - 10) * 0.45)
  const cp1y = Math.round(72 - (72 - peakY) * 0.25)
  const cp2x = Math.round(peakX - (peakX - 10) * 0.25)
  const cp2y = peakY

  const cp3x = Math.round(peakX + (230 - peakX) * 0.25)
  const cp3y = peakY
  const cp4x = Math.round(230 - (230 - peakX) * 0.45)
  const cp4y = 72

  const linePath = `M 10 72 C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${peakX} ${peakY} C ${cp3x} ${cp3y}, ${cp4x} ${cp4y}, 230 72`
  const fillPath = `${linePath} L 230 90 L 10 90 Z`

  return { peakX, peakY, linePath, fillPath }
})

// Pomodoro Focus Clock State
const pomoMode = ref('25')
const pomoTotalSeconds = ref(25 * 60)
const pomoRemainingSeconds = ref(25 * 60)
const pomoRunning = ref(false)
let pomoTimer = null
const completedBlocks = ref(0)
const totalFocusMinutes = ref(0)

function loadPomodoroStats() {
  if (typeof window === 'undefined') return
  try {
    const raw = localStorage.getItem('dp750_pomodoro_stats')
    if (raw) {
      const data = JSON.parse(raw)
      completedBlocks.value = data.completedBlocks || 0
      totalFocusMinutes.value = data.totalFocusMinutes || 0
    }
  } catch (e) {
    console.error(e)
  }
}

function savePomodoroStats() {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('dp750_pomodoro_stats', JSON.stringify({
      completedBlocks: completedBlocks.value,
      totalFocusMinutes: totalFocusMinutes.value
    }))
  } catch (e) {
    console.error(e)
  }
}

function playChime() {
  if (typeof window === 'undefined') return
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    const now = ctx.currentTime
    const notes = [523.25, 659.25, 783.99] // C5 -> E5 -> G5
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + i * 0.14)
      gain.gain.setValueAtTime(0.2, now + i * 0.14)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.14 + 0.6)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now + i * 0.14)
      osc.stop(now + i * 0.14 + 0.6)
    })
  } catch (e) {
    // Audio context may be restricted
  }
}

function setPomodoroMode(mode) {
  pomoMode.value = mode
  if (pomoRunning.value) {
    clearInterval(pomoTimer)
    pomoRunning.value = false
  }
  const mins = mode === '25' ? 25 : (mode === '50' ? 50 : 5)
  pomoTotalSeconds.value = mins * 60
  pomoRemainingSeconds.value = mins * 60
}

function togglePomodoro() {
  if (pomoRunning.value) {
    clearInterval(pomoTimer)
    pomoRunning.value = false
  } else {
    pomoRunning.value = true
    pomoTimer = setInterval(() => {
      if (pomoRemainingSeconds.value > 0) {
        pomoRemainingSeconds.value--
      } else {
        clearInterval(pomoTimer)
        pomoRunning.value = false
        playChime()
        if (pomoMode.value !== '5') {
          completedBlocks.value++
          totalFocusMinutes.value += pomoMode.value === '25' ? 25 : 50
          savePomodoroStats()
        }
        const mins = pomoMode.value === '25' ? 25 : (pomoMode.value === '50' ? 50 : 5)
        pomoRemainingSeconds.value = mins * 60
      }
    }, 1000)
  }
}

function resetPomodoro() {
  if (pomoRunning.value) {
    clearInterval(pomoTimer)
    pomoRunning.value = false
  }
  const mins = pomoMode.value === '25' ? 25 : (pomoMode.value === '50' ? 50 : 5)
  pomoRemainingSeconds.value = mins * 60
}

const pomoFormattedTime = computed(() => {
  const m = Math.floor(pomoRemainingSeconds.value / 60)
  const s = pomoRemainingSeconds.value % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
})

const pomoStatusText = computed(() => {
  if (!pomoRunning.value) {
    return pomoRemainingSeconds.value === pomoTotalSeconds.value ? 'READY TO FOCUS' : 'PAUSED'
  }
  return pomoMode.value === '5' ? 'BREAK TIME' : 'DEEP FOCUSING'
})

// Circumference for r=54: 2 * PI * 54 = 339.29
const pomoCircumference = 339.29
const pomoStrokeOffset = computed(() => {
  const elapsed = pomoTotalSeconds.value - pomoRemainingSeconds.value
  const fraction = elapsed / pomoTotalSeconds.value
  return pomoCircumference * (1 - fraction)
})

// Search State
const searchQuery = ref('')
const searchIndex = ref([])
const isSearching = ref(false)
const searchInputRef = ref(null)

function focusSearch() {
  searchInputRef.value?.focus()
}

// Notifications State
const showNotifications = ref(false)
const notifications = ref([
  { id: 1, title: 'Exam Readiness Milestone Reached', time: '10m ago', text: 'You scored 86% on Lakeflow Streaming Ingestion questions.', read: false },
  { id: 2, title: 'New Lab 07 Walkthrough Available', time: '2h ago', text: 'Auto Loader directory schema inference guide updated.', read: false },
  { id: 3, title: 'Practice Quizzes Refreshed', time: '1d ago', text: 'Added 15 new scenarios on Unity Catalog system tables.', read: true }
])
const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

// Progress Loading
function loadProgress() {
  if (typeof window === 'undefined') return
  try {
    const raw = localStorage.getItem('dp750_completed_lessons')
    const list = raw ? JSON.parse(raw) : []
    completedLessons.value = list.length

    // Update curriculum cards dynamically
    const m1Count = list.filter(p => p.includes('01-setup-and-configure')).length
    const m2Count = list.filter(p => p.includes('02-secure-and-govern')).length
    const m3Count = list.filter(p => p.includes('03-prepare-and-process')).length
    const m4Count = list.filter(p => p.includes('04-deploy-and-maintain')).length

    if (m1Count > 0 && modules.value[0]) {
      modules.value[0].progress = Math.min(100, Math.round((m1Count / 15) * 100))
      modules.value[0].status = modules.value[0].progress === 100 ? 'Completed' : 'In progress'
    }
    if (m2Count > 0 && modules.value[1]) {
      modules.value[1].progress = Math.min(100, Math.round((m2Count / 18) * 100))
      modules.value[1].status = modules.value[1].progress === 100 ? 'Completed' : 'In progress'
    }
    if (m3Count > 0 && modules.value[2]) {
      modules.value[2].progress = Math.min(100, Math.round((m3Count / 40) * 100))
      modules.value[2].status = modules.value[2].progress === 100 ? 'Completed' : 'In progress'
    }
    if (m4Count > 0 && modules.value[3]) {
      modules.value[3].progress = Math.min(100, Math.round((m4Count / 25) * 100))
      modules.value[3].status = modules.value[3].progress === 100 ? 'Completed' : 'In progress'
    }
  } catch (e) {
    console.error(e)
  }
}

onMounted(async () => {
  try {
    const res = await fetch('/DP-750/search-index.json')
    if (res.ok) {
      searchIndex.value = await res.json()
    } else {
      const fallback = await fetch('/search-index.json')
      searchIndex.value = await fallback.json()
    }
  } catch (e) {
    console.error('Failed to load search index', e)
  }

  loadProgress()
  loadPomodoroStats()
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('dp750-progress-updated', loadProgress)
  window.addEventListener('storage', loadProgress)
})

onUnmounted(() => {
  if (pomoTimer) clearInterval(pomoTimer)
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('dp750-progress-updated', loadProgress)
  window.removeEventListener('storage', loadProgress)
})

function handleKeydown(e) {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    searchInputRef.value?.focus()
  }
}

const searchResults = computed(() => {
  if (!searchQuery.value.trim()) return []
  const q = searchQuery.value.toLowerCase()
  return searchIndex.value
    .filter(item => item.title.toLowerCase().includes(q) || item.link.toLowerCase().includes(q))
    .slice(0, 8)
})

function toggleNotifications() {
  showNotifications.value = !showNotifications.value
}

function markAllRead() {
  notifications.value.forEach(n => (n.read = true))
}

const modules = ref([
  {
    id: '01',
    name: 'Module 1: Workspace Setup and Runtime Architecture',
    slug: '01-setup-and-configure',
    iconType: 'chart',
    hours: 28,
    grade: '51/51',
    progress: 100,
    status: 'Completed',
    desc: 'Cluster sizing, single-user vs shared access, Photon acceleration, and VNet integration.'
  },
  {
    id: '02',
    name: 'Module 2: Unity Catalog Security and Governance',
    slug: '02-secure-and-govern',
    iconType: 'atom',
    hours: 18,
    grade: '20%',
    progress: 20,
    status: 'In progress',
    desc: 'Three-level namespaces, row filters, column masking, metastore auditing, and lineage.'
  },
  {
    id: '03',
    name: 'Module 3: Medallion Architecture and Streaming Ingestion',
    slug: '03-prepare-and-process',
    iconType: 'pulse',
    hours: 64,
    grade: '74%',
    progress: 74,
    status: 'In progress',
    desc: 'Auto Loader schema evolution, CDC with APPLY CHANGES INTO, and Lakeflow Connect.'
  },
  {
    id: '04',
    name: 'Module 4: Lakeflow Jobs, Asset Bundles, and CI/CD',
    slug: '04-deploy-and-maintain',
    iconType: 'book',
    hours: 14,
    grade: '0%',
    progress: 0,
    status: 'In progress',
    desc: 'Multi-task DAG workflows, Databricks Asset Bundles (DABs), and Spark skew optimization.'
  }
])

const activeNav = ref('home')
</script>

<template>
  <div class="dribbble-dashboard-container">
    <!-- Left Icon Navigation Dock (Replicating the Dribbble left pill rail) -->
    <aside class="left-dock">
      <div class="dock-brand">
        <!-- Diamond star icon from Dribbble shot -->
        <a href="/DP-750/" class="brand-sparkle-box" title="DP-750 Home">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="#906BFF"/>
          </svg>
        </a>
      </div>

      <nav class="dock-menu">
        <a href="/DP-750/" class="dock-item" :class="{ active: activeNav === 'home' }" title="Home / Dashboard">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </a>

        <a href="/DP-750/01-setup-and-configure/" class="dock-item" title="Curriculum Tracks">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
            <path d="M6 12v5c3 3 9 3 12 0v-5"/>
          </svg>
        </a>

        <a href="/DP-750/labs/" class="dock-item" title="Hands-on Labs">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="16 18 22 12 16 6"/>
            <polyline points="8 6 2 12 8 18"/>
          </svg>
        </a>

        <a href="/DP-750/question-bank/" class="dock-item" title="Practice Quizzes">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
            <path d="M9 14l2 2 4-4"/>
          </svg>
        </a>

        <a href="https://github.com/Balasubramanian-pg/DP-750" target="_blank" rel="noopener" class="dock-item" title="GitHub Repository">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
          </svg>
        </a>

        <a href="https://notebook.google.com/notebook/939d1225-31a8-4583-a0f3-c0002b0a5557/preview" target="_blank" rel="noopener" class="dock-item" title="Google NotebookLM Study Companion">
          <svg width="20" height="20" viewBox="0 0 106 78" fill="currentColor">
            <path d="M52.96.1C23.71.1,0,23.61,0,52.62v25.15h9.76v-2.51c0-11.77,9.61-21.31,21.48-21.31s21.48,9.54,21.48,21.31v2.51h9.76v-2.51c0-17.11-13.99-30.98-31.24-30.98-6.72,0-12.94,2.1-18.03,5.69,5.33-10.51,16.31-17.73,28.99-17.73,17.91,0,32.43,14.41,32.43,32.16v13.36h9.76v-13.36c0-23.11-18.89-41.85-42.19-41.85-10.48,0-20.06,3.79-27.44,10.06,7.25-13.59,21.63-22.84,38.21-22.84,23.86,0,43.2,19.18,43.2,42.84v25.15h9.76v-25.15C105.92,23.61,82.21.1,52.96.1Z"/>
          </svg>
        </a>
      </nav>

      <div class="dock-bottom">
        <a href="https://www.linkedin.com/in/balasubramanianpg2022/?isSelfProfile=true" target="_blank" rel="noopener" class="dock-item" title="LinkedIn Profile">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.6 1.6 0 1 0 1.6 1.6c0-.88-.72-1.6-1.6-1.6Z"/>
          </svg>
        </a>
      </div>
    </aside>

    <!-- Main Learning OS Content Pane -->
    <main class="dashboard-main">
      <!-- Top Bar: Header + Search + Notification + Profile Links -->
      <header class="dashboard-header">
        <div class="header-left">
          <h1 class="header-title">My Learning Portal</h1>
          <span class="header-subtitle">Microsoft Certified: Azure Databricks Data Engineer (DP-750)</span>
        </div>

        <div class="header-right">
          <!-- Command search pill with LIVE searchable dropdown -->
          <div class="search-pill-wrap">
            <div class="search-pill" @click="focusSearch">
              <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input 
                ref="searchInputRef"
                v-model="searchQuery" 
                type="text" 
                placeholder="Search modules, concepts, labs..." 
                class="search-input" 
                @focus="isSearching = true"
              />
              <kbd class="kbd-shortcut">Ctrl K</kbd>
            </div>

            <!-- Live Search Results Dropdown -->
            <div v-if="searchQuery.trim()" class="search-results-dropdown">
              <div v-if="searchResults.length === 0" class="search-no-results">
                No matching topics found for "{{ searchQuery }}"
              </div>
              <a 
                v-for="item in searchResults" 
                :key="item.link" 
                :href="`/DP-750${item.link}`" 
                class="search-result-item"
              >
                <span class="res-title">{{ item.title }}</span>
                <span class="res-path">{{ item.link }}</span>
              </a>
            </div>
          </div>

          <!-- Notification Bell with Interactive Dropdown Panel -->
          <div class="notification-wrap">
            <button class="header-action-btn" title="View Notifications" @click="toggleNotifications">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span v-if="unreadCount > 0" class="notification-indicator"></span>
            </button>

            <!-- Dropdown Notification Panel -->
            <div v-if="showNotifications" class="notifications-panel">
              <div class="notif-header">
                <div class="notif-title-row">
                  <span class="notif-title">Activity Feed</span>
                  <span class="notif-pill">{{ unreadCount }} new</span>
                </div>
                <button class="mark-read-btn" @click="markAllRead">Mark all read</button>
              </div>

              <div class="notif-list">
                <div 
                  v-for="notif in notifications" 
                  :key="notif.id" 
                  class="notif-item" 
                  :class="{ unread: !notif.read }"
                >
                  <div class="notif-lead">
                    <span class="notif-item-title">{{ notif.title }}</span>
                    <span class="notif-time">{{ notif.time }}</span>
                  </div>
                  <p class="notif-desc">{{ notif.text }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- LinkedIn Profile Icon -->
          <a href="https://www.linkedin.com/in/balasubramanianpg2022/?isSelfProfile=true" target="_blank" rel="noopener" class="header-social-btn linkedin-btn" title="Connect with Balasubramanian on LinkedIn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.6 1.6 0 1 0 1.6 1.6c0-.88-.72-1.6-1.6-1.6Z"/>
            </svg>
          </a>

          <!-- GitHub Profile Icon -->
          <a href="https://github.com/Balasubramanian-pg/DP-750" target="_blank" rel="noopener" class="header-social-btn" title="View Source on GitHub">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
          </a>

          <!-- Google NotebookLM Icon -->
          <a href="https://notebook.google.com/notebook/939d1225-31a8-4583-a0f3-c0002b0a5557/preview" target="_blank" rel="noopener" class="header-social-btn" title="Open Google NotebookLM Study Companion">
            <svg width="18" height="18" viewBox="0 0 106 78" fill="currentColor">
              <path d="M52.96.1C23.71.1,0,23.61,0,52.62v25.15h9.76v-2.51c0-11.77,9.61-21.31,21.48-21.31s21.48,9.54,21.48,21.31v2.51h9.76v-2.51c0-17.11-13.99-30.98-31.24-30.98-6.72,0-12.94,2.1-18.03,5.69,5.33-10.51,16.31-17.73,28.99-17.73,17.91,0,32.43,14.41,32.43,32.16v13.36h9.76v-13.36c0-23.11-18.89-41.85-42.19-41.85-10.48,0-20.06,3.79-27.44,10.06,7.25-13.59,21.63-22.84,38.21-22.84,23.86,0,43.2,19.18,43.2,42.84v25.15h9.76v-25.15C105.92,23.61,82.21.1,52.96.1Z"/>
            </svg>
          </a>
        </div>
      </header>

      <!-- HERO SPOTLIGHT CARD (Matching the Dribbble Hero Banner) -->
      <section class="hero-spotlight-card">
        <div class="hero-left-content">
          <div class="pill-tag">
            <span class="tag-accent-dot"></span>
            <span>CURRENT TRACK &middot; AZURE DATABRICKS</span>
          </div>

          <h2 class="spotlight-title">
            The study of distributed lakehouses and data pipelines.
          </h2>

          <p class="spotlight-caption">
            Comprehensive production guide covering compute clusters, Unity Catalog governance, streaming ingestion, Lakeflow orchestration, and 12 hands-on labs.
          </p>

          <div class="spotlight-actions">
            <a href="/DP-750/01-setup-and-configure/" class="btn-continue-course">
              <span class="play-circle">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </span>
              <span>CONTINUE COURSE</span>
            </a>

            <a href="/DP-750/question-bank/" class="btn-ghost-course">
              <span>PRACTICE QUIZZES</span>
            </a>
          </div>
        </div>

        <div class="hero-graphic-wrap">
          <img :src="withBase('/hero-3d-graphic.png')" alt="Azure Databricks Lakehouse" class="hero-3d-render" />
        </div>
      </section>

      <!-- 2-COLUMN LOWER SECTION (Left: Course List | Right: Analytics Grid) -->
      <div class="dashboard-grid">
        <!-- LEFT COLUMN: "Course you're taking" -->
        <section class="courses-column">
          <div class="section-top-bar">
            <h3 class="column-title">Course you're taking</h3>
            <div class="filter-dropdown-pill">
              <span>Filter by</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </div>
          </div>

          <div class="modules-card-list">
            <a 
              v-for="mod in modules" 
              :key="mod.id" 
              :href="`/DP-750/${mod.slug}/`"
              class="module-card-item"
            >
              <!-- Icon Box -->
              <div class="module-icon-box" :class="mod.iconType">
                <!-- Bar Chart Icon -->
                <svg v-if="mod.iconType === 'chart'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="12" width="4" height="8" rx="1"/>
                  <rect x="10" y="8" width="4" height="12" rx="1"/>
                  <rect x="17" y="4" width="4" height="16" rx="1"/>
                </svg>
                <!-- Atom / Physics Icon -->
                <svg v-else-if="mod.iconType === 'atom'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="2" fill="currentColor"/>
                  <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(30 12 12)"/>
                  <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(90 12 12)"/>
                  <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(150 12 12)"/>
                </svg>
                <!-- Pulse / Heartbeat Icon -->
                <svg v-else-if="mod.iconType === 'pulse'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
                <!-- Book Icon -->
                <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                </svg>
              </div>

              <!-- Module Info -->
              <div class="module-text-wrap">
                <div class="mod-headline-row">
                  <h4 class="mod-title">{{ mod.name }}</h4>
                </div>
                <div class="mod-metrics-row">
                  <span class="metric-highlight">{{ mod.hours }} Hours spend</span>
                  <span v-if="mod.status === 'Completed'" class="metric-sub">{{ mod.grade }} Final grade</span>
                  <div v-else class="progress-track-wrap">
                    <span class="progress-num">{{ mod.progress }}%</span>
                    <div class="progress-bar-bg">
                      <div class="progress-bar-fill" :style="{ width: `${mod.progress}%` }"></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Status Badge Pill -->
              <div class="status-badge-wrap">
                <span class="status-pill" :class="mod.status === 'Completed' ? 'status-completed' : 'status-in-progress'">
                  {{ mod.status }}
                </span>
              </div>
            </a>
          </div>
        </section>

        <!-- RIGHT COLUMN: "My Progress" (4-Widget Analytics Bento) -->
        <section class="progress-column">
          <div class="section-top-bar">
            <h3 class="column-title">My Progress</h3>
            <div class="filter-dropdown-pill">
              <span>Last month</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </div>
          </div>

          <div class="analytics-quad-grid">
            <!-- Widget 1: Pomodoro Focus Clock -->
            <div class="widget-card widget-pomodoro">
              <div class="widget-header">
                <div class="pomodoro-header-title">
                  <span class="widget-title">Focus Clock</span>
                  <span v-if="pomoRunning" class="live-pulse-badge">LIVE</span>
                </div>
                <span class="widget-idx-bubble">1</span>
              </div>

              <!-- Study Block Selector Tabs -->
              <div class="pomodoro-tabs">
                <button 
                  class="pomo-tab" 
                  :class="{ active: pomoMode === '25' }" 
                  @click="setPomodoroMode('25')"
                >
                  25m Focus
                </button>
                <button 
                  class="pomo-tab" 
                  :class="{ active: pomoMode === '50' }" 
                  @click="setPomodoroMode('50')"
                >
                  50m Deep
                </button>
                <button 
                  class="pomo-tab" 
                  :class="{ active: pomoMode === '5' }" 
                  @click="setPomodoroMode('5')"
                >
                  5m Break
                </button>
              </div>

              <!-- Circular Animated Progress Clock -->
              <div class="pomodoro-clock-wrap">
                <div class="pomo-ring-container">
                  <svg class="pomo-ring-svg" width="124" height="124" viewBox="0 0 124 124">
                    <defs>
                      <linearGradient id="pomoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#C084FC" />
                        <stop offset="100%" stop-color="#906BFF" />
                      </linearGradient>
                    </defs>
                    <circle 
                      class="pomo-ring-track" 
                      cx="62" 
                      cy="62" 
                      r="54" 
                    />
                    <circle 
                      class="pomo-ring-progress" 
                      :class="{ 'pomo-ring-active': pomoRunning }"
                      cx="62" 
                      cy="62" 
                      r="54" 
                      :style="{ strokeDashoffset: pomoStrokeOffset }"
                    />
                  </svg>
                  <div class="pomo-time-center">
                    <span class="pomo-digits">{{ pomoFormattedTime }}</span>
                    <span class="pomo-status-tag">{{ pomoStatusText }}</span>
                  </div>
                </div>
              </div>

              <!-- Pomodoro Actions: Play/Pause, Reset & Session Stats -->
              <div class="pomodoro-footer">
                <div class="pomodoro-controls">
                  <button 
                    class="pomo-btn-main" 
                    :class="{ 'pomo-btn-running': pomoRunning }"
                    @click="togglePomodoro"
                    :title="pomoRunning ? 'Pause Study Block' : 'Start Study Block'"
                  >
                    <svg v-if="pomoRunning" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="6" y="4" width="4" height="16" rx="1"/>
                      <rect x="14" y="4" width="4" height="16" rx="1"/>
                    </svg>
                    <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    <span>{{ pomoRunning ? 'Pause' : 'Start Focus' }}</span>
                  </button>

                  <button 
                    class="pomo-btn-reset" 
                    @click="resetPomodoro" 
                    title="Reset Clock"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                      <path d="M3 3v5h5"/>
                    </svg>
                  </button>
                </div>

                <div class="pomo-counter">
                  <span class="pomo-fire-icon">🔥</span>
                  <span class="pomo-streak-text">{{ completedBlocks }} Done</span>
                </div>
              </div>
            </div>

            <!-- Widget 2: Lessons completed (Vivid Purple Card) -->
            <div class="widget-card widget-purple-card">
              <div class="widget-header">
                <span class="widget-title light-text">Lessons completed</span>
                <span class="widget-idx-bubble light-bubble">2</span>
              </div>

              <div class="purple-card-content">
                <span class="purple-sub-label">{{ progressPercentage }}% Completed</span>
                <span class="huge-metric-num light-num">{{ completedLessons }}</span>
              </div>
            </div>

            <!-- Widget 3: Complete tests (Interactive Simulator Trigger) -->
            <a href="/DP-750/question-bank/" class="widget-card widget-tests-card">
              <div class="tests-inner">
                <span class="tests-title">Practice Quizzes</span>
                <span class="widget-idx-bubble light-bubble">3</span>
              </div>
              <div class="tests-sub">
                <span>181 Scenario-based Questions &rarr;</span>
              </div>
            </a>

            <!-- Widget 4: Performance & Readiness (Dynamic Glowing Spline Wave) -->
            <div class="widget-card widget-performance">
              <div class="widget-header">
                <div class="perf-title-row">
                  <span class="widget-title">Performance</span>
                  <span class="perf-sub-badge">{{ readinessVerdict }}</span>
                </div>
                <span class="widget-idx-bubble">4</span>
              </div>

              <div class="performance-chart-wrap">
                <!-- Score badge tag floating on top of dynamic wave peak -->
                <div 
                  class="performance-score-pill" 
                  :style="{ left: `${waveData.peakX - 22}px`, top: `${Math.max(2, waveData.peakY - 26)}px` }"
                >
                  <span>{{ readinessScore }}%</span>
                </div>

                <!-- SVG Spline Wave Chart -->
                <svg width="100%" height="90" viewBox="0 0 240 90" fill="none" class="wave-svg">
                  <defs>
                    <linearGradient id="waveGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#906BFF" stop-opacity="0.3"/>
                      <stop offset="100%" stop-color="#906BFF" stop-opacity="0"/>
                    </linearGradient>
                  </defs>
                  <!-- Dynamic Gradient fill under spline -->
                  <path :d="waveData.fillPath" fill="url(#waveGlow)"/>
                  <!-- Vibrant line stroke -->
                  <path :d="waveData.linePath" stroke="#906BFF" stroke-width="3" stroke-linecap="round" fill="none"/>
                  <!-- Dynamic Glowing circle on peak -->
                  <circle :cx="waveData.peakX" :cy="waveData.peakY" r="5" fill="#FFFFFF" stroke="#906BFF" stroke-width="3"/>
                </svg>
              </div>

              <div class="perf-meta-row">
                <span class="perf-meta-note">{{ completedLessons }} of {{ totalLessons }} lessons</span>
                <span class="perf-meta-ready">{{ readinessScore >= 80 ? 'Exam Ready' : 'In Progress' }}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* 1920px Full Canvas Layout with Left Dock */
.dribbble-dashboard-container {
  display: flex;
  background-color: #0E0F14;
  min-height: 100vh;
  width: 100%;
  color: #FFFFFF;
  box-sizing: border-box;
  font-family: var(--vp-font-family-base) !important;
  font-weight: 600 !important;
}

/* LEFT NAVIGATION DOCK */
.left-dock {
  width: 80px;
  background-color: #12131A;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem 0;
  flex-shrink: 0;
}

@media (max-width: 900px) {
  .left-dock {
    display: none;
  }
}

.dock-brand {
  margin-bottom: 2.5rem;
}

.brand-sparkle-box {
  width: 44px;
  height: 44px;
  background: rgba(144, 107, 255, 0.12);
  border: 1px solid rgba(144, 107, 255, 0.25);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.2s ease;
}

.brand-sparkle-box:hover {
  background: rgba(144, 107, 255, 0.22);
  border-color: rgba(144, 107, 255, 0.4);
}

.dock-menu {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
  align-items: center;
  flex: 1;
}

.dock-item {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6B7280;
  text-decoration: none;
  transition: all 0.2s ease;
  position: relative;
}

.dock-item:hover, .dock-item.active {
  color: #FFFFFF;
  background-color: rgba(255, 255, 255, 0.08);
}

.dock-item.active::before {
  content: '';
  position: absolute;
  left: -18px;
  top: 8px;
  bottom: 8px;
  width: 4px;
  background: #906BFF;
  border-radius: 0 4px 4px 0;
}

.dock-bottom {
  margin-top: auto;
}

/* MAIN CONTENT PANE */
.dashboard-main {
  flex: 1;
  padding: 2.5rem 3.5rem 5rem;
  max-width: 1840px;
  box-sizing: border-box;
}

@media (max-width: 1200px) {
  .dashboard-main {
    padding: 1.5rem 1.5rem 4rem;
  }
}

/* TOP HEADER BAR */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.2rem;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.header-title {
  font-family: var(--vp-font-family-headings) !important;
  font-size: 2.1rem;
  font-weight: 700 !important;
  letter-spacing: -0.02em;
  margin: 0 0 0.25rem;
  color: #FFFFFF;
}

.header-subtitle {
  font-size: 0.92rem;
  color: #6B7280;
  font-weight: 600;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 0.9rem;
}

/* SEARCH PILL & DROPDOWN */
.search-pill-wrap {
  position: relative;
}

.search-pill {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background-color: #161720;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 9999px;
  padding: 0.55rem 1rem;
  width: 340px;
  max-width: 100%;
  box-sizing: border-box;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: text;
}

.search-pill:hover {
  border-color: rgba(255, 255, 255, 0.22);
  background-color: #1A1C26;
}

.search-pill:focus-within {
  border-color: #906BFF;
  background-color: #1B1D2A;
  box-shadow: 0 0 0 3px rgba(144, 107, 255, 0.25);
}

.search-icon {
  color: #8E92A4;
  flex-shrink: 0;
}

.search-input {
  flex: 1 1 0%;
  min-width: 0;
  background: transparent;
  border: none;
  outline: none;
  color: #FFFFFF;
  font-size: 0.88rem;
  font-weight: 500;
  font-family: var(--vp-font-family-base) !important;
}

.search-input::placeholder {
  color: #6E7387;
  font-weight: 400;
}

.kbd-shortcut {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #232533;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-bottom: 2px solid rgba(255, 255, 255, 0.22);
  border-radius: 6px;
  padding: 0 0.55rem;
  height: 22px;
  font-size: 0.72rem;
  font-weight: 600;
  color: #A3A8BD;
  font-family: var(--vp-font-family-mono);
  white-space: nowrap;
  letter-spacing: 0.02em;
  user-select: none;
  pointer-events: none;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
}

.search-results-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: #181923;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
  z-index: 100;
  overflow: hidden;
  max-height: 380px;
  overflow-y: auto;
}

.search-no-results {
  padding: 1.25rem;
  font-size: 0.88rem;
  color: #9CA3AF;
  text-align: center;
}

.search-result-item {
  display: flex;
  flex-direction: column;
  padding: 0.9rem 1.2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  text-decoration: none;
  transition: background 0.15s ease;
}

.search-result-item:last-child {
  border-bottom: none;
}

.search-result-item:hover {
  background: #232535;
}

.res-title {
  color: #FFFFFF;
  font-size: 0.92rem;
  font-weight: 700;
  margin-bottom: 0.2rem;
}

.res-path {
  color: #906BFF;
  font-size: 0.75rem;
  font-family: var(--vp-font-family-mono);
}

/* NOTIFICATIONS POPUP */
.notification-wrap {
  position: relative;
}

.header-action-btn, .header-social-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #161720;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9CA3AF;
  text-decoration: none;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
}

.header-action-btn:hover, .header-social-btn:hover {
  color: #FFFFFF;
  border-color: rgba(255, 255, 255, 0.25);
  background: #1F212D;
}

.linkedin-btn:hover {
  color: #0A66C2;
}

.notification-indicator {
  position: absolute;
  top: 11px;
  right: 11px;
  width: 7px;
  height: 7px;
  background: #FF3621;
  border-radius: 50%;
  box-shadow: 0 0 6px #FF3621;
}

.notifications-panel {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  width: 360px;
  background: #181923;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 18px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
  z-index: 100;
  overflow: hidden;
}

.notif-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.1rem 1.3rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: #14151D;
}

.notif-title-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.notif-title {
  font-family: var(--vp-font-family-headings) !important;
  font-weight: 700;
  font-size: 0.95rem;
  color: #FFFFFF;
}

.notif-pill {
  font-size: 0.72rem;
  padding: 2px 7px;
  background: rgba(144, 107, 255, 0.2);
  color: #A78BFA;
  border-radius: 10px;
  font-weight: 700;
}

.mark-read-btn {
  background: transparent;
  border: none;
  color: #9CA3AF;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
}

.mark-read-btn:hover {
  color: #FFFFFF;
}

.notif-list {
  max-height: 320px;
  overflow-y: auto;
}

.notif-item {
  padding: 1rem 1.3rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: background 0.15s ease;
}

.notif-item:last-child {
  border-bottom: none;
}

.notif-item.unread {
  background: rgba(144, 107, 255, 0.05);
}

.notif-lead {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.3rem;
}

.notif-item-title {
  font-size: 0.88rem;
  font-weight: 700;
  color: #FFFFFF;
}

.notif-time {
  font-size: 0.72rem;
  color: #6B7280;
}

.notif-desc {
  font-size: 0.82rem;
  color: #9CA3AF;
  line-height: 1.45;
  margin: 0;
}

/* HERO SPOTLIGHT CARD */
.hero-spotlight-card {
  position: relative;
  background-color: #13141C;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 3rem 3.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  margin-bottom: 2.75rem;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.35);
}

@media (max-width: 1024px) {
  .hero-spotlight-card {
    flex-direction: column;
    padding: 2rem;
  }
}

.hero-left-content {
  max-width: 680px;
  z-index: 2;
}

.pill-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.95rem;
  background: rgba(144, 107, 255, 0.14);
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: #A78BFA;
  margin-bottom: 1.35rem;
}

.tag-accent-dot {
  width: 6px;
  height: 6px;
  background: #906BFF;
  border-radius: 50%;
}

.spotlight-title {
  font-family: var(--vp-font-family-headings) !important;
  font-size: 3.1rem;
  font-weight: 800 !important;
  line-height: 1.14;
  color: #FFFFFF;
  margin: 0 0 1.1rem;
  letter-spacing: -0.025em;
}

@media (max-width: 768px) {
  .spotlight-title {
    font-size: 2.2rem;
  }
}

.spotlight-caption {
  font-size: 1.05rem;
  line-height: 1.65;
  color: #9CA3AF;
  margin: 0 0 2.2rem;
}

.spotlight-actions {
  display: flex;
  gap: 1.1rem;
  flex-wrap: wrap;
}

.btn-continue-course {
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  background: #906BFF;
  color: #FFFFFF;
  padding: 0.85rem 1.8rem;
  border-radius: 30px;
  font-weight: 700;
  font-size: 0.88rem;
  letter-spacing: 0.05em;
  text-decoration: none;
  transition: all 0.2s ease;
  box-shadow: 0 4px 20px rgba(144, 107, 255, 0.35);
}

.btn-continue-course:hover {
  background: #7C3AED;
  transform: translateY(-1px);
}

.play-circle {
  width: 28px;
  height: 28px;
  background: rgba(255, 255, 255, 0.22);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-ghost-course {
  display: inline-flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.06);
  color: #D1D5DB;
  padding: 0.85rem 1.8rem;
  border-radius: 30px;
  font-weight: 700;
  font-size: 0.88rem;
  letter-spacing: 0.05em;
  text-decoration: none;
  border: 1px solid rgba(255, 255, 255, 0.12);
  transition: all 0.2s ease;
}

.btn-ghost-course:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #FFFFFF;
}

.hero-graphic-wrap {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: flex-end;
}

.hero-3d-render {
  max-width: 520px;
  width: 100%;
  object-fit: contain;
  filter: drop-shadow(0 20px 30px rgba(0, 0, 0, 0.5));
}

@media (max-width: 1024px) {
  .hero-graphic-wrap {
    margin-top: 1.5rem;
  }
}

/* 2-COLUMN LOWER SECTION */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5rem;
}

@media (max-width: 1100px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

.section-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.35rem;
}

.column-title {
  font-family: var(--vp-font-family-headings) !important;
  font-size: 1.35rem;
  font-weight: 700 !important;
  color: #FFFFFF;
  margin: 0;
}

.filter-dropdown-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #9CA3AF;
  cursor: pointer;
  padding: 0.35rem 0.75rem;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.filter-dropdown-pill:hover {
  color: #FFFFFF;
  background: rgba(255, 255, 255, 0.05);
}

/* MODULES LIST (LEFT) */
.modules-card-list {
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
}

.module-card-item {
  display: flex;
  align-items: center;
  gap: 1.35rem;
  background-color: #15161E;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  padding: 1.35rem 1.6rem;
  text-decoration: none;
  transition: all 0.2s ease;
}

.module-card-item:hover {
  background-color: #1A1C26;
  border-color: rgba(144, 107, 255, 0.3);
  transform: translateY(-1px);
}

.module-icon-box {
  width: 54px;
  height: 54px;
  border-radius: 16px;
  background: #1C1D27;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #9CA3AF;
}

.module-icon-box.chart {
  color: #34D399;
  background: rgba(52, 211, 153, 0.1);
}

.module-icon-box.atom {
  color: #38BDF8;
  background: rgba(56, 189, 248, 0.1);
}

.module-icon-box.pulse {
  color: #A78BFA;
  background: rgba(167, 139, 250, 0.1);
}

.module-icon-box.book {
  color: #FBBF24;
  background: rgba(251, 191, 36, 0.1);
}

.module-text-wrap {
  flex: 1;
}

.mod-title {
  font-family: var(--vp-font-family-headings) !important;
  font-size: 1.1rem;
  font-weight: 700 !important;
  color: #FFFFFF;
  margin: 0 0 0.4rem;
  line-height: 1.35;
}

.mod-metrics-row {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  font-size: 0.88rem;
  color: #9CA3AF;
}

.metric-highlight {
  font-weight: 700;
}

.metric-sub {
  color: #6B7280;
}

.progress-track-wrap {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  max-width: 220px;
}

.progress-num {
  font-size: 0.82rem;
  color: #9CA3AF;
  min-width: 32px;
}

.progress-bar-bg {
  flex: 1;
  height: 5px;
  background: #232532;
  border-radius: 10px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: #906BFF;
  border-radius: 10px;
}

.status-badge-wrap {
  flex-shrink: 0;
}

.status-pill {
  display: inline-block;
  padding: 0.4rem 0.95rem;
  border-radius: 20px;
  font-size: 0.82rem;
  font-weight: 700;
}

.status-completed {
  background: #1C2D24;
  color: #34D399;
}

.status-in-progress {
  background: #1F212D;
  color: #6B7280;
}

/* RIGHT ANALYTICS QUAD GRID */
.analytics-quad-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 1.15rem;
}

@media (max-width: 640px) {
  .analytics-quad-grid {
    grid-template-columns: 1fr;
  }
}

.widget-card {
  background-color: #15161E;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 22px;
  padding: 1.6rem;
  display: flex;
  flex-direction: column;
  position: relative;
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.85rem;
}

.widget-title {
  font-family: var(--vp-font-family-headings) !important;
  font-size: 1.05rem;
  font-weight: 700 !important;
  color: #D1D5DB;
}

.widget-idx-bubble {
  width: 24px;
  height: 24px;
  background: #232532;
  color: #9CA3AF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.74rem;
  font-weight: 700;
}

.light-bubble {
  background: rgba(255, 255, 255, 0.25);
  color: #FFFFFF;
}

/* Widget 1: Pomodoro Focus Clock */
.widget-pomodoro {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
  min-height: 236px;
}

.pomodoro-header-title {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.live-pulse-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(52, 211, 153, 0.15);
  color: #34D399;
  border: 1px solid rgba(52, 211, 153, 0.3);
  border-radius: 20px;
  padding: 1px 7px;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  animation: liveBadgePulse 2s infinite ease-in-out;
}

@keyframes liveBadgePulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(0.96); }
}

.pomodoro-tabs {
  display: flex;
  background: #101117;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 24px;
  padding: 3px;
  gap: 3px;
  margin-bottom: 0.85rem;
}

.pomo-tab {
  flex: 1;
  background: transparent;
  border: none;
  border-radius: 20px;
  padding: 0.32rem 0;
  font-size: 0.74rem;
  font-weight: 600;
  color: #8E92A4;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  text-align: center;
}

.pomo-tab:hover {
  color: #FFFFFF;
}

.pomo-tab.active {
  background: #232534;
  color: #FFFFFF;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.pomodoro-clock-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem 0;
}

.pomo-ring-container {
  position: relative;
  width: 124px;
  height: 124px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pomo-ring-svg {
  position: absolute;
  top: 0;
  left: 0;
  transform: rotate(-90deg);
}

.pomo-ring-track {
  fill: none;
  stroke: rgba(255, 255, 255, 0.06);
  stroke-width: 7;
}

.pomo-ring-progress {
  fill: none;
  stroke: #906BFF;
  stroke-width: 7;
  stroke-linecap: round;
  stroke-dasharray: 339.29;
  transition: stroke-dashoffset 0.85s linear, stroke 0.3s ease;
}

.pomo-ring-progress.pomo-ring-active {
  stroke: url(#pomoGrad);
  filter: drop-shadow(0 0 6px rgba(144, 107, 255, 0.5));
}

.pomo-time-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  z-index: 2;
}

.pomo-digits {
  font-family: var(--vp-font-family-headings) !important;
  font-size: 1.55rem;
  font-weight: 800 !important;
  color: #FFFFFF;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.pomo-status-tag {
  font-size: 0.65rem;
  font-weight: 700;
  color: #9CA3AF;
  letter-spacing: 0.06em;
  margin-top: 2px;
}

.pomodoro-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.75rem;
  padding-top: 0.65rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.pomodoro-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pomo-btn-main {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  background: #906BFF;
  color: #FFFFFF;
  border: none;
  border-radius: 20px;
  padding: 0.42rem 0.95rem;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 10px rgba(144, 107, 255, 0.35);
}

.pomo-btn-main:hover {
  background: #7C3AED;
  transform: translateY(-1px);
}

.pomo-btn-main.pomo-btn-running {
  background: #272A3A;
  color: #F87171;
  border: 1px solid rgba(248, 113, 113, 0.3);
  box-shadow: none;
}

.pomo-btn-main.pomo-btn-running:hover {
  background: #32364A;
}

.pomo-btn-reset {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #9CA3AF;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pomo-btn-reset:hover {
  color: #FFFFFF;
  background: rgba(255, 255, 255, 0.12);
}

.pomo-counter {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.pomo-fire-icon {
  font-size: 0.85rem;
}

.pomo-streak-text {
  font-size: 0.75rem;
  color: #9CA3AF;
  font-weight: 600;
}

/* Widget 2: Purple Card */
.widget-purple-card {
  background-color: #906BFF;
  border-color: #906BFF;
  justify-content: space-between;
}

.light-text {
  color: #FFFFFF;
}

.purple-card-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 2.2rem;
}

.purple-sub-label {
  font-size: 0.95rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
}

.light-num {
  color: #FFFFFF;
}

/* Widget 3: Complete tests */
.widget-tests-card {
  background-color: #A78BFA;
  border-color: #A78BFA;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  justify-content: center;
}

.widget-tests-card:hover {
  background-color: #906BFF;
  transform: translateY(-2px);
}

.tests-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.35rem;
}

.tests-title {
  font-family: var(--vp-font-family-headings) !important;
  font-size: 1.2rem;
  font-weight: 700 !important;
  color: #FFFFFF;
}

.tests-sub {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 700;
}

/* Widget 4: Performance Wave */
.widget-performance {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.perf-title-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.perf-sub-badge {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 1px 7px;
  border-radius: 12px;
  background: rgba(144, 107, 255, 0.15);
  color: #A78BFA;
  border: 1px solid rgba(144, 107, 255, 0.25);
}

.performance-chart-wrap {
  position: relative;
  margin-top: 0.5rem;
  width: 100%;
}

.performance-score-pill {
  position: absolute;
  background: #7C3AED;
  color: #FFFFFF;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.5);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none;
  white-space: nowrap;
  z-index: 5;
}

.wave-svg {
  display: block;
  width: 100%;
  overflow: visible;
}

.perf-meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.6rem;
  padding-top: 0.6rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 0.78rem;
}

.perf-meta-note {
  color: #8E92A4;
}

.perf-meta-ready {
  font-weight: 700;
  color: #34D399;
}
</style>
