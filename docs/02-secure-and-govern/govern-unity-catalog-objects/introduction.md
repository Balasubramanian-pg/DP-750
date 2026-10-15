# Introduction

Description: Introduction to governing Unity Catalog objects in Azure Databricks

Source: https://learn.microsoft.com/en-us/training/modules/govern-unity-catalog-objects/1-introduction

---

[Skip to main content](https://learn.microsoft.com/en-us/training/modules/govern-unity-catalog-objects/1-introduction#main)
This browser is no longer supported.
Upgrade to Microsoft Edge to take advantage of the latest features, security updates, and technical support.
[Download Microsoft Edge](https://go.microsoft.com/fwlink/p/?LinkID=2092881)
[More info about Internet Explorer and Microsoft Edge](https://learn.microsoft.com/en-us/lifecycle/faq/internet-explorer-microsoft-edge)
[Read in English](https://learn.microsoft.com/en-us/training/modules/govern-unity-catalog-objects/1-introduction)

- 2 minutes
Effective data governance requires more than just controlling access—it demands visibility into your data assets, accountability for how they're used, and enforcement mechanisms that scale with your organization. As data platforms grow in complexity, managing table definitions, tracking data lineage, enforcing retention policies, and sharing data securely become increasingly challenging. Unity Catalog in Azure Databricks provides the foundation for comprehensive governance that addresses these challenges through centralized metadata management and policy enforcement.
When you govern Unity Catalog objects, you work across several interconnected capabilities. You document tables and columns with comments and tags that help data consumers discover and understand your assets. You implement attribute-based access control (ABAC) using governed tags and policies that automatically enforce fine-grained permissions. You configure data retention policies using Delta Lake's VACUUM and predictive optimization to manage storage costs and meet compliance requirements.

```
VACUUM
```

Beyond access control, governance extends to data lineage tracking that shows how data flows through your pipelines, enabling impact analysis and troubleshooting. Audit logging captures who did what and when, supporting security investigations and regulatory compliance. For external collaboration, Delta Sharing lets you share data with partners and customers while maintaining governance controls over what they can access.
This module guides you through implementing these governance capabilities in your Azure Databricks environment. You explore techniques for preserving metadata, enforcing policies at scale, managing data lifecycle, and sharing data securely. By mastering these concepts, you position yourself to build data platforms that balance accessibility with control, enabling your organization to derive value from data while meeting its governance obligations.

## Navigation

- Previous: None
- Next: [02. Preserve table and column definitions](02.%20Preserve%20table%20and%20column%20definitions.md)

## Source

Microsoft Learn: [Introduction](https://learn.microsoft.com/en-us/training/modules/govern-unity-catalog-objects/1-introduction)
