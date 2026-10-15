import { defineConfig } from 'vitepress'

const sidebar = {
  "/01-setup-and-configure/": [
    {
      "text": "Module 1: Setup & Configure Environment",
      "items": [
        {
          "text": "Overview",
          "link": "/01-setup-and-configure/"
        },
        {
          "text": "Explore Azure Databricks",
          "collapsed": true,
          "items": [
            {
              "text": "00. Module Overview",
              "link": "/01-setup-and-configure/explore-azure-databricks/module-overview"
            },
            {
              "text": "01. Introduction",
              "link": "/01-setup-and-configure/explore-azure-databricks/introduction"
            },
            {
              "text": "02. Get started",
              "link": "/01-setup-and-configure/explore-azure-databricks/get-started"
            },
            {
              "text": "03. Workloads",
              "link": "/01-setup-and-configure/explore-azure-databricks/workloads"
            },
            {
              "text": "04. Understand key concepts",
              "link": "/01-setup-and-configure/explore-azure-databricks/understand-key-concepts"
            },
            {
              "text": "05. Data governance",
              "link": "/01-setup-and-configure/explore-azure-databricks/data-governance"
            },
            {
              "text": "06. Exercise",
              "link": "/01-setup-and-configure/explore-azure-databricks/exercise"
            },
            {
              "text": "07. Knowledge check",
              "link": "/01-setup-and-configure/explore-azure-databricks/knowledge-check"
            },
            {
              "text": "08. Summary",
              "link": "/01-setup-and-configure/explore-azure-databricks/summary"
            }
          ]
        },
        {
          "text": "Understand Architecture",
          "collapsed": true,
          "items": [
            {
              "text": "00. Module Overview",
              "link": "/01-setup-and-configure/understand-architecture/module-overview"
            },
            {
              "text": "01. Introduction",
              "link": "/01-setup-and-configure/understand-architecture/introduction"
            },
            {
              "text": "02. Understand Azure Databricks architecture",
              "link": "/01-setup-and-configure/understand-architecture/understand-azure-databricks-architecture"
            },
            {
              "text": "03. Understand Unity Catalog managed storage",
              "link": "/01-setup-and-configure/understand-architecture/understand-unity-catalog-managed-storage"
            },
            {
              "text": "04. Understand external storage",
              "link": "/01-setup-and-configure/understand-architecture/understand-external-storage"
            },
            {
              "text": "05. Understand default storage",
              "link": "/01-setup-and-configure/understand-architecture/understand-default-storage"
            },
            {
              "text": "06. Knowledge check",
              "link": "/01-setup-and-configure/understand-architecture/knowledge-check"
            },
            {
              "text": "07. Summary",
              "link": "/01-setup-and-configure/understand-architecture/summary"
            }
          ]
        },
        {
          "text": "Understand Azure Databricks Integrations",
          "collapsed": true,
          "items": [
            {
              "text": "00. Module Overview",
              "link": "/01-setup-and-configure/understand-azure-databricks-integrations/module-overview"
            },
            {
              "text": "01. Introduction",
              "link": "/01-setup-and-configure/understand-azure-databricks-integrations/introduction"
            },
            {
              "text": "02. Integration with Microsoft Fabric",
              "link": "/01-setup-and-configure/understand-azure-databricks-integrations/integration-with-microsoft-fabric"
            },
            {
              "text": "03. Integration with Power BI",
              "link": "/01-setup-and-configure/understand-azure-databricks-integrations/integration-with-power-bi"
            },
            {
              "text": "04. Integration with VS Code",
              "link": "/01-setup-and-configure/understand-azure-databricks-integrations/integration-with-vs-code"
            },
            {
              "text": "05. Integration with Power Platform",
              "link": "/01-setup-and-configure/understand-azure-databricks-integrations/integration-with-power-platform"
            },
            {
              "text": "06. Integration with Copilot Studio",
              "link": "/01-setup-and-configure/understand-azure-databricks-integrations/integration-with-copilot-studio"
            },
            {
              "text": "07. Integration with Microsoft Purview",
              "link": "/01-setup-and-configure/understand-azure-databricks-integrations/integration-with-microsoft-purview"
            },
            {
              "text": "08. Integration with Microsoft Foundry",
              "link": "/01-setup-and-configure/understand-azure-databricks-integrations/integration-with-microsoft-foundry"
            },
            {
              "text": "09. Knowledge check",
              "link": "/01-setup-and-configure/understand-azure-databricks-integrations/knowledge-check"
            },
            {
              "text": "10. Summary",
              "link": "/01-setup-and-configure/understand-azure-databricks-integrations/summary"
            }
          ]
        },
        {
          "text": "Select and Configure Compute in Azure Databricks",
          "collapsed": true,
          "items": [
            {
              "text": "00. Module Overview",
              "link": "/01-setup-and-configure/select-and-configure-compute-in-azure-databricks/module-overview"
            },
            {
              "text": "01. Introduction",
              "link": "/01-setup-and-configure/select-and-configure-compute-in-azure-databricks/introduction"
            },
            {
              "text": "02. Choose appropriate compute type",
              "link": "/01-setup-and-configure/select-and-configure-compute-in-azure-databricks/choose-appropriate-compute-type"
            },
            {
              "text": "03. Configure compute performance",
              "link": "/01-setup-and-configure/select-and-configure-compute-in-azure-databricks/configure-compute-performance"
            },
            {
              "text": "04. Configure compute feature settings",
              "link": "/01-setup-and-configure/select-and-configure-compute-in-azure-databricks/configure-compute-feature-settings"
            },
            {
              "text": "05. Install libraries for compute",
              "link": "/01-setup-and-configure/select-and-configure-compute-in-azure-databricks/install-libraries-for-compute"
            },
            {
              "text": "06. Configure compute access permissions",
              "link": "/01-setup-and-configure/select-and-configure-compute-in-azure-databricks/configure-compute-access-permissions"
            },
            {
              "text": "07. Exercise",
              "link": "/01-setup-and-configure/select-and-configure-compute-in-azure-databricks/exercise"
            },
            {
              "text": "08. Knowledge check",
              "link": "/01-setup-and-configure/select-and-configure-compute-in-azure-databricks/knowledge-check"
            },
            {
              "text": "09. Summary",
              "link": "/01-setup-and-configure/select-and-configure-compute-in-azure-databricks/summary"
            }
          ]
        },
        {
          "text": "Create and organize objects in Unity Catalog",
          "collapsed": true,
          "items": [
            {
              "text": "00. Module Overview",
              "link": "/01-setup-and-configure/create-and-organize-objects-in-unity-catalog/module-overview"
            },
            {
              "text": "01. Introduction",
              "link": "/01-setup-and-configure/create-and-organize-objects-in-unity-catalog/introduction"
            },
            {
              "text": "02. Apply naming conventions",
              "link": "/01-setup-and-configure/create-and-organize-objects-in-unity-catalog/apply-naming-conventions"
            },
            {
              "text": "03. Create a catalog",
              "link": "/01-setup-and-configure/create-and-organize-objects-in-unity-catalog/create-a-catalog"
            },
            {
              "text": "04. Create a schema",
              "link": "/01-setup-and-configure/create-and-organize-objects-in-unity-catalog/create-a-schema"
            },
            {
              "text": "05. Create tables views and materialized views",
              "link": "/01-setup-and-configure/create-and-organize-objects-in-unity-catalog/create-tables-views-and-materialized-views"
            },
            {
              "text": "06. Create volumes",
              "link": "/01-setup-and-configure/create-and-organize-objects-in-unity-catalog/create-volumes"
            },
            {
              "text": "07. Implement DDL operations",
              "link": "/01-setup-and-configure/create-and-organize-objects-in-unity-catalog/implement-ddl-operations"
            },
            {
              "text": "08. Implement a foreign catalog",
              "link": "/01-setup-and-configure/create-and-organize-objects-in-unity-catalog/implement-a-foreign-catalog"
            },
            {
              "text": "09. Configure AI-BI Genie instructions",
              "link": "/01-setup-and-configure/create-and-organize-objects-in-unity-catalog/configure-ai-bi-genie-instructions"
            },
            {
              "text": "10. Exercise",
              "link": "/01-setup-and-configure/create-and-organize-objects-in-unity-catalog/exercise"
            },
            {
              "text": "11. Knowledge check",
              "link": "/01-setup-and-configure/create-and-organize-objects-in-unity-catalog/knowledge-check"
            },
            {
              "text": "12. Summary",
              "link": "/01-setup-and-configure/create-and-organize-objects-in-unity-catalog/summary"
            }
          ]
        }
      ]
    }
  ],
  "/02-secure-and-govern/": [
    {
      "text": "Module 2: Secure & Govern Unity Catalog",
      "items": [
        {
          "text": "Overview",
          "link": "/02-secure-and-govern/"
        },
        {
          "text": "Secure Unity Catalog Objects",
          "collapsed": true,
          "items": [
            {
              "text": "00. Module Overview",
              "link": "/02-secure-and-govern/secure-unity-catalog-objects/module-overview"
            },
            {
              "text": "01. Introduction",
              "link": "/02-secure-and-govern/secure-unity-catalog-objects/introduction"
            },
            {
              "text": "02. Understand the query lifecycle",
              "link": "/02-secure-and-govern/secure-unity-catalog-objects/understand-the-query-lifecycle"
            },
            {
              "text": "03. Implement access control strategies",
              "link": "/02-secure-and-govern/secure-unity-catalog-objects/implement-access-control-strategies"
            },
            {
              "text": "04. Understand fine-grained access control",
              "link": "/02-secure-and-govern/secure-unity-catalog-objects/understand-fine-grained-access-control"
            },
            {
              "text": "05. Implement row filtering and column masking",
              "link": "/02-secure-and-govern/secure-unity-catalog-objects/implement-row-filtering-and-column-masking"
            },
            {
              "text": "06. Access Azure Key Vault secrets",
              "link": "/02-secure-and-govern/secure-unity-catalog-objects/access-azure-key-vault-secrets"
            },
            {
              "text": "07. Authenticate data access with service principals",
              "link": "/02-secure-and-govern/secure-unity-catalog-objects/authenticate-data-access-with-service-principals"
            },
            {
              "text": "08. Authenticate resource access with managed identities",
              "link": "/02-secure-and-govern/secure-unity-catalog-objects/authenticate-resource-access-with-managed-identities"
            },
            {
              "text": "09. Exercise",
              "link": "/02-secure-and-govern/secure-unity-catalog-objects/exercise"
            },
            {
              "text": "10. Knowledge check",
              "link": "/02-secure-and-govern/secure-unity-catalog-objects/knowledge-check"
            },
            {
              "text": "11. Summary",
              "link": "/02-secure-and-govern/secure-unity-catalog-objects/summary"
            }
          ]
        },
        {
          "text": "Govern Unity Catalog objects",
          "collapsed": true,
          "items": [
            {
              "text": "00. Module Overview",
              "link": "/02-secure-and-govern/govern-unity-catalog-objects/module-overview"
            },
            {
              "text": "01. Introduction",
              "link": "/02-secure-and-govern/govern-unity-catalog-objects/introduction"
            },
            {
              "text": "02. Preserve table and column definitions",
              "link": "/02-secure-and-govern/govern-unity-catalog-objects/preserve-table-and-column-definitions"
            },
            {
              "text": "03. Configure ABAC tags and policies",
              "link": "/02-secure-and-govern/govern-unity-catalog-objects/configure-abac-tags-and-policies"
            },
            {
              "text": "04. Apply data retention policies",
              "link": "/02-secure-and-govern/govern-unity-catalog-objects/apply-data-retention-policies"
            },
            {
              "text": "05. Manage data lineage tracking",
              "link": "/02-secure-and-govern/govern-unity-catalog-objects/manage-data-lineage-tracking"
            },
            {
              "text": "06. Configure audit logging",
              "link": "/02-secure-and-govern/govern-unity-catalog-objects/configure-audit-logging"
            },
            {
              "text": "07. Design a secure Delta Sharing strategy",
              "link": "/02-secure-and-govern/govern-unity-catalog-objects/design-a-secure-delta-sharing-strategy"
            },
            {
              "text": "08. Exercise",
              "link": "/02-secure-and-govern/govern-unity-catalog-objects/exercise"
            },
            {
              "text": "09. Knowledge check",
              "link": "/02-secure-and-govern/govern-unity-catalog-objects/knowledge-check"
            },
            {
              "text": "10. Summary",
              "link": "/02-secure-and-govern/govern-unity-catalog-objects/summary"
            }
          ]
        }
      ]
    }
  ],
  "/03-prepare-and-process/": [
    {
      "text": "Module 3: Prepare & Process Data",
      "items": [
        {
          "text": "Overview",
          "link": "/03-prepare-and-process/"
        },
        {
          "text": "Design Data Modeling",
          "collapsed": true,
          "items": [
            {
              "text": "00. Module Overview",
              "link": "/03-prepare-and-process/design-data-modeling/module-overview"
            },
            {
              "text": "01. Introduction",
              "link": "/03-prepare-and-process/design-data-modeling/introduction"
            },
            {
              "text": "02. Design data ingestion logic",
              "link": "/03-prepare-and-process/design-data-modeling/design-data-ingestion-logic"
            },
            {
              "text": "03. Choose data ingestion tool",
              "link": "/03-prepare-and-process/design-data-modeling/choose-data-ingestion-tool"
            },
            {
              "text": "04. Choose data table format",
              "link": "/03-prepare-and-process/design-data-modeling/choose-data-table-format"
            },
            {
              "text": "05. Design data partitioning scheme",
              "link": "/03-prepare-and-process/design-data-modeling/design-data-partitioning-scheme"
            },
            {
              "text": "06. Choose SCD type",
              "link": "/03-prepare-and-process/design-data-modeling/choose-scd-type"
            },
            {
              "text": "07. Implement SCD Type 2",
              "link": "/03-prepare-and-process/design-data-modeling/implement-scd-type-2"
            },
            {
              "text": "08. Design temporal history table",
              "link": "/03-prepare-and-process/design-data-modeling/design-temporal-history-table"
            },
            {
              "text": "09. Choose granularity",
              "link": "/03-prepare-and-process/design-data-modeling/choose-granularity"
            },
            {
              "text": "10. Choose managed vs unmanaged tables",
              "link": "/03-prepare-and-process/design-data-modeling/choose-managed-vs-unmanaged-tables"
            },
            {
              "text": "11. Design clustering strategy",
              "link": "/03-prepare-and-process/design-data-modeling/design-clustering-strategy"
            },
            {
              "text": "12. Exercise",
              "link": "/03-prepare-and-process/design-data-modeling/exercise"
            },
            {
              "text": "13. Knowledge check",
              "link": "/03-prepare-and-process/design-data-modeling/knowledge-check"
            },
            {
              "text": "14. Summary",
              "link": "/03-prepare-and-process/design-data-modeling/summary"
            },
            {
              "text": "Readme",
              "link": "/03-prepare-and-process/design-data-modeling/"
            }
          ]
        },
        {
          "text": "Ingest data into Unity Catalog",
          "collapsed": true,
          "items": [
            {
              "text": "00. Module Overview",
              "link": "/03-prepare-and-process/ingest-data-into-unity-catalog/module-overview"
            },
            {
              "text": "01. Introduction",
              "link": "/03-prepare-and-process/ingest-data-into-unity-catalog/introduction"
            },
            {
              "text": "02. Ingest data with Lakeflow Connect",
              "link": "/03-prepare-and-process/ingest-data-into-unity-catalog/ingest-data-with-lakeflow-connect"
            },
            {
              "text": "03. Ingest data with notebooks",
              "link": "/03-prepare-and-process/ingest-data-into-unity-catalog/ingest-data-with-notebooks"
            },
            {
              "text": "04. Ingest data with SQL methods",
              "link": "/03-prepare-and-process/ingest-data-into-unity-catalog/ingest-data-with-sql-methods"
            },
            {
              "text": "05. Ingest data from CDC feed",
              "link": "/03-prepare-and-process/ingest-data-into-unity-catalog/ingest-data-from-cdc-feed"
            },
            {
              "text": "06. Ingest data with Spark Structured Streaming",
              "link": "/03-prepare-and-process/ingest-data-into-unity-catalog/ingest-data-with-spark-structured-streaming"
            },
            {
              "text": "07. Ingest data with Auto Loader",
              "link": "/03-prepare-and-process/ingest-data-into-unity-catalog/ingest-data-with-auto-loader"
            },
            {
              "text": "08. Ingest data with Lakeflow Declarative Pipelines",
              "link": "/03-prepare-and-process/ingest-data-into-unity-catalog/ingest-data-with-lakeflow-declarative-pipelines"
            },
            {
              "text": "09. Exercise",
              "link": "/03-prepare-and-process/ingest-data-into-unity-catalog/exercise"
            },
            {
              "text": "10. Knowledge check",
              "link": "/03-prepare-and-process/ingest-data-into-unity-catalog/knowledge-check"
            },
            {
              "text": "11. Summary",
              "link": "/03-prepare-and-process/ingest-data-into-unity-catalog/summary"
            },
            {
              "text": "Readme",
              "link": "/03-prepare-and-process/ingest-data-into-unity-catalog/"
            }
          ]
        },
        {
          "text": "Cleanse, transform, and load data into Unity Catalog",
          "collapsed": true,
          "items": [
            {
              "text": "00. Module Overview",
              "link": "/03-prepare-and-process/cleanse-transform-and-load-data-into-unity-catalog/module-overview"
            },
            {
              "text": "01. Introduction",
              "link": "/03-prepare-and-process/cleanse-transform-and-load-data-into-unity-catalog/introduction"
            },
            {
              "text": "02. Profile data with summary statistics",
              "link": "/03-prepare-and-process/cleanse-transform-and-load-data-into-unity-catalog/profile-data-with-summary-statistics"
            },
            {
              "text": "03. Choose appropriate column data types",
              "link": "/03-prepare-and-process/cleanse-transform-and-load-data-into-unity-catalog/choose-appropriate-column-data-types"
            },
            {
              "text": "04. Resolve duplicate missing and null values",
              "link": "/03-prepare-and-process/cleanse-transform-and-load-data-into-unity-catalog/resolve-duplicate-missing-and-null-values"
            },
            {
              "text": "05. Transform data with filtering grouping and aggregation",
              "link": "/03-prepare-and-process/cleanse-transform-and-load-data-into-unity-catalog/transform-data-with-filtering-grouping-and-aggregation"
            },
            {
              "text": "06. Transform data with joins and set operators",
              "link": "/03-prepare-and-process/cleanse-transform-and-load-data-into-unity-catalog/transform-data-with-joins-and-set-operators"
            },
            {
              "text": "07. Transform data with denormalization pivot and unpivot",
              "link": "/03-prepare-and-process/cleanse-transform-and-load-data-into-unity-catalog/transform-data-with-denormalization-pivot-and-unpivot"
            },
            {
              "text": "08. Load data with merge insert and append",
              "link": "/03-prepare-and-process/cleanse-transform-and-load-data-into-unity-catalog/load-data-with-merge-insert-and-append"
            },
            {
              "text": "09. Exercise",
              "link": "/03-prepare-and-process/cleanse-transform-and-load-data-into-unity-catalog/exercise"
            },
            {
              "text": "10. Knowledge check",
              "link": "/03-prepare-and-process/cleanse-transform-and-load-data-into-unity-catalog/knowledge-check"
            },
            {
              "text": "11. Summary",
              "link": "/03-prepare-and-process/cleanse-transform-and-load-data-into-unity-catalog/summary"
            },
            {
              "text": "Readme",
              "link": "/03-prepare-and-process/cleanse-transform-and-load-data-into-unity-catalog/"
            }
          ]
        },
        {
          "text": "Implement and manage data quality constraints with Azure Databricks",
          "collapsed": true,
          "items": [
            {
              "text": "00. Module Overview",
              "link": "/03-prepare-and-process/implement-and-manage-data-quality-constraints-with-azure-databricks/module-overview"
            },
            {
              "text": "01. Introduction",
              "link": "/03-prepare-and-process/implement-and-manage-data-quality-constraints-with-azure-databricks/introduction"
            },
            {
              "text": "02. Implement validation checks",
              "link": "/03-prepare-and-process/implement-and-manage-data-quality-constraints-with-azure-databricks/implement-validation-checks"
            },
            {
              "text": "03. Implement data type checks",
              "link": "/03-prepare-and-process/implement-and-manage-data-quality-constraints-with-azure-databricks/implement-data-type-checks"
            },
            {
              "text": "04. Detect and manage schema drift",
              "link": "/03-prepare-and-process/implement-and-manage-data-quality-constraints-with-azure-databricks/detect-and-manage-schema-drift"
            },
            {
              "text": "05. Manage data quality with pipeline expectations",
              "link": "/03-prepare-and-process/implement-and-manage-data-quality-constraints-with-azure-databricks/manage-data-quality-with-pipeline-expectations"
            },
            {
              "text": "06. Exercise",
              "link": "/03-prepare-and-process/implement-and-manage-data-quality-constraints-with-azure-databricks/exercise"
            },
            {
              "text": "07. Knowledge check",
              "link": "/03-prepare-and-process/implement-and-manage-data-quality-constraints-with-azure-databricks/knowledge-check"
            },
            {
              "text": "08. Summary",
              "link": "/03-prepare-and-process/implement-and-manage-data-quality-constraints-with-azure-databricks/summary"
            },
            {
              "text": "Readme",
              "link": "/03-prepare-and-process/implement-and-manage-data-quality-constraints-with-azure-databricks/"
            }
          ]
        }
      ]
    }
  ],
  "/04-deploy-and-maintain/": [
    {
      "text": "Module 4: Deploy & Maintain Pipelines",
      "items": [
        {
          "text": "Overview",
          "link": "/04-deploy-and-maintain/"
        },
        {
          "text": "Design Implement Pipelines",
          "collapsed": true,
          "items": [
            {
              "text": "00. Module Overview",
              "link": "/04-deploy-and-maintain/design-implement-pipelines/module-overview"
            },
            {
              "text": "01. Introduction",
              "link": "/04-deploy-and-maintain/design-implement-pipelines/introduction"
            },
            {
              "text": "02. Design order of operations for a pipeline",
              "link": "/04-deploy-and-maintain/design-implement-pipelines/design-order-of-operations-for-a-pipeline"
            },
            {
              "text": "03. Choose notebook vs Lakeflow Pipelines",
              "link": "/04-deploy-and-maintain/design-implement-pipelines/choose-notebook-vs-lakeflow-pipelines"
            },
            {
              "text": "04. Design task logic for Lakeflow Jobs",
              "link": "/04-deploy-and-maintain/design-implement-pipelines/design-task-logic-for-lakeflow-jobs"
            },
            {
              "text": "05. Design error handling for pipelines",
              "link": "/04-deploy-and-maintain/design-implement-pipelines/design-error-handling-for-pipelines"
            },
            {
              "text": "06. Create a pipeline with notebook precedence",
              "link": "/04-deploy-and-maintain/design-implement-pipelines/create-a-pipeline-with-notebook-precedence"
            },
            {
              "text": "07. Create a pipeline with Lakeflow Declarative Pipelines",
              "link": "/04-deploy-and-maintain/design-implement-pipelines/create-a-pipeline-with-lakeflow-declarative-pipelines"
            },
            {
              "text": "08. Exercise",
              "link": "/04-deploy-and-maintain/design-implement-pipelines/exercise"
            },
            {
              "text": "09. Knowledge check",
              "link": "/04-deploy-and-maintain/design-implement-pipelines/knowledge-check"
            },
            {
              "text": "10. Summary",
              "link": "/04-deploy-and-maintain/design-implement-pipelines/summary"
            },
            {
              "text": "Readme",
              "link": "/04-deploy-and-maintain/design-implement-pipelines/"
            }
          ]
        },
        {
          "text": "Implement Lakeflow Jobs with Azure Databricks",
          "collapsed": true,
          "items": [
            {
              "text": "00. Module Overview",
              "link": "/04-deploy-and-maintain/implement-lakeflow-jobs-with-azure-databricks/module-overview"
            },
            {
              "text": "01. Introduction",
              "link": "/04-deploy-and-maintain/implement-lakeflow-jobs-with-azure-databricks/introduction"
            },
            {
              "text": "02. Create a Lakeflow Job",
              "link": "/04-deploy-and-maintain/implement-lakeflow-jobs-with-azure-databricks/create-a-lakeflow-job"
            },
            {
              "text": "03. Configure job triggers",
              "link": "/04-deploy-and-maintain/implement-lakeflow-jobs-with-azure-databricks/configure-job-triggers"
            },
            {
              "text": "04. Schedule a job",
              "link": "/04-deploy-and-maintain/implement-lakeflow-jobs-with-azure-databricks/schedule-a-job"
            },
            {
              "text": "05. Configure job alerts",
              "link": "/04-deploy-and-maintain/implement-lakeflow-jobs-with-azure-databricks/configure-job-alerts"
            },
            {
              "text": "06. Configure automatic restarts",
              "link": "/04-deploy-and-maintain/implement-lakeflow-jobs-with-azure-databricks/configure-automatic-restarts"
            },
            {
              "text": "07. Exercise",
              "link": "/04-deploy-and-maintain/implement-lakeflow-jobs-with-azure-databricks/exercise"
            },
            {
              "text": "08. Knowledge check",
              "link": "/04-deploy-and-maintain/implement-lakeflow-jobs-with-azure-databricks/knowledge-check"
            },
            {
              "text": "09. Summary",
              "link": "/04-deploy-and-maintain/implement-lakeflow-jobs-with-azure-databricks/summary"
            },
            {
              "text": "Readme",
              "link": "/04-deploy-and-maintain/implement-lakeflow-jobs-with-azure-databricks/"
            }
          ]
        },
        {
          "text": "Implement development lifecycle processes in Azure Databricks",
          "collapsed": true,
          "items": [
            {
              "text": "00. Module Overview",
              "link": "/04-deploy-and-maintain/implement-development-lifecycle-processes-in-azure-databricks/module-overview"
            },
            {
              "text": "01. Introduction",
              "link": "/04-deploy-and-maintain/implement-development-lifecycle-processes-in-azure-databricks/introduction"
            },
            {
              "text": "02. Apply version control with Git",
              "link": "/04-deploy-and-maintain/implement-development-lifecycle-processes-in-azure-databricks/apply-version-control-with-git"
            },
            {
              "text": "03. Manage branching pull requests and conflicts",
              "link": "/04-deploy-and-maintain/implement-development-lifecycle-processes-in-azure-databricks/manage-branching-pull-requests-and-conflicts"
            },
            {
              "text": "04. Implement a testing strategy",
              "link": "/04-deploy-and-maintain/implement-development-lifecycle-processes-in-azure-databricks/implement-a-testing-strategy"
            },
            {
              "text": "05. Configure and package Databricks Asset Bundles",
              "link": "/04-deploy-and-maintain/implement-development-lifecycle-processes-in-azure-databricks/configure-and-package-databricks-asset-bundles"
            },
            {
              "text": "06. Deploy bundles with the Databricks CLI",
              "link": "/04-deploy-and-maintain/implement-development-lifecycle-processes-in-azure-databricks/deploy-bundles-with-the-databricks-cli"
            },
            {
              "text": "07. Exercise",
              "link": "/04-deploy-and-maintain/implement-development-lifecycle-processes-in-azure-databricks/exercise"
            },
            {
              "text": "08. Knowledge check",
              "link": "/04-deploy-and-maintain/implement-development-lifecycle-processes-in-azure-databricks/knowledge-check"
            },
            {
              "text": "09. Summary",
              "link": "/04-deploy-and-maintain/implement-development-lifecycle-processes-in-azure-databricks/summary"
            },
            {
              "text": "Readme",
              "link": "/04-deploy-and-maintain/implement-development-lifecycle-processes-in-azure-databricks/"
            }
          ]
        },
        {
          "text": "Monitor, troubleshoot and optimize workloads in Azure Databricks",
          "collapsed": true,
          "items": [
            {
              "text": "00. Module Overview",
              "link": "/04-deploy-and-maintain/monitor-troubleshoot-and-optimize-workloads-in-azure-databricks/module-overview"
            },
            {
              "text": "01. Introduction",
              "link": "/04-deploy-and-maintain/monitor-troubleshoot-and-optimize-workloads-in-azure-databricks/introduction"
            },
            {
              "text": "02. Monitor and manage cluster consumption",
              "link": "/04-deploy-and-maintain/monitor-troubleshoot-and-optimize-workloads-in-azure-databricks/monitor-and-manage-cluster-consumption"
            },
            {
              "text": "03. Troubleshoot and repair Lakeflow Jobs",
              "link": "/04-deploy-and-maintain/monitor-troubleshoot-and-optimize-workloads-in-azure-databricks/troubleshoot-and-repair-lakeflow-jobs"
            },
            {
              "text": "04. Troubleshoot and repair Spark jobs and notebooks",
              "link": "/04-deploy-and-maintain/monitor-troubleshoot-and-optimize-workloads-in-azure-databricks/troubleshoot-and-repair-spark-jobs-and-notebooks"
            },
            {
              "text": "05. Resolve caching skewing spilling and shuffle issues",
              "link": "/04-deploy-and-maintain/monitor-troubleshoot-and-optimize-workloads-in-azure-databricks/resolve-caching-skewing-spilling-and-shuffle-issues"
            },
            {
              "text": "06. Implement log streaming with Azure Log Analytics",
              "link": "/04-deploy-and-maintain/monitor-troubleshoot-and-optimize-workloads-in-azure-databricks/implement-log-streaming-with-azure-log-analytics"
            },
            {
              "text": "07. Exercise",
              "link": "/04-deploy-and-maintain/monitor-troubleshoot-and-optimize-workloads-in-azure-databricks/exercise"
            },
            {
              "text": "08. Knowledge check",
              "link": "/04-deploy-and-maintain/monitor-troubleshoot-and-optimize-workloads-in-azure-databricks/knowledge-check"
            },
            {
              "text": "09. Summary",
              "link": "/04-deploy-and-maintain/monitor-troubleshoot-and-optimize-workloads-in-azure-databricks/summary"
            },
            {
              "text": "Readme",
              "link": "/04-deploy-and-maintain/monitor-troubleshoot-and-optimize-workloads-in-azure-databricks/"
            }
          ]
        }
      ]
    }
  ],
  "/labs/": [
    {
      "text": "DP-750 Hands-on Labs",
      "items": [
        {
          "text": "00. Setup",
          "link": "/labs/setup"
        },
        {
          "text": "01. Explore Azure Databricks",
          "link": "/labs/explore-azure-databricks"
        },
        {
          "text": "02. Select and Configure Compute",
          "link": "/labs/select-and-configure-compute"
        },
        {
          "text": "03. Create and Organize Objects in Unity Catalog",
          "link": "/labs/create-and-organize-objects-in-unity-catalog"
        },
        {
          "text": "04. Secure Unity Catalog Objects",
          "link": "/labs/secure-unity-catalog-objects"
        },
        {
          "text": "05. Govern Unity Catalog Objects",
          "link": "/labs/govern-unity-catalog-objects"
        },
        {
          "text": "06. Design Implement Data Modeling Unity Catalog",
          "link": "/labs/design-implement-data-modeling-unity-catalog"
        },
        {
          "text": "07. Ingest Data into Unity Catalog",
          "link": "/labs/ingest-data-into-unity-catalog"
        },
        {
          "text": "08. Cleanse Transform Load Data into Unity Catalog",
          "link": "/labs/cleanse-transform-load-data-into-unity-catalog"
        },
        {
          "text": "10. Design Implement Data Pipelines",
          "link": "/labs/design-implement-data-pipelines"
        },
        {
          "text": "11. Implement Lakeflow Jobs",
          "link": "/labs/implement-lakeflow-jobs"
        },
        {
          "text": "99. Cleanup",
          "link": "/labs/cleanup"
        }
      ]
    }
  ],
  "/question-bank/": [
    {
      "text": "DP-750 Exam Practice",
      "items": [
        {
          "text": "Interactive Question Bank",
          "link": "/question-bank/"
        }
      ]
    }
  ]
}

export default defineConfig({
  title: 'DP-750 Azure Databricks',
  description: 'Comprehensive Study Guide, Interactive Quizzes, and Labs for Microsoft DP-750',
  base: '/DP-750/',
  ignoreDeadLinks: true,
  cleanUrls: true,
  themeConfig: {
    logo: {
      light: 'https://azure.microsoft.com/svghandler/databricks/?width=40&height=40',
      dark: 'https://azure.microsoft.com/svghandler/databricks/?width=40&height=40'
    },
    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'Modules',
        items: [
          { text: '1. Setup & Configure', link: '/01-setup-and-configure/' },
          { text: '2. Secure & Govern', link: '/02-secure-and-govern/' },
          { text: '3. Prepare & Process', link: '/03-prepare-and-process/' },
          { text: '4. Deploy & Maintain', link: '/04-deploy-and-maintain/' }
        ]
      },
      { text: 'Labs', link: '/labs/' },
      { text: 'Question Bank', link: '/question-bank/' }
    ],
    sidebar,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Balasubramanian-pg/DP-750' }
    ],
    search: {
      provider: 'local'
    },
    footer: {
      message: 'Released under open educational resources for Azure Databricks Data Engineers.',
      copyright: 'Copyright © 2026 Balasubramanian-pg | DP-750 Portal'
    }
  }
})
