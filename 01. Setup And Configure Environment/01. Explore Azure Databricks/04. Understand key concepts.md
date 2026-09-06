# Understand key concepts

Azure Databricks is a single service platform with multiple technologies that enable working with data at scale. When using Azure Databricks, there are some key concepts to understand.

## Workspaces

A workspace in Azure Databricks serves as a secure, collaborative hub for organizing and accessing all platform assets, including notebooks, clusters, jobs, libraries, dashboards, and experiments.

**Access and Management**
*   Launch directly from the **Azure portal** via the "Launch Workspace" button.
*   Manage resources through a web-based user interface (UI) or programmatically via **REST APIs**.

**Organization and Collaboration**
*   Structure assets into **folders** to organize projects, data pipelines, or team-specific resources.
*   Apply granular **permissions** at various levels to control access.
*   Enable cross-functional collaboration, allowing data engineers, analysts, and scientists to share notebooks, track experiments, and manage dependencies simultaneously.

> [!NOTE]
> **Governance and Infrastructure**
> *   **Unity Catalog:** When enabled, workspaces integrate with Unity Catalog for centralized data governance and secure, organization-wide data access.
> *   **Azure Resources:** Each workspace is linked to an underlying Azure resource group (including a managed resource group) that hosts the necessary compute, networking, and storage infrastructure.

## Notebooks

Databricks notebooks are interactive, web-based documents that unify runnable code, visualizations, and narrative text. They serve as the primary interface for exploratory data analysis, machine learning experiments, and the development of complex data pipelines.

**Core Capabilities**
*   **Multi-language Support:** Write in **Python, R, Scala, or SQL**, switching between languages within a single notebook using magic commands.
*   **Cell Types:**
    *   **Code Cells:** Contain executable logic for data processing and analysis.
    *   **Markdown Cells:** Render formatted text, graphics, and documentation.
*   **Execution Control:** Run individual cells, selected groups, or the entire notebook sequentially.

**Collaboration and Integration**
*   **Real-time Collaboration:** Multiple users can edit cells, add comments, and share insights simultaneously.
*   **Compute Integration:** Tightly coupled with Databricks clusters for efficient processing of large datasets.
*   **Governed Data Access:** Connects to external sources through **Unity Catalog** to ensure secure and compliant data usage.

> [!TIP]
> Notebooks are versatile enough for both ad-hoc exploration and production workflows. They can be **version-controlled**, **scheduled as jobs**, or **exported** for sharing outside the platform.

## Clusters

Azure Databricks operates on a two-layer architecture that separates management from execution:

*   **Control Plane:** An internal layer managed by Microsoft that handles backend services, identity, and workspace metadata.
*   **Compute Plane:** The external layer residing in your Azure subscription, responsible for processing data and running workloads.

**Cluster Architecture**
Clusters serve as the core computational engines for data engineering, science, and analytics. Each cluster comprises:
*   **Driver Node:** Coordinates task execution and manages the cluster state.
*   **Worker Nodes:** Handle distributed computations and data processing.

Clusters can be provisioned with fixed resources or configured to **auto-scale**, dynamically adding or removing worker nodes based on workload demand to optimize cost and performance.

### Compute Options

| Type | Description | Best For |
| :--- | :--- | :--- |
| **Serverless Compute** | Fully managed, on-demand compute with automatic scaling. | Fast startup times, minimal management overhead, and elastic workloads. |
| **Classic Compute** | User-provisioned clusters offering full control over VM sizes, libraries, and runtime versions. | Specialized workloads requiring deep customization or consistent, predictable performance. |
| **SQL Warehouses** | Compute resources optimized specifically for SQL-based analytics and BI queries. Available in both serverless and classic configurations. | High-performance dashboards, reporting, and ad-hoc SQL analysis. |

> [!NOTE]
> This flexible compute model allows you to tailor infrastructure to specific needs, ranging from exploratory analysis in notebooks to large-scale ETL pipelines and high-performance business intelligence reporting.

## Databricks Runtime

The Databricks Runtime is a customized distribution of Apache Spark, enhanced with performance optimizations and pre-installed libraries. It streamlines complex tasks such as machine learning, graph processing, and genomics while maintaining robust support for general data analytics.

**Versioning and Support**
Databricks offers multiple runtime versions, including Long-Term Support (LTS) releases. Each version specifies the underlying Apache Spark build, release date, and support timeline.

**Runtime Lifecycle**
As newer versions are released, older runtimes progress through the following stages:

| Stage | Status |
| :--- | :--- |
| **Legacy** | Available for use but no longer recommended for new workloads. |
| **Deprecated** | Marked for removal in an upcoming release. |
| **End of Support (EoS)** | No further security patches or bug fixes are provided. |
| **End of Life (EoL)** | Retired and no longer available for cluster creation. |

> [!TIP]
> To apply maintenance updates to your current runtime version, simply **restart your cluster**. This ensures you benefit from the latest stability and performance improvements without manually changing the runtime configuration.

## Lakeflow Jobs

Lakeflow Jobs provide workflow automation and orchestration within Azure Databricks, enabling the reliable scheduling and coordination of data processing tasks. By automating repetitive or production-grade workloads—such as ETL pipelines, machine learning training, or dashboard refreshes—jobs eliminate the need for manual code execution.

**Job Structure**
A job acts as a container for one or more **tasks**. Each task defines a specific unit of work, such as:
*   Running a notebook.
*   Executing a Spark job.
*   Calling external code or APIs.

**Trigger Mechanisms**
Jobs can be initiated through several methods to suit different operational needs:
*   **Scheduled:** Run at predefined intervals (e.g., daily at midnight).
*   **Event-driven:** Triggered in response to specific system or data events.
*   **Manual:** Executed on-demand when immediate processing is required.

> [!IMPORTANT]
> Jobs are essential for **production workloads**. They ensure data pipelines run consistently, ML models are trained and deployed in a controlled manner, and downstream systems receive accurate, up-to-date information.

## Delta Lake

Delta Lake is an open-source storage framework that enhances the reliability and scalability of data lakes by layering transactional capabilities over cloud object storage, such as Azure Data Lake Storage. It resolves common challenges in traditional data lakes, including inconsistent reads, partial writes, and concurrency conflicts.

**Core Capabilities**

*   **ACID Transactions:** Ensures atomicity, consistency, isolation, and durability for reliable data reads and writes.
*   **Scalable Metadata Handling:** Manages tables containing billions of files without performance degradation.
*   **Data Versioning & Time Travel:** Maintains a history of changes, allowing you to query previous states or roll back data if needed.
*   **Unified Batch and Streaming:** Supports both real-time ingestion and historical batch loads within the same table structure.

**Table Abstraction**
Delta tables provide a familiar interface for working with structured data via **SQL queries** or the **DataFrame API**. As the default table format in Azure Databricks, Delta ensures that all new data is stored with built-in transactional guarantees.

## Databricks SQL

Databricks SQL integrates data warehousing capabilities directly into the Databricks Lakehouse, enabling analysts and business users to query and visualize data stored in open formats. By supporting **ANSI SQL**, it allows teams to build reports and dashboards using familiar syntax without adopting new languages or tools.

**Key Features**
*   **SQL Editor:** A dedicated interface for writing, executing, and optimizing queries.
*   **Visualization & Dashboards:** Built-in tools for creating interactive charts and sharing insights.
*   **BI Integration:** Seamless connectivity with external business intelligence and analytics platforms.

> [!IMPORTANT]
> Databricks SQL is exclusively available on the **Premium tier**. Ensure your workspace is configured for Premium access before provisioning SQL warehouses or related resources.

## SQL Warehouses

SQL warehouses (formerly SQL endpoints) are scalable compute resources decoupled from storage that execute all Databricks SQL queries. Selecting the appropriate warehouse type is essential for balancing performance, cost, and infrastructure requirements.

### Warehouse Types

| Type | Key Characteristics | Best For |
| :--- | :--- | :--- |
| **Serverless** | Instant startup, elastic autoscaling, and fully managed capacity/patching. Eliminates idle resource costs. | Most workloads requiring low overhead and cost efficiency. |
| **Pro** | Supports Photon and Predictive IO. Lacks Intelligent Workload Management. | Environments requiring custom networking (federation, hybrid/on-prem) or where serverless is unavailable. |
| **Classic** | Runs in your Azure subscription. ~4 min startup; slower scaling. Supports only Photon. | Basic interactive exploration when Serverless or Pro are not viable options. |

> [!NOTE]
> **Classic SQL Warehouses** should be treated as a fallback option. They lack Predictive IO and Intelligent Workload Management, and their slower startup times make them unsuitable for production analytics or time-sensitive queries.

## MLflow

MLflow is an open-source platform that manages the end-to-end machine learning lifecycle. It enables data scientists and engineers to track experiments, package code for reproducibility, and streamline the transition of models from development to production.

**Core Capabilities**
*   **Experiment Tracking:** Records parameters, code versions, metrics, and output files for every run.
*   **Model Management:** Provides a central registry for storing, versioning, and managing model stages.
*   **Deployment:** Simplifies the process of serving models as REST APIs or integrating them into production pipelines.

> [!NOTE]
> MLflow has expanded beyond traditional machine learning to support **generative AI workflows**, offering specialized tools for evaluating and improving the performance of AI agents.

## Navigation

- Previous: [03. Workloads](03.%20Workloads.md)
- Next: [05. Data governance](05.%20Data%20governance.md)

## Source

Microsoft Learn: [Understand key concepts](https://learn.microsoft.com/en-us/training/modules/explore-azure-databricks/04-key-concepts)
