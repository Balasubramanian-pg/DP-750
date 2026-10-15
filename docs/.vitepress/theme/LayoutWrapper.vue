<script setup>
import DefaultTheme from 'vitepress/theme'
const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #layout-bottom>
      <footer class="site-footer-custom">
        <div class="site-footer-inner">
          <div class="footer-col brand-col">
            <div class="footer-logo">
              <svg width="20" height="20" viewBox="0 0 32 32" fill="none" class="brand-glyph">
                <path d="M16 2L3 8.5L16 15L29 8.5L16 2Z" stroke="currentColor" stroke-width="1.8"/>
                <path d="M3 14.5L16 21L29 14.5" stroke="currentColor" stroke-width="1.8"/>
                <path d="M3 20.5L16 27L29 20.5" stroke="currentColor" stroke-width="1.8"/>
              </svg>
              <span class="brand-text">DP-750 PROTOCOL SPEC</span>
            </div>
            <p class="brand-desc">
              Deterministic curriculum architecture for Azure Databricks Data Engineers. Comprehensive execution specs, metastore governance, distributed streaming pipelines, and live mock exams.
            </p>
            <div class="status-tag">
              <span class="status-indicator"></span>
              <span class="status-msg">SYSTEM OPERATIONAL &middot; REVISION 2026.4</span>
            </div>
          </div>

          <div class="footer-col">
            <h4>Architecture</h4>
            <ul>
              <li><a href="/DP-750/01-setup-and-configure/">01 // Setup & Runtime</a></li>
              <li><a href="/DP-750/02-secure-and-govern/">02 // Unity Security</a></li>
              <li><a href="/DP-750/03-prepare-and-process/">03 // Medallion Ingestion</a></li>
              <li><a href="/DP-750/04-deploy-and-maintain/">04 // Lakeflow Orchestration</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>Execution</h4>
            <ul>
              <li><a href="/DP-750/labs/">Hands-on Labs (12 Labs)</a></li>
              <li><a href="/DP-750/question-bank/">181-Q Simulator</a></li>
              <li><a href="https://github.com/Balasubramanian-pg/DP-750" target="_blank" rel="noopener">GitHub Repository</a></li>
              <li><a href="https://learn.microsoft.com/en-us/credentials/certifications/azure-data-engineer/" target="_blank" rel="noopener">Official Microsoft Scope</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>Compliance & Legal</h4>
            <ul>
              <li><a href="/DP-750/privacy-policy">Privacy Protocol</a></li>
              <li><a href="/DP-750/cookie-policy">Client Storage Notice</a></li>
              <li><a href="https://github.com/Balasubramanian-pg/DP-750/blob/main/LICENSE" target="_blank" rel="noopener">Open Source License</a></li>
              <li><a href="https://github.com/Balasubramanian-pg/DP-750/issues" target="_blank" rel="noopener">Submit Errata</a></li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <span>&copy; 2026 Balasubramanian-pg. Zero telemetry collected. All rights reserved.</span>
          <span class="mono-label">LATENCY: 0MS LOCAL SSR</span>
        </div>
      </footer>
    </template>
  </Layout>
</template>

<style scoped>
.brand-glyph {
  color: var(--vp-c-brand-1);
}
.footer-logo {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-family: var(--vp-font-family-mono);
  font-weight: 700;
  letter-spacing: 0.05em;
  font-size: 0.95rem;
  color: var(--vp-c-text-1);
}
.brand-desc {
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin: 0.9rem 0 1.2rem;
  font-size: 0.85rem;
  max-width: 360px;
}
.status-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.75rem;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  font-family: var(--vp-font-family-mono);
  font-size: 0.7rem;
  color: var(--vp-c-text-2);
}
.status-indicator {
  width: 6px;
  height: 6px;
  background: #10B981;
}
</style>
