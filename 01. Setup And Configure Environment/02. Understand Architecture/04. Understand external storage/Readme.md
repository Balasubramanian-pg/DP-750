# Understand external storage

As a data engineer, you need to connect Azure Databricks to data stored in cloud storage locations like Azure Data Lake Storage containers. You might have production data in one storage account and development data in another, or you might need to work with data that's managed by teams outside of Databricks. External locations in Unity Catalog allow you to securely connect cloud storage to your workspaces while maintaining governance and access control.

## External Locations

External locations are Unity Catalog objects that establish secure, governed connections to cloud storage. They act as a bridge between your data assets and the underlying storage infrastructure, allowing you to manage access without exposing raw credentials in every query or job.

### Core Components

An external location combines two essential elements:

1.  **Cloud Storage Path:** The specific URL or container path where your data resides (e.g., an Azure Data Lake Storage container).
2.  **Storage Credential:** The authentication mechanism that authorizes access to that path. This typically references an Azure managed identity or service principal configured in your tenant.

### The Power of Separation

By decoupling credentials from paths, Unity Catalog offers significant operational flexibility:

*   **Reusability:** A single storage credential can be referenced by multiple external locations, provided they all operate within the same security boundary.
*   **Centralized Management:** You define and rotate credentials once in Unity Catalog rather than managing them across individual workspaces or notebooks.

### Supported Storage Types

While external locations can reference various cloud storage systems, their capabilities vary by platform:

| Storage Type | Access Level | Notes |
| :--- | :--- | :--- |
| **Azure Data Lake Storage** | Read/Write | Native integration with Unity Catalog; recommended for most Azure Databricks workloads. |
| **AWS S3** | Read-Only | Useful for cross-cloud analytics or ingesting data from AWS environments. |
| **Cloudflare R2** | Read-Only | Supports interoperability with S3-compatible storage endpoints. |

> [!NOTE]
> For Azure-centric organizations, **Azure Data Lake Storage (ADLS)** is the preferred choice. It provides seamless integration with Unity Catalog’s governance features and supports both reading existing data and writing new managed assets directly from Databricks.

## The Role of External Locations

External locations serve two distinct but critical functions within Unity Catalog: they enable governance over data stored outside the platform, and they define the physical storage destinations for data managed by Unity Catalog.

### 1. Governing External Data Assets
External locations allow you to register and govern data that resides in cloud storage but is managed independently of Unity Catalog.

*   **External Tables and Volumes:** When you create an external table, you are essentially creating a metadata reference to existing data files. The files remain in their original location, under your direct control.
*   **Use Cases:** This approach is ideal for:
    *   Large volumes of legacy data that should not be moved.
    *   Data that must be accessed simultaneously by other systems or platforms.
    *   Scenarios where your organization requires full control over the data lifecycle (creation, modification, deletion) outside of Databricks.

### 2. Defining Managed Storage Destinations
Even when Unity Catalog manages the data lifecycle, the physical files must reside in cloud storage that you own. External locations provide the bridge between governance and infrastructure.

*   **Managed Storage Configuration:** You use an external location to specify the base path (e.g., an ADLS container) where Unity Catalog should store data for a specific catalog or schema.
*   **Physical Control:** This allows you to dictate exactly where your data physically resides—ensuring compliance with residency or security policies—while delegating the operational tasks of file management, partitioning, and cleanup to Unity Catalog.

### Key Distinction: Who Manages the Data?

| Feature | External Tables/Volumes | Managed Storage (via External Location) |
| :--- | :--- | :--- |
| **Data Lifecycle** | **You manage it.** You are responsible for file creation, updates, and deletion in cloud storage. | **Unity Catalog manages it.** It handles file organization, versioning, and automatic cleanup. |
| **Governance** | Unity Catalog governs **access** to the data. | Unity Catalog governs both **access** and the **lifecycle** of the data. |
| **Storage Path** | Points to any valid path in your cloud storage. | Points to a path defined by an external location, where Unity Catalog creates unique subdirectories. |

> [!NOTE]
> Think of an **external location** as a secure "gateway" definition. Whether you are looking outward at existing data or inward at new managed assets, the external location ensures that Unity Catalog has the necessary permissions and path information to interact with your cloud storage securely.

## Storage Credentials

Storage credentials are Unity Catalog securable objects that encapsulate the authentication mechanisms required to access cloud storage. They serve as the foundation for secure data connectivity, allowing you to centralize credential management rather than embedding secrets directly into notebooks or queries.

### Authentication Mechanisms

Azure Databricks supports two primary methods for authenticating with cloud storage, though one is strongly preferred for modern deployments:

| Mechanism | Description | Management Overhead |
| :--- | :--- | :--- |
| **Azure Managed Identities** (Recommended) | An Azure resource that provides an automatic identity for applications connecting to Microsoft Entra ID-supported resources. | **Low:** Azure handles the lifecycle. No passwords or secrets to rotate. Supports storage accounts protected by network firewalls. |
| **Service Principals** (Legacy) | An application identity created in Microsoft Entra ID that uses client secrets for authentication. | **High:** Requires manual creation and periodic rotation of client secrets. |

> [!IMPORTANT]
> **Why Managed Identities?**
> Managed identities are the standard for Azure Databricks because they eliminate the security risks associated with secret management. They also enable seamless integration with network-restricted storage accounts, which is often a requirement for enterprise-grade security.

### Scope and Access

*   **Metastore-Level Objects:** Storage credentials are defined at the metastore level, making them available to all workspaces attached to that metastore.
*   **Privilege-Based Usage:** Only users with specific privileges can use these credentials to create external locations, ensuring that storage connectivity remains under strict governance.

> [!NOTE]
> A detailed walkthrough of creating and configuring external storage, including the setup of managed identities and external locations, will be covered in a subsequent module.

## Workspace Binding for External Locations

By default, an external location is accessible from all workspaces attached to your metastore. While this simplifies initial setup, it may not align with strict security boundaries or data governance policies. **Workspace binding** provides a mechanism to restrict access to specific workspaces, adding a layer of infrastructure-level control beyond standard user permissions.

### How Binding Works

*   **Restricted Access:** When an external location is bound to specific workspaces, users can only access that location from the assigned environments. This restriction applies regardless of their Unity Catalog privileges.
*   **Independent Configuration:** Binding applies separately to both **external locations** and **storage credentials**.
    *   **External Location Binding:** Controls which workspaces can read from or write to a specific storage path.
    *   **Storage Credential Binding:** Controls which workspaces can use a specific authentication identity to create or access external locations.

### Strategic Use Cases

Workspace binding is essential for organizations that maintain distinct environments or have stringent compliance requirements:

| Scenario | Implementation | Benefit |
| :--- | :--- | :--- |
| **Environment Isolation** | Bind production storage locations exclusively to production workspaces. | Prevents accidental data modification or exposure from development or testing environments. |
| **Credential Governance** | Bind high-privilege storage credentials to specific workspaces. | Ensures that sensitive authentication identities are only used where strictly necessary. |
| **Compliance Mandates** | Restrict access to regulated data to workspaces with specific network or security configurations. | Ensures data residency and access controls are enforced at the infrastructure level. |

> [!NOTE]
> Even if a user has full `SELECT` or `MODIFY` privileges on a table within Unity Catalog, workspace binding will block their access if they are working from a non-bound workspace. This makes it a powerful tool for enforcing "least privilege" principles across your data estate.

## Navigation

- Previous: [03. Understand Unity Catalog managed storage](03.%20Understand%20Unity%20Catalog%20managed%20storage.md)
- Next: [05. Understand default storage](05.%20Understand%20default%20storage.md)

## Source

Microsoft Learn: [Understand external storage](https://learn.microsoft.com/en-us/training/modules/understand-azure-databricks-architecture/4-understand-external-storage)
