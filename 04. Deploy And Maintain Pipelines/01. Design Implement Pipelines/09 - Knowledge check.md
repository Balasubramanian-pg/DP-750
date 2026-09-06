\n[Read in English](# "#")

# Module assessment

Completed

* 5 minutes

## Check your knowledge

1.

Which medallion architecture layer corresponds to the data ingestion stage where raw data is preserved with minimal transformation?

Gold layer

Silver layer

Bronze layer

2.

What is the primary advantage of using Lakeflow Spark Declarative Pipelines over notebooks for production data pipelines?

Declarative pipelines allow rapid prototyping and cell-by-cell inspection

Declarative pipelines automatically handle orchestration, incremental processing, and error recovery

Declarative pipelines support more external library dependencies than notebooks

3.

Which dependency condition should a data engineer configure for a cleanup task that must run after all upstream tasks finish, regardless of whether they succeeded or failed?

All succeeded

At least one failed

All done

4.

What action does a Lakeflow Declarative Pipeline take when a record fails an expectation configured with ON VIOLATION DROP ROW?

The pipeline stops immediately and rolls back the transaction

The invalid record is written to the target table and violation metrics are logged

The invalid record is excluded from the output table

5.

What is the purpose of using dbutils.notebook.exit() in a notebook task within a Lakeflow Job?

To terminate the cluster immediately to reduce costs

To communicate success or failure results that downstream tasks can use in conditional logic

To automatically trigger a retry of the failed notebook task

6.

When should a data engineer choose streaming tables over materialized views in Lakeflow Spark Declarative Pipelines?

When the transformation requires complex aggregations or joins

When the source data is append-only and requires low-latency processing

When the source data includes frequent updates and deletes

You must answer all questions before checking your work.




You must answer all questions before checking your work.

---
