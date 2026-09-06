# Summary

Maintaining data quality requires a multi-layered approach that catches issues at every stage of your data pipeline. Throughout this module, you explored the tools Azure Databricks provides for implementing robust data quality constraints in Unity Catalogâfrom **schema enforcement** that validates data types automatically to **pipeline expectations** that monitor quality in real time.

You learned how Delta Lake's built-in schema enforcement acts as a first line of defense, rejecting writes when data types cannot be safely cast. For more nuanced type handling, **explicit casting** with `cast()` and `try_cast()` gives you control over how mismatches are resolved. **CHECK constraints** enforce business rules directly on your tables, ensuring invalid data never enters production.

Schema drift is inevitable when working with evolving data sources. You explored strategies for handling this realityâfailing fast when changes require review, enabling **schema evolution** to adapt automatically, or using **rescued data columns** to preserve unexpected data for investigation. These options let you balance strictness with flexibility based on your pipeline's requirements.

**Pipeline expectations** in Lakeflow Spark Declarative Pipelines bring data quality validation directly into your ETL logic. You can **warn** about violations while still processing data, **drop** invalid records to ensure clean outputs, or **fail** pipelines when critical issues occur. The expectation metrics visible in the pipeline UI provide ongoing visibility into data quality trends.

Apply these techniques incrementally in your data engineering workflows. Start with schema enforcement and CHECK constraints for fundamental type and value validation. Add pipeline expectations for streaming workloads where real-time quality monitoring matters. Use quarantine patterns to isolate problematic records without blocking your main data flows. Together, these practices create data pipelines that your organization can trust.

---

## Navigation

- Previous: [07. Knowledge check](07.%20Knowledge%20check.md)
- Next: None

## Source

Microsoft Learn: [Summary](https://learn.microsoft.com/en-us/training/modules/implement-manage-data-quality-constraints-unity-catalog/8-summary)
