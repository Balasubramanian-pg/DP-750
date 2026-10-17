<script setup>
import { withBase } from 'vitepress'
</script>

<template>
  <div class="custom-404-container">
    <div class="custom-404-content">
      <!-- Huge Gradient Masked 404 Title -->
      <h1 class="custom-404-title">404</h1>
      
      <!-- Subtitle Description -->
      <p class="custom-404-desc">
        The page you're looking for might have been<br />
        moved or doesn't exist.
      </p>

      <!-- Action Buttons matching shadcn UI -->
      <div class="custom-404-actions">
        <a :href="withBase('/')" class="btn-go-home">
          <!-- Lucide HomeIcon -->
          <svg class="btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span>Go Home</span>
        </a>

        <a :href="withBase('/01-setup-and-configure/')" class="btn-explore">
          <!-- Lucide CompassIcon -->
          <svg class="btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
          </svg>
          <span>Explore</span>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-404-container {
  min-height: calc(100vh - var(--vp-nav-height, 64px));
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0D0E12;
  padding: 3rem 1.5rem;
  box-sizing: border-box;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.custom-404-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 540px;
  width: 100%;
  position: relative;
  z-index: 1;
}

/* 404 Large Heading with Metallic Gradient Mask fade */
.custom-404-title {
  font-family: var(--vp-font-family-headings, 'Plus Jakarta Sans', sans-serif) !important;
  font-size: clamp(6.5rem, 16vw, 11rem);
  font-weight: 800 !important;
  line-height: 0.9;
  letter-spacing: -0.05em;
  margin: 0;
  padding: 0;
  background: linear-gradient(180deg, #FFFFFF 20%, rgba(255, 255, 255, 0.35) 75%, rgba(255, 255, 255, 0.08) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 30%, rgba(0, 0, 0, 0.15) 100%);
  -webkit-mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 30%, rgba(0, 0, 0, 0.15) 100%);
  user-select: none;
}

.custom-404-desc {
  font-family: var(--vp-font-family-base, 'Avenir Next Cyr', sans-serif) !important;
  font-size: 1.02rem;
  line-height: 1.6;
  color: #9CA3AF;
  margin: -1.2rem 0 2rem;
  text-wrap: balance;
}

.custom-404-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
}

.btn-go-home {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  height: 42px;
  padding: 0 1.25rem;
  border-radius: 8px;
  background-color: #FFFFFF;
  color: #0D0E12 !important;
  font-family: var(--vp-font-family-base, sans-serif) !important;
  font-size: 0.88rem;
  font-weight: 600;
  text-decoration: none !important;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(255, 255, 255, 0.15);
}

.btn-go-home:hover {
  background-color: #F3F4F6;
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(255, 255, 255, 0.25);
}

.btn-explore {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  height: 42px;
  padding: 0 1.25rem;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: #FFFFFF !important;
  font-family: var(--vp-font-family-base, sans-serif) !important;
  font-size: 0.88rem;
  font-weight: 500;
  text-decoration: none !important;
  transition: all 0.2s ease;
}

.btn-explore:hover {
  background-color: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.28);
  transform: translateY(-1px);
}

.btn-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}
</style>
