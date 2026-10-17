<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'complete'])

const steps = [
  {
    target: '#walkthrough-top-right',
    tag: 'COMMAND CENTER',
    title: 'Top Right Command Center',
    description: 'Instant global search with Ctrl K shortcut, activity feed alerts, and direct connection icons for LinkedIn, GitHub repository, and Google NotebookLM AI study companion.',
    preferredPos: 'bottom-right'
  },
  {
    target: '#walkthrough-continue-btn',
    tag: 'QUICK JUMP',
    title: 'Continue Course Action Button',
    description: 'Jump right back into your active curriculum module with one click, or switch over to the scenario-based practice quizzes to reinforce exam concepts.',
    preferredPos: 'bottom-left'
  },
  {
    target: '#walkthrough-courses',
    tag: 'CURRICULUM & FILTERS',
    title: 'Course Modules & Concept Filter',
    description: 'Explore all 4 core DP-750 exam tracks. Click "Filter by" to type keywords (e.g. Photon, Unity Catalog, Auto Loader, Lakeflow) or click quick tags to jump straight to any topic.',
    preferredPos: 'right'
  },
  {
    target: '#walkthrough-progress',
    tag: 'REAL-TIME ANALYTICS',
    title: 'My Progress & Timeframe Options',
    description: 'Monitor your exam readiness with real-time stats. Toggle between "Last month" and "Last week", check lessons completed, practice quizzes, and view your dynamic readiness spline curve.',
    preferredPos: 'left'
  },
  {
    target: '#walkthrough-pomodoro',
    tag: 'STUDY ENGINE',
    title: 'Integrated Pomodoro Focus Clock',
    description: 'Choose 25m focus or 50m deep work blocks. The animated timer keeps ticking across pages and browser refreshes, displaying a floating flame pill when reading notes.',
    preferredPos: 'left'
  }
]

const currentStep = ref(0)
const currentStepData = computed(() => steps[currentStep.value] || steps[0])
const isLastStep = computed(() => currentStep.value === steps.length - 1)

const spotlightBox = ref({
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  radius: 16
})

const popoverStyle = ref({
  top: '100px',
  left: '100px',
  width: '380px',
  opacity: 0
})

let previousTargetEl = null

function updateCoordinates() {
  if (!props.isOpen || typeof window === 'undefined') return

  const step = currentStepData.value
  const targetEl = document.querySelector(step.target)
  if (!targetEl) return

  if (previousTargetEl && previousTargetEl !== targetEl) {
    previousTargetEl.classList.remove('walkthrough-highlighted-element')
  }
  targetEl.classList.add('walkthrough-highlighted-element')
  previousTargetEl = targetEl

  const rect = targetEl.getBoundingClientRect()
  const pad = 10

  const box = {
    x: Math.max(4, rect.left - pad),
    y: Math.max(4, rect.top - pad),
    width: rect.width + pad * 2,
    height: rect.height + pad * 2,
    radius: step.target.includes('continue-btn') ? 9999 : 16
  }
  spotlightBox.value = box

  const cardWidth = Math.min(380, window.innerWidth - 32)
  const cardHeight = 260
  const margin = 16

  let posX = 0
  let posY = 0

  if (window.innerWidth < 768) {
    // Mobile dock
    posX = 16
    posY = window.innerHeight - cardHeight - 20
  } else {
    const pos = step.preferredPos || 'bottom'

    if (pos === 'bottom-right') {
      posX = box.x + box.width - cardWidth
      posY = box.y + box.height + margin
    } else if (pos === 'bottom-left' || pos === 'bottom') {
      posX = box.x
      posY = box.y + box.height + margin
    } else if (pos === 'right') {
      posX = box.x + box.width + margin
      posY = Math.max(20, box.y + 20)
      if (posX + cardWidth > window.innerWidth - 16) {
        posX = window.innerWidth - cardWidth - 16
        posY = box.y + box.height + margin
      }
    } else if (pos === 'left') {
      posX = box.x - cardWidth - margin
      posY = Math.max(20, box.y + 20)
      if (posX < 16) {
        posX = 16
        posY = box.y + box.height + margin
      }
    }

    // Safety clamping
    posX = Math.max(16, Math.min(window.innerWidth - cardWidth - 16, posX))
    posY = Math.max(16, Math.min(window.innerHeight - cardHeight - 16, posY))
  }

  popoverStyle.value = {
    top: `${posY}px`,
    left: `${posX}px`,
    width: `${cardWidth}px`,
    opacity: 1
  }
}

function goToStep(idx) {
  if (idx < 0 || idx >= steps.length) return
  currentStep.value = idx

  nextTick(() => {
    const step = steps[idx]
    const el = document.querySelector(step.target)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
      setTimeout(updateCoordinates, 260)
    } else {
      updateCoordinates()
    }
  })
}

function nextStep() {
  if (isLastStep.value) {
    finishWalkthrough()
  } else {
    goToStep(currentStep.value + 1)
  }
}

function prevStep() {
  if (currentStep.value > 0) {
    goToStep(currentStep.value - 1)
  }
}

function skipWalkthrough() {
  closeTour()
}

function finishWalkthrough() {
  if (typeof window !== 'undefined') {
    localStorage.setItem('dp750_walkthrough_seen', 'true')
  }
  emit('complete')
  closeTour()
}

function closeTour() {
  if (previousTargetEl) {
    previousTargetEl.classList.remove('walkthrough-highlighted-element')
    previousTargetEl = null
  }
  emit('close')
}

function handleKeydown(e) {
  if (!props.isOpen) return
  if (e.key === 'Escape') {
    closeTour()
  } else if (e.key === 'ArrowRight') {
    nextStep()
  } else if (e.key === 'ArrowLeft') {
    prevStep()
  }
}

watch(() => props.isOpen, (open) => {
  if (open) {
    currentStep.value = 0
    nextTick(() => {
      goToStep(0)
    })
    window.addEventListener('resize', updateCoordinates)
    window.addEventListener('scroll', updateCoordinates, { passive: true })
    window.addEventListener('keydown', handleKeydown)
  } else {
    if (previousTargetEl) {
      previousTargetEl.classList.remove('walkthrough-highlighted-element')
      previousTargetEl = null
    }
    window.removeEventListener('resize', updateCoordinates)
    window.removeEventListener('scroll', updateCoordinates)
    window.removeEventListener('keydown', handleKeydown)
  }
})

onMounted(() => {
  if (props.isOpen) {
    goToStep(0)
  }
})

onUnmounted(() => {
  if (previousTargetEl) {
    previousTargetEl.classList.remove('walkthrough-highlighted-element')
  }
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateCoordinates)
    window.removeEventListener('scroll', updateCoordinates)
    window.removeEventListener('keydown', handleKeydown)
  }
})
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="walkthrough-container">
      <!-- Fullscreen Backdrop with backdrop-filter blur and SVG cutout hole -->
      <div class="walkthrough-backdrop" @click="skipWalkthrough">
        <svg class="walkthrough-mask-svg" width="100%" height="100%">
          <defs>
            <mask id="walkthroughCutoutMask" maskUnits="userSpaceOnUse">
              <!-- Entire screen is white (blurred + dark) -->
              <rect width="100%" height="100%" fill="white" />
              <!-- Target element is black (punched out 100% transparent and unblurred!) -->
              <rect 
                :x="spotlightBox.x" 
                :y="spotlightBox.y" 
                :width="spotlightBox.width" 
                :height="spotlightBox.height" 
                :rx="spotlightBox.radius" 
                fill="black" 
              />
            </mask>
          </defs>
          <rect 
            width="100%" 
            height="100%" 
            fill="rgba(5, 6, 11, 0.78)" 
            mask="url(#walkthroughCutoutMask)" 
          />
        </svg>
      </div>

      <!-- Glowing Spotlight Highlight Ring framing the element -->
      <div 
        class="walkthrough-spotlight-ring"
        :style="{
          top: `${spotlightBox.y}px`,
          left: `${spotlightBox.x}px`,
          width: `${spotlightBox.width}px`,
          height: `${spotlightBox.height}px`,
          borderRadius: `${spotlightBox.radius}px`
        }"
      >
        <span class="spotlight-beacon"></span>
        <span class="spotlight-corner corner-tl"></span>
        <span class="spotlight-corner corner-tr"></span>
        <span class="spotlight-corner corner-bl"></span>
        <span class="spotlight-corner corner-br"></span>
      </div>

      <!-- Floating Walkthrough Card / Popover -->
      <div class="walkthrough-card" :style="popoverStyle">
        <div class="card-glow-edge"></div>

        <!-- Header: Step badge & Counter -->
        <div class="card-header">
          <div class="card-tag-pill">
            <span class="tag-pulse-dot"></span>
            <span class="tag-label">{{ currentStepData.tag }}</span>
          </div>
          <div class="card-counter">
            <span class="curr-num">{{ currentStep + 1 }}</span>
            <span class="sep">/</span>
            <span class="total-num">{{ steps.length }}</span>
          </div>
        </div>

        <!-- Main Content -->
        <h3 class="card-title">{{ currentStepData.title }}</h3>
        <p class="card-desc">{{ currentStepData.description }}</p>

        <!-- Interactive Progress Dots -->
        <div class="card-dots-row">
          <button 
            v-for="(s, i) in steps" 
            :key="i"
            class="step-dot"
            :class="{ active: i === currentStep, completed: i < currentStep }"
            @click="goToStep(i)"
            :title="`Go to ${s.title}`"
          ></button>
        </div>

        <!-- Footer Actions -->
        <div class="card-footer">
          <button class="btn-skip-tour" @click="skipWalkthrough">
            Skip Tour
          </button>

          <div class="nav-btn-group">
            <button 
              v-if="currentStep > 0"
              class="btn-tour-prev" 
              @click="prevStep"
              title="Previous Step (Left Arrow)"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              <span>Back</span>
            </button>

            <button 
              class="btn-tour-next" 
              @click="nextStep"
              :title="isLastStep ? 'Finish Tour' : 'Next Step (Right Arrow)'"
            >
              <span>{{ isLastStep ? 'Got it &middot; Finish' : 'Next Step' }}</span>
              <svg v-if="!isLastStep" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
              <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Subtext shortcut hints -->
        <div class="card-shortcuts-hint">
          <span>Use <kbd>&larr;</kbd> <kbd>&rarr;</kbd> to navigate &bull; <kbd>Esc</kbd> to exit</span>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.walkthrough-container {
  position: fixed;
  inset: 0;
  z-index: 99990;
  pointer-events: none;
}

.walkthrough-backdrop {
  position: fixed;
  inset: 0;
  pointer-events: auto;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.walkthrough-mask-svg {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
}

/* Glowing Neon Highlight Ring */
.walkthrough-spotlight-ring {
  position: fixed;
  z-index: 99995;
  pointer-events: none;
  border: 2px solid #906BFF;
  box-shadow: 
    0 0 35px rgba(144, 107, 255, 0.45),
    inset 0 0 15px rgba(144, 107, 255, 0.18);
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  box-sizing: border-box;
}

.spotlight-beacon {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #906BFF;
  box-shadow: 0 0 12px #906BFF;
  animation: beaconPulse 2s infinite ease-in-out;
}

@keyframes beaconPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.6);
    opacity: 0.4;
  }
}

.spotlight-corner {
  position: absolute;
  width: 8px;
  height: 8px;
  border-color: #FFFFFF;
  border-style: solid;
}

.corner-tl {
  top: -2px;
  left: -2px;
  border-width: 2px 0 0 2px;
  border-top-left-radius: 4px;
}

.corner-tr {
  top: -2px;
  right: -2px;
  border-width: 2px 2px 0 0;
  border-top-right-radius: 4px;
}

.corner-bl {
  bottom: -2px;
  left: -2px;
  border-width: 0 0 2px 2px;
  border-bottom-left-radius: 4px;
}

.corner-br {
  bottom: -2px;
  right: -2px;
  border-width: 0 2px 2px 0;
  border-bottom-right-radius: 4px;
}

/* Floating Tour Card */
.walkthrough-card {
  position: fixed;
  z-index: 100000;
  pointer-events: auto;
  background: #15161E;
  border: 1px solid rgba(144, 107, 255, 0.3);
  border-radius: 20px;
  padding: 1.5rem 1.6rem 1.25rem;
  box-shadow: 
    0 25px 60px rgba(0, 0, 0, 0.8),
    0 0 40px rgba(144, 107, 255, 0.2);
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  box-sizing: border-box;
  font-family: var(--vp-font-family-base) !important;
  color: #F3F4F6;
  overflow: hidden;
}

.card-glow-edge {
  position: absolute;
  top: 0;
  left: 20%;
  right: 20%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #906BFF, transparent);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.85rem;
}

.card-tag-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(144, 107, 255, 0.12);
  border: 1px solid rgba(144, 107, 255, 0.25);
  padding: 3px 10px;
  border-radius: 9999px;
}

.tag-pulse-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #906BFF;
  box-shadow: 0 0 8px #906BFF;
}

.tag-label {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: #A78BFA;
  text-transform: uppercase;
}

.card-counter {
  font-size: 0.78rem;
  color: #8E92A4;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 3px;
}

.card-counter .curr-num {
  color: #FFFFFF;
}

.card-counter .sep {
  color: #555869;
}

.card-title {
  font-family: var(--vp-font-family-headings) !important;
  font-size: 1.15rem;
  font-weight: 600 !important;
  color: #FFFFFF;
  margin: 0 0 0.5rem;
  letter-spacing: -0.02em;
}

.card-desc {
  font-family: var(--vp-font-family-base) !important;
  font-size: 0.86rem;
  line-height: 1.55;
  color: #9CA3AF;
  margin: 0 0 1.25rem;
}

/* Dots Navigation */
.card-dots-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 1.25rem;
}

.step-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.16);
  border: none;
  padding: 0;
  cursor: pointer;
  transition: all 0.25s ease;
}

.step-dot:hover {
  background: rgba(255, 255, 255, 0.4);
}

.step-dot.completed {
  background: rgba(144, 107, 255, 0.5);
}

.step-dot.active {
  width: 22px;
  border-radius: 9999px;
  background: #906BFF;
  box-shadow: 0 0 10px rgba(144, 107, 255, 0.5);
}

/* Footer Actions */
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.8rem;
}

.btn-skip-tour {
  background: transparent;
  border: none;
  color: #8E92A4;
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
  padding: 6px 4px;
  transition: color 0.15s ease;
  font-family: var(--vp-font-family-base) !important;
}

.btn-skip-tour:hover {
  color: #F3F4F6;
}

.nav-btn-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-tour-prev {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #D1D5DB;
  font-size: 0.82rem;
  font-weight: 600;
  padding: 7px 14px;
  border-radius: 9999px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
  font-family: var(--vp-font-family-base) !important;
}

.btn-tour-prev:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #FFFFFF;
}

.btn-tour-next {
  background: #906BFF;
  border: none;
  color: #FFFFFF;
  font-size: 0.82rem;
  font-weight: 600;
  padding: 7px 16px;
  border-radius: 9999px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 4px 14px rgba(144, 107, 255, 0.35);
  transition: all 0.2s ease;
  font-family: var(--vp-font-family-base) !important;
}

.btn-tour-next:hover {
  background: #7C3AED;
  box-shadow: 0 6px 18px rgba(144, 107, 255, 0.5);
  transform: translateY(-1px);
}

.card-shortcuts-hint {
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  text-align: center;
  font-size: 0.72rem;
  color: #6B7280;
}

.card-shortcuts-hint kbd {
  background: #1E202B;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 4px;
  padding: 1px 5px;
  font-size: 0.68rem;
  color: #9CA3AF;
  font-family: var(--vp-font-family-mono) !important;
}
</style>
