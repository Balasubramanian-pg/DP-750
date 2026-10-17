---
title: Privacy Policy
---

# Privacy Policy

**Last Updated:** October 2026

### 1. Architectural Privacy Principles
The DP-750 study hub is engineered as an immutable, static documentation and learning portal hosted via GitHub Pages. Our core architectural design tenet is total anonymity: **no user accounts, no logins, no tracking databases, and no personal data ingestion pipelines**.

### 2. Information Handled & Client-Side Local Storage
All stateful learning features operate 100% locally on your own client device within your browser's private `localStorage`. No telemetry, analytics, or study records are ever transmitted to any external server:

- **Lesson & Lab Progression (`dp750_completed_lessons`):** When you click "Mark as Complete" on curriculum topics or hands-on labs, the completion record is stored strictly in your browser's local storage. This state is used solely to calculate your dynamic dashboard performance curve, completion percentage, and exam readiness trajectory.
- **Pomodoro Study Timer (`dp750_pomodoro_stats`):** When you use the focus clock to time your study blocks (25m Focus, 50m Deep Work, or 5m Break), completed study sessions and elapsed focus minutes are stored locally so you can monitor your study consistency.
- **Practice Quizzes (`dp750_exam_answers`):** All interactions with the practice question bank occur in-memory and locally. Answer selections, flagged scenarios, and test score summaries are never transmitted to external analytics services.
- **Hosting Telemetry:** Connection requests (such as requesting IP address and User-Agent) are processed transiently by GitHub infrastructure to deliver static web assets under standard web protocols and DDoS mitigation policies.

### 3. External Links & Azure Services
Course documentation contains references to official Microsoft Learn and Databricks endpoints. When navigating to third-party domains, their respective privacy documentation applies.

### 4. Data Control & Reset
Because all your study records reside entirely within your browser's `localStorage`, you retain absolute control over your data. You can inspect, modify, or erase all stored progress at any time by clearing your browser cache or site data for this domain.

### 5. Open Source Governance
All content and study tooling in this repository are maintained as open resources for technical engineers preparing for enterprise cloud certification.

For questions or repository contributions, visit the [GitHub Repository](https://github.com/Balasubramanian-pg/DP-750).
