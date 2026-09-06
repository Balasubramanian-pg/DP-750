When you deploy Azure Databricks workspaces, you typically need to configure cloud storage accounts, set up access credentials, and manage storage permissions. Default storage in Azure Databricks simplifies this process by providing ready-to-use, fully managed storage that's automatically available in serverless workspaces.

## What is default storage?
Default storage is a fully managed object storage platform built into Azure Databricks. It provides immediate storage capabilities without requiring you to configure external cloud storage accounts or manage access credentials.
Default storage is used across both classic and serverless workspaces for internal Azure Databricks features. Capabilities such as Data Classification, Anomaly detection, Clean Rooms, and Knowledge Assistant all store their operational data in default storage regardless of workspace type.
In serverless workspaces, default storage also serves as the primary storage for workspace system data and for the catalogs you create. When you create a serverless workspace, Azure Databricks automatically provisions a default catalog that uses default storage. You can also create additional catalogs that use either default storage or your own cloud object storage, giving you flexibility in how you organize your data.

## Where is default storage available?
Creating new catalogs in default storage is available exclusively in serverless workspaces. Classic workspaces can access catalogs stored in default storage, but only when using serverless compute.
Serverless workspaces use default storage for three key areas. First, they use it for internal workspace operations and workspace system data. Second, they store workspace-level files and artifacts there. Third, catalogs you create can use default storage to store managed tables and volumes.
This means you can share data across workspace types while maintaining the requirement for serverless compute when accessing default storage catalogs.

## Default storage benefits and considerations
The following table summarizes the key benefits and considerations when using default storage:
Default storage works best for new serverless workloads, development environments, and features that specifically require it. For production workloads with external access requirements or those using classic compute, external storage provides more flexibility.

## Navigation

- Previous: [[04 - Understand external storage]]
- Next: [[06 - Knowledge check]]

## Source

Microsoft Learn: [Understand default storage](https://learn.microsoft.com/en-us/training/modules/understand-azure-databricks-architecture/5-understand-default-storage)
