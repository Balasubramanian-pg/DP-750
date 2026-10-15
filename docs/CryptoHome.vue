<template>
  <div class="wide-landing">
    <!-- Hero Section -->
    <section class="hero-block">
      <div class="badge-pill">
        <span class="badge-dot"></span>
        <span class="badge-text">AZURE DATABRICKS DATA ENGINEERING &middot; EXAM PREPARATION PORTAL</span>
      </div>
      
      <h1 class="main-headline">
        Master Azure Databricks for the DP-750 Certification.
      </h1>

      <p class="lead-subhead">
        A structured, production-grade guide covering compute architecture, Unity Catalog governance, streaming ingestion, Lakeflow orchestration, plus 12 hands-on labs and an interactive 181-question exam simulator.
      </p>

      <div class="cta-strip">
        <a href="/DP-750/01-setup-and-configure/" class="btn-terminal primary">
          <span>Start Curriculum</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
        <a href="/DP-750/question-bank/" class="btn-terminal secondary">
          <span>181-Question Simulator</span>
        </a>
        <a href="/DP-750/labs/" class="btn-terminal ghost">
          <span>12 Hands-on Labs</span>
        </a>
      </div>

      <!-- Live Telemetry Matrix (Now in Avenir Next, clean and proportional) -->
      <div class="telemetry-bar">
        <div class="telemetry-item">
          <span class="t-key">EXAM CODE</span>
          <span class="t-val">DP-750</span>
        </div>
        <div class="telemetry-item">
          <span class="t-key">TARGET RUNTIME</span>
          <span class="t-val">Spark 3.5+ &middot; Unity Catalog</span>
        </div>
        <div class="telemetry-item">
          <span class="t-key">QUESTION BANK</span>
          <span class="t-val">181 Real Scenarios</span>
        </div>
        <div class="telemetry-item">
          <span class="t-key">PRACTICE LABS</span>
          <span class="t-val">12 Hands-on Guides</span>
        </div>
      </div>
    </section>

    <!-- Technical Modules Section -->
    <section class="content-section">
      <div class="section-badge">
        <span class="section-kicker">CURRICULUM BREAKDOWN</span>
        <h2>Structured modules aligned with the official exam syllabus</h2>
      </div>

      <div class="track-list">
        <a href="/DP-750/01-setup-and-configure/" class="track-row">
          <div class="track-id">Module 1</div>
          <div class="track-details">
            <h3>Workspace Setup and Runtime Architecture</h3>
            <p>Compute cluster sizing, single-user vs shared access modes, Photon acceleration engine, and private network connectivity.</p>
          </div>
          <div class="track-action">
            <span>Explore 5 Lessons &rarr;</span>
          </div>
        </a>

        <a href="/DP-750/02-secure-and-govern/" class="track-row">
          <div class="track-id">Module 2</div>
          <div class="track-details">
            <h3>Unity Catalog Security and Metastore Governance</h3>
            <p>Three-level namespaces, row-level filters, column masking, system audit tables, and automated data lineage tracking.</p>
          </div>
          <div class="track-action">
            <span>Explore 2 Topics &rarr;</span>
          </div>
        </a>

        <a href="/DP-750/03-prepare-and-process/" class="track-row">
          <div class="track-id">Module 3</div>
          <div class="track-details">
            <h3>Medallion Architecture and Streaming Data Ingestion</h3>
            <p>Auto Loader directory streaming, Change Data Capture (CDC) with APPLY CHANGES INTO, and data quality constraints.</p>
          </div>
          <div class="track-action">
            <span>Explore 4 Lessons &rarr;</span>
          </div>
        </a>

        <a href="/DP-750/04-deploy-and-maintain/" class="track-row">
          <div class="track-id">Module 4</div>
          <div class="track-details">
            <h3>Lakeflow Jobs, Asset Bundles, and CI/CD Operations</h3>
            <p>Multi-task workflow DAGs, Databricks Asset Bundles (DABs), Spark UI skew optimization, and Azure Monitor integration.</p>
          </div>
          <div class="track-action">
            <span>Explore 4 Lessons &rarr;</span>
          </div>
        </a>
      </div>
    </section>

    <!-- Hands-on Lab Walkthroughs (Full Width Layout) -->
    <section class="content-section lab-split">
      <div class="split-left">
        <div class="section-badge">
          <span class="section-kicker">HANDS-ON PRACTICE</span>
          <h2>12 Production Labs replicated from real-world scenarios</h2>
        </div>
        <p class="split-copy">
          Gain practical muscle memory before exam day. Each lab contains step-by-step instructions, complete SQL and PySpark code blocks, validation queries, and clean-up scripts to practice directly in your own Azure Databricks workspace.
        </p>
        <a href="/DP-750/labs/" class="btn-terminal primary inline-btn">
          <span>View All 12 Labs</span>
        </a>
      </div>

      <div class="split-right">
        <div class="terminal-table">
          <div class="t-row t-head">
            <span>Lab</span>
            <span>Objective</span>
            <span>Est. Time</span>
          </div>
          <a href="/DP-750/labs/explore-azure-databricks" class="t-row">
            <span class="lab-pill">Lab 01</span>
            <span>Workspace exploration and compute cluster configuration</span>
            <span class="time-pill">15 mins</span>
          </a>
          <a href="/DP-750/labs/create-and-organize-objects-in-unity-catalog" class="t-row">
            <span class="lab-pill">Lab 03</span>
            <span>Creating catalogs, schemas, volumes, and managed tables</span>
            <span class="time-pill">25 mins</span>
          </a>
          <a href="/DP-750/labs/secure-unity-catalog-objects" class="t-row">
            <span class="lab-pill">Lab 04</span>
            <span>Implementing row-level filters and column masking</span>
            <span class="time-pill">30 mins</span>
          </a>
          <a href="/DP-750/labs/ingest-data-into-unity-catalog" class="t-row">
            <span class="lab-pill">Lab 07</span>
            <span>Auto Loader ingestion and file notification processing</span>
            <span class="time-pill">35 mins</span>
          </a>
          <a href="/DP-750/labs/implement-lakeflow-jobs" class="t-row">
            <span class="lab-pill">Lab 11</span>
            <span>Multi-task workflow scheduling with retry policies</span>
            <span class="time-pill">30 mins</span>
          </a>
        </div>
      </div>
    </section>

    <!-- Question Simulator Callout -->
    <section class="simulator-callout">
      <div class="sim-inner">
        <span class="section-kicker">EXAM PREPARATION RIG</span>
        <h2>181 scenario-based practice questions with detailed explanations</h2>
        <p>
          Simulate real exam conditions. Test your knowledge across all four modules with instant answer validation, keyword search, and filters for unanswered or missed questions.
        </p>
        <div class="sim-actions">
          <a href="/DP-750/question-bank/" class="btn-terminal primary">
            <span>Launch 181-Question Simulator</span>
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Full Wide Layout: Max Width 1400px across all displays */
.wide-landing {
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem 2.5rem 5rem;
}

@media (max-width: 768px) {
  .wide-landing {
    padding: 1.5rem 1.25rem 4rem;
  }
}

/* Hero Section */
.hero-block {
  padding: 3rem 0 3.5rem;
  border-bottom: 1px solid var(--vp-c-border);
}

.badge-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.45rem 0.9rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  margin-bottom: 1.5rem;
  font-family: var(--vp-font-family-base) !important;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--vp-c-text-2);
}

.badge-dot {
  width: 7px;
  height: 7px;
  background: #FF3621;
}

.main-headline {
  font-family: var(--vp-font-family-headings) !important;
  font-size: 3.4rem;
  line-height: 1.12;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--vp-c-text-1);
  max-width: 1000px;
  margin: 0 0 1.3rem;
}

@media (max-width: 768px) {
  .main-headline {
    font-size: 2.3rem;
  }
}

.lead-subhead {
  font-family: var(--vp-font-family-base) !important;
  font-size: 1.2rem;
  line-height: 1.65;
  color: var(--vp-c-text-2);
  max-width: 820px;
  margin: 0 0 2.2rem;
}

.cta-strip {
  display: flex;
  gap: 0.9rem;
  flex-wrap: wrap;
  margin-bottom: 3.2rem;
}

.btn-terminal {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.8rem 1.5rem;
  font-family: var(--vp-font-family-base) !important;
  font-size: 0.88rem;
  font-weight: 600;
  text-decoration: none;
  border: 1px solid transparent;
  transition: all 0.15s ease;
}

.btn-terminal.primary {
  background: #FF3621;
  color: #FFFFFF;
  border-color: #FF3621;
}

.btn-terminal.primary:hover {
  background: #E02C19;
  border-color: #E02C19;
}

.btn-terminal.secondary {
  background: var(--vp-c-bg-elv);
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-border);
}

.btn-terminal.secondary:hover {
  border-color: var(--vp-c-text-1);
}

.btn-terminal.ghost {
  background: transparent;
  color: var(--vp-c-text-2);
  border-color: var(--vp-c-border);
}

.btn-terminal.ghost:hover {
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-text-1);
}

/* Telemetry Bar using Avenir Next with natural layout */
.telemetry-bar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-elv);
}

@media (max-width: 768px) {
  .telemetry-bar {
    grid-template-columns: repeat(2, 1fr);
  }
}

.telemetry-item {
  padding: 1.1rem 1.4rem;
  border-right: 1px solid var(--vp-c-border);
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.telemetry-item:last-child {
  border-right: none;
}

.t-key {
  font-family: var(--vp-font-family-base) !important;
  font-size: 0.74rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: var(--vp-c-text-3);
}

.t-val {
  font-family: var(--vp-font-family-base) !important;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

/* Sections */
.content-section {
  padding: 4.5rem 0;
  border-bottom: 1px solid var(--vp-c-border);
}

.section-badge {
  margin-bottom: 2.2rem;
}

.section-kicker {
  font-family: var(--vp-font-family-base) !important;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: #0078d4;
  display: block;
  margin-bottom: 0.5rem;
}

.section-badge h2 {
  font-family: var(--vp-font-family-headings) !important;
  font-size: 2rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  letter-spacing: -0.02em;
  margin: 0;
}

/* Modules List (Wide) */
.track-list {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--vp-c-border);
}

.track-row {
  display: grid;
  grid-template-columns: 120px 1fr auto;
  align-items: center;
  gap: 2.5rem;
  padding: 1.6rem 2rem;
  border-bottom: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-elv);
  text-decoration: none;
  transition: background 0.15s ease;
}

.track-row:last-child {
  border-bottom: none;
}

.track-row:hover {
  background: var(--vp-c-bg-soft);
}

.track-id {
  font-family: var(--vp-font-family-headings) !important;
  font-size: 0.95rem;
  font-weight: 700;
  color: #0078d4;
}

.track-details h3 {
  font-family: var(--vp-font-family-headings) !important;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 0.35rem;
}

.track-details p {
  font-family: var(--vp-font-family-base) !important;
  font-size: 0.94rem;
  color: var(--vp-c-text-2);
  margin: 0;
  line-height: 1.5;
}

.track-action {
  font-family: var(--vp-font-family-base) !important;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--vp-c-text-3);
  white-space: nowrap;
}

.track-row:hover .track-action {
  color: #0078d4;
}

@media (max-width: 768px) {
  .track-row {
    grid-template-columns: 1fr;
    gap: 0.85rem;
  }
}

/* Lab Split Layout (Wide) */
.lab-split {
  display: grid;
  grid-template-columns: 1fr 1.35fr;
  gap: 3.5rem;
  align-items: center;
}

@media (max-width: 900px) {
  .lab-split {
    grid-template-columns: 1fr;
  }
}

.split-copy {
  font-family: var(--vp-font-family-base) !important;
  color: var(--vp-c-text-2);
  line-height: 1.65;
  font-size: 1rem;
  margin-bottom: 1.8rem;
}

.inline-btn {
  display: inline-flex;
}

.terminal-table {
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-elv);
}

.t-row {
  display: grid;
  grid-template-columns: 90px 1fr 100px;
  gap: 1.2rem;
  padding: 1rem 1.3rem;
  border-bottom: 1px solid var(--vp-c-border);
  font-size: 0.9rem;
  text-decoration: none;
  color: var(--vp-c-text-2);
  align-items: center;
}

.t-row:last-child {
  border-bottom: none;
}

.t-row:not(.t-head):hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.t-head {
  font-family: var(--vp-font-family-base) !important;
  font-size: 0.76rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--vp-c-text-3);
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-border);
}

.lab-pill {
  font-family: var(--vp-font-family-headings) !important;
  font-size: 0.85rem;
  font-weight: 600;
  color: #0078d4;
}

.time-pill {
  font-family: var(--vp-font-family-base) !important;
  font-size: 0.82rem;
  color: var(--vp-c-text-3);
}

/* Simulator Callout */
.simulator-callout {
  padding-top: 4.5rem;
}

.sim-inner {
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-elv);
  padding: 3rem;
}

.sim-inner h2 {
  font-family: var(--vp-font-family-headings) !important;
  font-size: 2rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0.5rem 0 0.85rem;
}

.sim-inner p {
  font-family: var(--vp-font-family-base) !important;
  color: var(--vp-c-text-2);
  max-width: 750px;
  line-height: 1.65;
  font-size: 1.05rem;
  margin: 0 0 2rem;
}
</style>
