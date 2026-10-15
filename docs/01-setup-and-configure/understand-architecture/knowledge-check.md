## Check your knowledge
Which component in Azure Databricks handles job scheduling and cluster management?
The compute plane
The control plane
The workspace storage account
What is the relationship between storage credentials and external locations in Unity Catalog?
Each external location requires a unique storage credential
Storage credentials provide authentication while external locations specify the cloud storage path
External locations and storage credentials are the same Unity Catalog object
How does Unity Catalog determine where to store data for a managed table when no schema-level storage location is defined?
It creates a new storage account in your Azure subscription
It checks the catalog-level storage location, then falls back to the metastore-level location
It stores the data in the workspace storage account
Which statement about default storage in Azure Databricks is accurate?
Classic compute clusters can access catalogs stored in default storage
Default storage is used only in serverless workspaces and is unavailable in classic workspaces
Default storage is fully managed by Azure Databricks and requires no external storage configuration
What happens to the underlying data files when a managed table in Unity Catalog is dropped?
The data files are immediately deleted from cloud storage
The data files are marked for deletion after eight days
The data files remain in cloud storage and must be manually deleted
You must answer all questions before checking your work.
You must answer all questions before checking your work.

## Navigation

- Previous: [05. Understand default storage](05.%20Understand%20default%20storage.md)
- Next: [07. Summary](07.%20Summary.md)

## Source

Microsoft Learn: [Knowledge check](https://learn.microsoft.com/en-us/training/modules/understand-azure-databricks-architecture/6-knowledge-check)
