# Introduction

Description: Introduction to securing Unity Catalog objects

Source: https://learn.microsoft.com/en-us/training/modules/secure-unity-catalog-objects/1-introduction

---

[Skip to main content](https://learn.microsoft.com/en-us/training/modules/secure-unity-catalog-objects/1-introduction#main)
This browser is no longer supported.
Upgrade to Microsoft Edge to take advantage of the latest features, security updates, and technical support.
[Download Microsoft Edge](https://go.microsoft.com/fwlink/p/?LinkID=2092881)
[More info about Internet Explorer and Microsoft Edge](https://learn.microsoft.com/en-us/lifecycle/faq/internet-explorer-microsoft-edge)
[Read in English](https://learn.microsoft.com/en-us/training/modules/secure-unity-catalog-objects/1-introduction)

- 2 minutes
Securing data is fundamental to enterprise data platforms, yet traditional approaches often fragment governance across multiple systems and require constant maintenance. As organizations scale their analytics workloads on Azure Databricks, they need unified security that protects sensitive information while maintaining operational efficiency. Unity Catalog addresses this challenge by providing centralized governance for data assets, compute resources, and access controls.
When you work with Unity Catalog, security operates at multiple layers. You control who can access catalogs, schemas, and tables through granular permissions. You enforce row-level and column-level restrictions to ensure users see only the data they're authorized to view. You authenticate data access through service principals or managed identities, eliminating hardcoded credentials from your code. You retrieve sensitive configuration values from Azure Key Vault without exposing secrets in notebooks or job configurations.
Understanding how these security mechanisms work together enables you to build data solutions that balance accessibility with protection. You need to know when inherited permissions simplify administration and when explicit grants provide necessary control. You must choose between row and column security functions versus dynamic views based on your governance requirements. You should recognize when managed identities offer advantages over service principals for authenticating storage access.
This module guides you through Unity Catalog's security model, from understanding the query lifecycle to implementing authentication strategies. You explore access control patterns that scale across your organization, fine-grained filtering techniques that protect sensitive data, and credential management approaches that strengthen your security posture. By the end, you'll be equipped to design and implement comprehensive security for your Azure Databricks environment.

## Navigation

- Previous: None
- Next: [02. Understand the query lifecycle](02.%20Understand%20the%20query%20lifecycle.md)

## Source

Microsoft Learn: [Introduction](https://learn.microsoft.com/en-us/training/modules/secure-unity-catalog-objects/1-introduction)
