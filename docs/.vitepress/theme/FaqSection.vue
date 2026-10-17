<script setup>
import { ref } from 'vue'

const props = defineProps({
  eyebrow: {
    type: String,
    default: 'FAQ'
  },
  title: {
    type: String,
    default: 'Frequently Asked Questions'
  },
  description: {
    type: String,
    default: 'Answers to the questions we hear most about the DP-750 Azure Databricks certification exam and this preparation portal.'
  },
  layout: {
    type: String,
    default: 'split' // 'split' or 'stacked'
  }
})

const openItem = ref('dp750-scope')

function toggleItem(id) {
  if (openItem.value === id) {
    openItem.value = null
  } else {
    openItem.value = id
  }
}

const faqItems = [
  {
    id: 'dp750-scope',
    question: 'What is Microsoft DP-750: Azure Databricks Data Engineer?',
    answer: 'DP-750 is Microsoft\'s premier enterprise certification assessing hands-on architectural and engineering competencies on Azure Databricks. The curriculum covers 4 core technical domains: Workspace Architecture & Sizing (Photon, Single-user vs Shared clusters), Unity Catalog Governance (row filters, column masks, metastore storage credentials), Medallion Streaming Ingestion (Auto Loader, Delta Live Tables, CDC), and Lakeflow Jobs with Databricks Asset Bundles (DABs).'
  },
  {
    id: 'practice-engine',
    question: 'How do the 181 practice quizzes and 12 enterprise labs work?',
    answer: 'The practice engine includes 181 scenario-based multiple choice questions with immediate answer feedback, detailed rationales, and exam domain tagging. The 12 enterprise labs provide complete architectural setups, PySpark & SQL scripts, and step-by-step guidance for testing real-world data pipelines.'
  },
  {
    id: 'privacy-storage',
    question: 'Where is my study progress and Pomodoro timer stored?',
    answer: 'Everything is saved 100% locally on your computer using browser LocalStorage. Zero tracking cookies or remote telemetry servers log your activity. Your completed lessons count, readiness score, and Pomodoro focus blocks persist across sessions until you decide to clear them.'
  },
  {
    id: 'azure-cost',
    question: 'Can I study the curriculum without an active Azure subscription?',
    answer: 'Yes! The curriculum notes, architectural diagrams, and quiz simulators require zero Azure spend. For hands-on PySpark and Delta Lake coding, you can follow along using the free Databricks Community Edition or a local PySpark environment, while our notes document the enterprise Azure portal and CLI specifics.'
  },
  {
    id: 'readiness-curve',
    question: 'How is the Exam Readiness Score and Performance Spline calculated?',
    answer: 'The dashboard calculates your readiness score dynamically based on verified completions across all 183 structured curriculum items (51 Module 1 lessons, 23 Module 2 lessons, 52 Module 3 lessons, 45 Module 4 lessons, and 12 labs). The SVG spline wave dynamically shifts its peak and glow as you progress.'
  },
  {
    id: 'errata-contrib',
    question: 'How can I report a typo, request an explanation, or contribute?',
    answer: 'This portal is an open educational resource maintained by Balasubramanian PG. You can open issues, suggest enhancements, or submit pull requests directly through our GitHub repository.'
  }
]
</script>

<template>
  <section class="wiki-faq-section" :class="layout">
    <div class="wiki-faq-container">
      <!-- Header Column -->
      <div class="wiki-faq-header">
        <span class="faq-eyebrow">{{ eyebrow }}</span>
        <h2 class="faq-title">{{ title }}</h2>
        <p class="faq-description">{{ description }}</p>
        
        <div class="faq-footer-note">
          <span>Still have questions? </span>
          <a href="https://github.com/Balasubramanian-pg/DP-750/issues" target="_blank" rel="noopener" class="faq-footer-link">
            Open an issue on GitHub &rarr;
          </a>
        </div>
      </div>

      <!-- Accordion List Column -->
      <div class="wiki-faq-list">
        <div 
          v-for="(item, idx) in faqItems" 
          :key="item.id" 
          class="faq-accordion-item"
          :class="{ 'is-open': openItem === item.id }"
        >
          <button 
            class="faq-trigger" 
            :aria-expanded="openItem === item.id"
            @click="toggleItem(item.id)"
          >
            <span class="faq-question">{{ item.question }}</span>
            <span class="faq-chevron-box">
              <svg 
                class="faq-chevron" 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="2" 
                stroke-linecap="round" 
                stroke-linejoin="round"
              >
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </span>
          </button>

          <div v-show="openItem === item.id" class="faq-content">
            <p class="faq-answer">{{ item.answer }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.wiki-faq-section {
  padding: 4.5rem 1.5rem;
  background-color: #0D0E12;
  color: #F3F4F6;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.wiki-faq-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  gap: 3.5rem;
}

.wiki-faq-section.split .wiki-faq-container {
  grid-template-columns: 1fr;
}

@media (min-width: 992px) {
  .wiki-faq-section.split .wiki-faq-container {
    grid-template-columns: 1fr 1.6fr;
    gap: 4rem;
  }
}

/* Header */
.wiki-faq-header {
  display: flex;
  flex-direction: column;
}

.faq-eyebrow {
  font-family: var(--vp-font-family-headings, sans-serif) !important;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #906BFF;
  margin-bottom: 0.5rem;
}

.faq-title {
  font-family: var(--vp-font-family-headings, sans-serif) !important;
  font-size: clamp(1.8rem, 3.5vw, 2.5rem);
  font-weight: 700 !important;
  line-height: 1.2;
  letter-spacing: -0.025em;
  color: #FFFFFF;
  margin: 0 0 1rem;
}

.faq-description {
  font-family: var(--vp-font-family-base, sans-serif) !important;
  font-size: 1rem;
  line-height: 1.6;
  color: #9CA3AF;
  margin: 0 0 1.5rem;
}

.faq-footer-note {
  font-family: var(--vp-font-family-base, sans-serif) !important;
  font-size: 0.88rem;
  color: #6B7280;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.faq-footer-link {
  color: #A78BFA;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.15s ease;
}

.faq-footer-link:hover {
  color: #C4B5FD;
  text-decoration: underline;
}

/* Accordion */
.wiki-faq-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.faq-accordion-item {
  background: #15161E;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 14px;
  overflow: hidden;
  transition: all 0.25s ease;
}

.faq-accordion-item:hover {
  border-color: rgba(144, 107, 255, 0.3);
  background: #181A24;
}

.faq-accordion-item.is-open {
  border-color: rgba(144, 107, 255, 0.4);
  background: #181925;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.faq-trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.4rem;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  gap: 1rem;
  color: #F3F4F6;
  font-family: var(--vp-font-family-base, sans-serif) !important;
}

.faq-question {
  font-size: 1.02rem;
  font-weight: 600;
  color: #FFFFFF;
  line-height: 1.4;
}

.faq-chevron-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.04);
  flex-shrink: 0;
  transition: all 0.25s ease;
  color: #9CA3AF;
}

.faq-accordion-item:hover .faq-chevron-box {
  background: rgba(144, 107, 255, 0.15);
  color: #A78BFA;
}

.faq-chevron {
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.faq-accordion-item.is-open .faq-chevron {
  transform: rotate(180deg);
  color: #906BFF;
}

.faq-content {
  padding: 0 1.4rem 1.25rem;
  animation: faqFadeIn 0.25s ease;
}

@keyframes faqFadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.faq-answer {
  font-family: var(--vp-font-family-base, sans-serif) !important;
  font-size: 0.92rem;
  line-height: 1.65;
  color: #9CA3AF;
  margin: 0;
}
</style>
