# Understand Unity Catalog managed storage

Your organization likely has data governance policies that require specific types of data to reside in designated cloud storage locations. For example, you might need production data in one storage account and development data in another, or you might need to isolate sensitive customer data from operational data. Unity Catalog managed storage helps you meet these requirements while maintaining centralized governance and access control.

## Managed Storage in Unity Catalog

Managed storage refers to the cloud storage locations where Unity Catalog physically stores data and metadata files for **managed tables** and **managed volumes**. When you create a managed asset, Unity Catalog assumes full responsibility for its lifecycle, including storage location, organization, and eventual deletion.

### Core Concepts

*   **Managed Tables:** Store structured data in a tabular format (always Delta Lake).
*   **Managed Volumes:** Provide governance for non-tabular, unstructured data such as images, audio files, logs, or documents that do not fit into a traditional table schema.

### Managed vs. External Assets

The primary distinction lies in who manages the underlying data lifecycle:

| Feature | Managed Storage | External Storage |
| :--- | :--- | :--- |
| **Lifecycle Management** | Handled entirely by Unity Catalog. | Managed by you in your cloud storage account. |
| **Governance Scope** | Unity Catalog controls both access and physical storage. | Unity Catalog governs access only; storage remains external. |
| **Cleanup** | Automatic deletion of underlying files after dropping the asset. | You must manually clean up files in cloud storage. |

### Operational Benefits

*   **Simplified Management:** You specify a cloud storage path, and Unity Catalog handles file layouts, partitioning, and cleanup operations.
*   **Automated Deletion:** When you drop a managed table or volume, Unity Catalog automatically marks the underlying data files for deletion after an eight-day grace period, ensuring no orphaned data remains.
*   **Physical Data Isolation:** Data is stored in separate cloud storage containers or paths, providing a clear boundary between different datasets.
*   **Compliance Alignment:** You can map specific catalogs and schemas to storage locations that meet your organization’s regulatory or security policies, ensuring data residency and isolation requirements are met.

> [!NOTE]
> Managed storage is ideal for teams that want to minimize operational overhead. By letting Unity Catalog handle the "where" and "how" of storage, data engineers and scientists can focus on analysis and model building rather than infrastructure maintenance.

## Managed Storage and the Unity Catalog Hierarchy

Unity Catalog organizes data using a three-level namespace: **Catalog**, **Schema**, and **Table/Object**. Managed storage locations can be defined at three corresponding levels within this hierarchy, each offering a different scope of data organization and isolation.

### 1. Metastore Level (Default Fallback)
At the highest level, you can optionally define a default storage location for the entire metastore.
*   **Function:** Serves as a fallback for any catalog or schema that does not have its own specific storage location defined.
*   **Recommendation:** New workspaces enabled for Unity Catalog do not automatically include metastore-level storage. Databricks recommends using **catalog-level storage** instead to ensure better data isolation and governance from the start.

### 2. Catalog Level (Recommended)
Defining storage at the catalog level is the preferred approach for most organizations.
*   **Alignment:** Catalogs typically represent major organizational units, development lifecycle stages (e.g., Dev, Prod), or data classification categories.
*   **Isolation:** By assigning a unique storage container to each catalog, you create clear physical boundaries for data governance and access control.
    *   *Example:* A `production` catalog might store data in a highly secure, locked-down container, while a `development` catalog uses a more flexible storage account.

### 3. Schema Level (Granular Control)
For scenarios requiring even finer isolation, storage locations can be defined at the schema level.
*   **Specificity:** Schemas organize data into logical categories within a catalog, such as individual projects, specific use cases, or team sandboxes.
*   **Use Case:** Assigning managed storage at this level allows you to isolate sensitive datasets or project-specific data within a broader catalog structure.

> [!NOTE]
> **Hierarchy of Precedence**
> When determining where to store data for a managed table or volume, Unity Catalog follows this order of precedence:
> 1.  **Schema-level** storage (if defined).
> 2.  **Catalog-level** storage (if defined).
> 3.  **Metastore-level** storage (if defined as a default).
>
> This flexibility allows you to balance broad organizational standards with project-specific security requirements.

## Storage Location Resolution

When you create a managed table or volume, Unity Catalog determines the physical storage destination by following a specific resolution hierarchy. This process evaluates storage locations from the most specific scope (schema) to the most general (metastore).

### Resolution Hierarchy

1.  **Schema Level (Most Specific)**
    Unity Catalog first checks if the containing schema has a defined managed storage location. If one exists, the data is stored there. This provides the highest level of granularity for data isolation.

2.  **Catalog Level (Recommended Default)**
    If no schema-level location is defined, Unity Catalog checks the containing catalog. If a catalog-level location exists, the data is stored there. This is the most common scenario and is recommended for most organizations to balance governance with operational simplicity.

3.  **Metastore Level (Fallback)**
    If neither the schema nor the catalog has a defined location, Unity Catalog falls back to the metastore-level storage location.

> [!IMPORTANT]
> **Configuration Requirement**
> If no storage location is defined at the schema, catalog, or metastore level, you will be unable to create managed tables or volumes. You must configure a managed storage location at one of these levels before proceeding.

### Strategic Flexibility

This hierarchical approach allows you to tailor data organization to your needs:
*   **Start Broad:** Use catalog-level storage for most use cases to maintain consistent governance across major business units or environments.
*   **Refine as Needed:** Add schema-level storage only when specific projects or teams require distinct physical isolation or specialized security controls.

## Storage Root vs. Storage Location

When defining managed storage for catalogs or schemas, it is important to distinguish between the **storage root** you specify and the actual **storage location** where data resides. Unity Catalog automates the path structure to ensure uniqueness and prevent conflicts.

### Automatic Path Management

Unity Catalog does not store data directly in the root path you provide. Instead, it appends hashed subdirectories to create a unique location for each asset.

*   **For Catalogs:** The system appends `__unitystorage/catalogs/<uuid>`
*   **For Schemas:** The system appends `__unitystorage/schemas/<uuid>`

The final **storage location** is the combination of your specified root and these automatically generated subdirectories.

> [!NOTE]
> This automation allows multiple catalogs or schemas to share the same base storage root without risk of conflict. Unity Catalog handles the organization internally, ensuring that each asset has a distinct physical path while maintaining the governance boundaries you define.

### Overlap Prevention Rules

To maintain the integrity of your data governance model, Unity Catalog enforces strict validation rules during configuration:

1.  **Validation Check:** When you create a catalog or schema with a managed storage location, Unity Catalog scans for potential overlaps.
2.  **Conflict Detection:** It checks against existing managed storage locations, external tables, and external volumes.
3.  **Rejection of Invalid Paths:** If a proposed storage path overlaps with an existing asset, the operation is rejected.

This ensures clear, non-overlapping boundaries between different data assets, preventing accidental data corruption or unauthorized access across governance domains.

## Navigation

- Previous: [02. Understand Azure Databricks architecture](02.%20Understand%20Azure%20Databricks%20architecture.md)
- Next: [04. Understand external storage](04.%20Understand%20external%20storage.md)

## Source

Microsoft Learn: [Understand Unity Catalog managed storage](https://learn.microsoft.com/en-us/training/modules/understand-azure-databricks-architecture/3-understand-unity-catalog-managed-storage)
