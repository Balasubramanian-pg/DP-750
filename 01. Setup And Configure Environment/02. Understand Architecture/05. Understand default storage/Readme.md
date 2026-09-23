# Understand default storage

When you deploy Azure Databricks workspaces, you typically need to configure cloud storage accounts, set up access credentials, and manage storage permissions. Default storage in Azure Databricks simplifies this process by providing ready-to-use, fully managed storage that's automatically available in serverless workspaces.

## What is default storage?

Default storage is a fully managed object storage platform integrated directly into Azure Databricks. It eliminates the need for manual configuration of external cloud storage accounts or the management of access credentials, providing immediate storage capabilities for both classic and serverless workspaces.

### Core Functions

*   **Operational Data:** Regardless of workspace type, default storage houses the operational data required for internal Azure Databricks features, including:
    *   Data Classification
    *   Anomaly Detection
    *   Clean Rooms
    *   Knowledge Assistant
*   **Serverless Workspace Foundation:** In serverless environments, default storage serves as the primary repository for:
    *   Workspace system data (logs, query results, etc.).
    *   The automatically provisioned **default catalog**.

### Flexibility in Serverless Workspaces

While the default catalog in a serverless workspace relies on default storage, you are not limited to it. You can create additional catalogs that utilize either:

1.  **Default Storage:** For quick setup and minimal infrastructure management.
2.  **External Cloud Object Storage:** For scenarios requiring specific data residency, integration with existing data lakes, or advanced governance via external locations.

> [!NOTE]
> Default storage simplifies the initial experience by removing infrastructure overhead. However, as your data estate grows, you may choose to transition to external storage configurations to align with broader organizational data lake strategies.

## Where is default storage available?
The ability to create and manage catalogs within default storage is tied specifically to the **serverless** architecture. While classic workspaces can interact with this data, they cannot host it directly.

### Workspace Compatibility

*   **Serverless Workspaces:** Fully support the creation of new catalogs in default storage. This is the native environment for leveraging managed storage without external configuration.
*   **Classic Workspaces:** Can **access** catalogs stored in default storage, but only when executing queries or jobs using **serverless compute**. They cannot create or manage these catalogs using classic compute resources.

### Primary Uses in Serverless Workspaces

In a serverless environment, default storage serves three critical functions:

1.  **Internal Operations:** Hosts workspace system data required for platform features like observability and logging.
2.  **Workspace Artifacts:** Stores user-generated files, such as notebooks, libraries, and other small assets managed through the UI.
3.  **Managed Data Assets:** Acts as the physical storage location for managed tables and volumes within catalogs you create.

> [!NOTE]
> This architecture allows for cross-workspace data sharing. A classic workspace can query data residing in a serverless workspace's default storage catalog, provided it utilizes serverless compute for the execution. This ensures that while the storage is managed by the platform, the data remains accessible across different deployment models.

## Default storage benefits and considerations

Default storage offers a streamlined path for specific use cases but is not a universal replacement for external cloud storage. Understanding its strengths and limitations ensures you select the right storage model for your workload.

### Key Trade-offs

| Aspect | Benefit | Consideration |
| :--- | :--- | :--- |
| **Setup & Management** | Zero configuration required; no need to provision storage accounts or manage credentials. | Limited control over physical data placement, lifecycle policies, and network boundaries. |
| **Workload Compatibility** | Ideal for new serverless workloads, development environments, and platform features (e.g., Clean Rooms, Knowledge Assistant). | Not suitable for production workloads requiring external system access or classic compute. |
| **Cost & Performance** | Optimized for serverless execution with automatic scaling and integrated caching. | May incur higher costs for large-scale, persistent datasets compared to tiered external storage options. |
| **Governance** | Simplified governance through Unity Catalog without external location setup. | Data resides in platform-managed infrastructure, which may not meet strict residency or compliance requirements. |

### When to Use Each Model

-   **Choose Default Storage When:** You are building new serverless applications, running ad-hoc analysis, developing prototypes, or using Azure Databricks features that explicitly require it. The priority is speed-to-insight over infrastructure control.
-   **Choose External Storage When:** Your workload is production-grade, requires integration with existing data lakes, must be accessed by non-Databricks systems, relies on classic compute, or has specific regulatory or network isolation mandates.

> [!IMPORTANT]
> Default storage and external storage are not mutually exclusive. Many organizations adopt a hybrid approach: using default storage for agile development and serverless analytics while reserving external storage for governed, enterprise-scale data assets. This balances operational simplicity with long-term architectural flexibility.

## Navigation

- Previous: [04. Understand external storage](04.%20Understand%20external%20storage.md)
- Next: [06. Knowledge check](06.%20Knowledge%20check.md)

## Source

Microsoft Learn: [Understand default storage](https://learn.microsoft.com/en-us/training/modules/understand-azure-databricks-architecture/5-understand-default-storage)
