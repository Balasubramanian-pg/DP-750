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
              <img src="/databricks.svg" width="22" height="22" alt="Databricks Logo" class="brand-logo-img" />
              <span class="brand-text">DP-750 Study Portal</span>
            </div>
            <p class="brand-desc">
              Structured preparation portal for the Microsoft DP-750 Azure Databricks Data Engineer certification. Includes deep architectural modules, hands-on enterprise labs, and an interactive 181-question practice simulator.
            </p>
            <div class="author-tag">
              <span>Maintained by <a href="https://www.linkedin.com/in/balasubramanianpg2022/?isSelfProfile=true" target="_blank" rel="noopener">Balasubramanian PG</a></span>
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
              <li><a href="https://github.com/Balasubramanian-pg/DP-750" target="_blank" rel="noopener">GitHub Repository</a></li>
              <li><a href="https://www.linkedin.com/in/balasubramanianpg2022/?isSelfProfile=true" target="_blank" rel="noopener">Connect on LinkedIn</a></li>
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
  color: #0078d4;
  text-decoration: underline;
  font-weight: 500;
}
</style>
