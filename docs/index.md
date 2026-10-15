---
layout: page
title: DP-750 Execution Protocol
---

<div class="crypto-landing">
  <!-- Hero Section -->
  <section class="hero-block">
    <div class="terminal-ticker">
      <span class="ticker-dot"></span>
      <span class="ticker-label">SPECIFICATION REVISION 2026.4 // AZURE DATABRICKS DATA ENGINEERING</span>
    </div>
    
    <h1 class="main-headline">
      Deterministic engineering for high-throughput lakehouses.
    </h1>

    <p class="lead-subhead">
      Cut through certification noise. Direct implementation specs, raw cluster architectures, Unity Catalog permission matrices, and a 181-question interactive exam simulator.
    </p>

    <div class="cta-strip">
      <a href="/DP-750/01-setup-and-configure/" class="btn-terminal primary">
        <span>INITIALIZE CURRICULUM</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </a>
      <a href="/DP-750/question-bank/" class="btn-terminal secondary">
        <span>ENTER 181-Q SIMULATOR</span>
      </a>
      <a href="/DP-750/labs/" class="btn-terminal ghost">
        <span>HANDS-ON LABS (12)</span>
      </a>
    </div>

    <!-- Live Telemetry Matrix -->
    <div class="telemetry-bar">
      <div class="telemetry-item">
        <span class="t-key">EXAM CODE</span>
        <span class="t-val">DP-750</span>
      </div>
      <div class="telemetry-item">
        <span class="t-key">TARGET STACK</span>
        <span class="t-val">SPARK 3.5+ // UNITY CATALOG</span>
      </div>
      <div class="telemetry-item">
        <span class="t-key">VERIFIED ITEMS</span>
        <span class="t-val">181 SCENARIOS</span>
      </div>
      <div class="telemetry-item">
        <span class="t-key">LAB REPRODUCIBILITY</span>
        <span class="t-val">100% DETERMINISTIC</span>
      </div>
    </div>
  </section>

  <!-- Technical Modules -->
  <section class="content-section">
    <div class="section-badge">
      <span class="badge-idx">01 // CORE TRACKS</span>
      <h2>Architectural syllabus broken down by functional domain.</h2>
    </div>

    <div class="track-list">
      <a href="/DP-750/01-setup-and-configure/" class="track-row">
        <div class="track-id">MOD 01</div>
        <div class="track-details">
          <h3>Workspace Provisioning & Runtime Topology</h3>
          <p>Compute sizing algorithms, single-user vs shared cluster access modes, photon acceleration, and private endpoint routing.</p>
        </div>
        <div class="track-action">
          <span>INSPECT 5 LESSONS &rarr;</span>
        </div>
      </a>

      <a href="/DP-750/02-secure-and-govern/" class="track-row">
        <div class="track-id">MOD 02</div>
        <div class="track-details">
          <h3>Unity Catalog Governance & Boundary Security</h3>
          <p>Metastore ownership hierarchy, column-level masking, dynamic row filters, system tables, and Lakehouse monitoring lineage.</p>
        </div>
        <div class="track-action">
          <span>INSPECT 2 MODULES &rarr;</span>
        </div>
      </a>

      <a href="/DP-750/03-prepare-and-process/" class="track-row">
        <div class="track-id">MOD 03</div>
        <div class="track-details">
          <h3>Streaming Ingestion & Medallion Transformation</h3>
          <p>Auto Loader directory schemas, Change Data Capture (CDC) with APPLY CHANGES INTO, and structural expectations with Delta Live Tables.</p>
        </div>
        <div class="track-action">
          <span>INSPECT 4 LESSONS &rarr;</span>
        </div>
      </a>

      <a href="/DP-750/04-deploy-and-maintain/" class="track-row">
        <div class="track-id">MOD 04</div>
        <div class="track-details">
          <h3>Asset Bundles, Lakeflow Jobs & Observability</h3>
          <p>Multi-task workflow DAGs, bundle compilation with the Databricks CLI, Spark UI skew analysis, and Azure Log Analytics streaming.</p>
        </div>
        <div class="track-action">
          <span>INSPECT 4 LESSONS &rarr;</span>
        </div>
      </a>
    </div>
  </section>

  <!-- Hands-on Lab Specs -->
  <section class="content-section lab-split">
    <div class="split-left">
      <div class="section-badge">
        <span class="badge-idx">02 // HANDS-ON RIG</span>
        <h2>12 Production Labs replicated from production workloads.</h2>
      </div>
      <p class="split-copy">
        No mock screenshots or hand-waving explanations. Every single exercise includes complete DDL declarations, PySpark notebooks, and tear-down scripts designed for quick reproduction inside any Azure Databricks workspace.
      </p>
      <a href="/DP-750/labs/" class="btn-terminal primary inline-btn">
        <span>ACCESS COMPLETE LAB SUITE</span>
      </a>
    </div>

    <div class="split-right">
      <div class="terminal-table">
        <div class="t-row t-head">
          <span>LAB</span>
          <span>OBJECTIVE</span>
          <span>RUNTIME</span>
        </div>
        <a href="/DP-750/labs/explore-azure-databricks" class="t-row">
          <span class="mono-code">LAB 01</span>
          <span>Workspace initialization & compute cluster sizing</span>
          <span class="mono-code">15 MIN</span>
        </a>
        <a href="/DP-750/labs/create-and-organize-objects-in-unity-catalog" class="t-row">
          <span class="mono-code">LAB 03</span>
          <span>Catalog, schema, managed volume, and table provisioning</span>
          <span class="mono-code">25 MIN</span>
        </a>
        <a href="/DP-750/labs/secure-unity-catalog-objects" class="t-row">
          <span class="mono-code">LAB 04</span>
          <span>Row filtering & column masking function deployment</span>
          <span class="mono-code">30 MIN</span>
        </a>
        <a href="/DP-750/labs/ingest-data-into-unity-catalog" class="t-row">
          <span class="mono-code">LAB 07</span>
          <span>Auto Loader file notification & stream validation</span>
          <span class="mono-code">35 MIN</span>
        </a>
        <a href="/DP-750/labs/implement-lakeflow-jobs" class="t-row">
          <span class="mono-code">LAB 11</span>
          <span>Multi-task workflow scheduling with retry policies</span>
          <span class="mono-code">30 MIN</span>
        </a>
      </div>
    </div>
  </section>

  <!-- Simulator Banner -->
  <section class="simulator-callout">
    <div class="sim-inner">
      <span class="mono-label alert-tag">EXAMINATION RIG</span>
      <h2>181 scenario-backed questions with catalyst rationale.</h2>
      <p>
        Filter questions by unattempted status or incorrect history. Search specific keywords like predicate pushdown, broadcast joins, or storage credentials to drill into your weak spots.
      </p>
      <div class="sim-actions">
        <a href="/DP-750/question-bank/" class="btn-terminal primary">
          <span>LAUNCH QUESTION SIMULATOR</span>
        </a>
      </div>
    </div>
  </section>
</div>

<style>
.crypto-landing {
  max-width: 1152px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem 5rem;
}

/* Hero Section */
.hero-block {
  padding: 3rem 0 4rem;
  border-bottom: 1px solid var(--vp-c-border);
}

.terminal-ticker {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.4rem 0.8rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  margin-bottom: 1.5rem;
}

.ticker-dot {
  width: 6px;
  height: 6px;
  background: var(--vp-c-brand-1);
}

.ticker-label {
  font-family: var(--vp-font-family-mono);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  color: var(--vp-c-text-2);
}

.main-headline {
  font-size: 3.2rem;
  line-height: 1.1;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--vp-c-text-1);
  max-width: 900px;
  margin: 0 0 1.25rem;
}

@media (max-width: 768px) {
  .main-headline {
    font-size: 2.2rem;
  }
}

.lead-subhead {
  font-size: 1.15rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  max-width: 720px;
  margin: 0 0 2.2rem;
}

.cta-strip {
  display: flex;
  gap: 0.85rem;
  flex-wrap: wrap;
  margin-bottom: 3rem;
}

.btn-terminal {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.4rem;
  font-family: var(--vp-font-family-mono);
  font-size: 0.8rem;
  letter-spacing: 0.06em;
  text-decoration: none;
  font-weight: 600;
  border: 1px solid transparent;
  transition: all 0.15s ease;
}

.btn-terminal.primary {
  background: var(--vp-c-text-1);
  color: var(--vp-c-bg);
  border-color: var(--vp-c-text-1);
}

.btn-terminal.primary:hover {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: #FFFFFF;
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

.telemetry-bar {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-elv);
}

.telemetry-item {
  padding: 1rem 1.25rem;
  border-right: 1px solid var(--vp-c-border);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.telemetry-item:last-child {
  border-right: none;
}

.t-key {
  font-family: var(--vp-font-family-mono);
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  color: var(--vp-c-text-3);
}

.t-val {
  font-family: var(--vp-font-family-mono);
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

/* Sections */
.content-section {
  padding: 4rem 0;
  border-bottom: 1px solid var(--vp-c-border);
}

.section-badge {
  margin-bottom: 2rem;
}

.badge-idx {
  font-family: var(--vp-font-family-mono);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  color: var(--vp-c-brand-1);
  display: block;
  margin-bottom: 0.5rem;
}

.section-badge h2 {
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  letter-spacing: -0.02em;
  margin: 0;
}

/* Tracks Rows */
.track-list {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--vp-c-border);
}

.track-row {
  display: grid;
  grid-template-columns: 100px 1fr auto;
  align-items: center;
  gap: 2rem;
  padding: 1.4rem 1.6rem;
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
  font-family: var(--vp-font-family-mono);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
}

.track-details h3 {
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 0.25rem;
}

.track-details p {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  margin: 0;
  line-height: 1.5;
}

.track-action {
  font-family: var(--vp-font-family-mono);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--vp-c-text-3);
  white-space: nowrap;
}

.track-row:hover .track-action {
  color: var(--vp-c-text-1);
}

@media (max-width: 768px) {
  .track-row {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
}

/* Split Section */
.lab-split {
  display: grid;
  grid-template-columns: 1fr 1.25fr;
  gap: 3rem;
  align-items: center;
}

@media (max-width: 768px) {
  .lab-split {
    grid-template-columns: 1fr;
  }
}

.split-copy {
  color: var(--vp-c-text-2);
  line-height: 1.6;
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
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
  grid-template-columns: 80px 1fr 90px;
  gap: 1rem;
  padding: 0.85rem 1.1rem;
  border-bottom: 1px solid var(--vp-c-border);
  font-size: 0.85rem;
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
  font-family: var(--vp-font-family-mono);
  font-size: 0.7rem;
  color: var(--vp-c-text-3);
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-border);
}

.mono-code {
  font-family: var(--vp-font-family-mono);
  font-size: 0.78rem;
  color: var(--vp-c-brand-1);
}

/* Simulator Callout */
.simulator-callout {
  padding-top: 4rem;
}

.sim-inner {
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-elv);
  padding: 2.5rem;
}

.alert-tag {
  color: var(--vp-c-brand-1);
  display: inline-block;
  margin-bottom: 0.75rem;
}

.sim-inner h2 {
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 0.8rem;
}

.sim-inner p {
  color: var(--vp-c-text-2);
  max-width: 650px;
  line-height: 1.6;
  font-size: 0.95rem;
  margin: 0 0 1.75rem;
}
</style>
