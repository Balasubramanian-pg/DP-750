## Introduction to Data Ingestion into Unity Catalog

Data ingestion is the process of moving data from source systems into a storage and analytics platform where it can be queried, transformed, and governed. The sources are varied: batch files in cloud storage, streaming events from message buses, and transactional records from operational databases. Each source has its own format, cadence, and reliability characteristics. The destination is equally important. In Azure Databricks, the destination is typically a table registered in Unity Catalog, the centralized governance layer for data and AI assets. Unity Catalog provides fine-grained access control, lineage tracking, auditing, and a consistent three-level namespace of catalog, schema, and table. Ingesting data into Unity Catalog means that every table you create is governed from the moment it lands, without additional configuration.

The challenge of ingestion is not only moving bytes. It is moving them reliably, repeatedly, and with data quality intact. A pipeline that ingests data once is easy. A pipeline that runs every hour for years, handles schema changes, recovers from failures, and never duplicates rows is hard. Azure Databricks offers several ingestion techniques, each designed for a specific pattern. Lakeflow Connect provides managed connectors for enterprise systems such as SQL Server and Salesforce, removing the need for custom extraction code. Notebooks give you full control over ingestion logic using Python, SQL, or Scala. SQL commands such as `COPY INTO` and `CREATE TABLE AS SELECT` offer declarative approaches for file-based ingestion. For real-time workloads, Spark Structured Streaming and Auto Loader process data continuously as it arrives, with exactly-once processing guarantees. Lakeflow Spark Declarative Pipelines orchestrate ingestion and transformation as a single declarative pipeline with built-in data quality expectations.

These notes cover the fundamentals of data ingestion into Unity Catalog. They explain what Unity Catalog is and why it matters for ingestion. They describe each ingestion technique, when to use it, and how it works. They show code examples in SQL and PySpark for the techniques that support them. They cover schema enforcement, schema evolution, expectations, null handling, case sensitivity, and time zones as they relate to ingestion. They also cover best practices, common mistakes, testing strategies, performance considerations, and an end-to-end example that ties the concepts together. The goal is that you can read these notes alone and understand how to choose and implement the right ingestion approach for any data source, ensuring your data lands in Unity Catalog tables with proper governance and optimal performance.

## The challenge of data ingestion

Data ingestion is deceptively simple in concept but complex in practice. The concept is straightforward: read data from a source and write it to a destination. The complexity comes from the variety of sources, the volume of data, the need for reliability, and the requirement for governance. A source might be a database that supports JDBC, a file system that stores CSV or Parquet files, a message bus that streams events, or a SaaS application with a REST API. Each source has different semantics for reading, different failure modes, and different guarantees about consistency. A destination might be a Delta table in Unity Catalog, and the write must respect the table's schema, permissions, and partitioning.

Reliability is the first challenge. Ingestion jobs fail. Networks partition, sources go offline, clusters run out of memory, and files arrive late or corrupted. A reliable ingestion pipeline must handle these failures gracefully. It must be idempotent, meaning that running it twice produces the same result as running it once. It must checkpoint its progress so that it can resume from where it left off. It must not duplicate rows or lose rows. Spark Structured Streaming and Auto Loader provide exactly-once processing guarantees when configured correctly, which means that each record is processed exactly once, even in the presence of failures.

Scalability is the second challenge. Data volumes grow. A pipeline that works for a few gigabytes must continue to work for terabytes. Ingestion must be parallelizable across a cluster. It must handle large files efficiently and avoid creating many small files, which degrade query performance. Auto Loader and Structured Streaming are designed for scale. They process files incrementally and can handle millions of files. They use checkpointing to track which files have been processed, so they do not reprocess old data.

Governance is the third challenge. Data must be secure, auditable, and compliant. You need to know who accessed what data and when. You need to enforce access controls at a fine granularity, such as column-level or row-level. Unity Catalog provides these capabilities. When you ingest data into a Unity Catalog table, the table is automatically governed. You can grant permissions to users and groups, audit access, and track lineage from source to destination. Without Unity Catalog, you would need to configure governance separately for each storage location, which is error-prone and inconsistent.

Schema management is the fourth challenge. Source schemas change. A new column is added, a column type changes, or a column is renamed. An ingestion pipeline must handle these changes without breaking. Delta Lake provides schema enforcement, which rejects writes that do not match the table schema, and schema evolution, which allows you to add new columns during a write. Auto Loader can detect schema changes and update its schema location. Lakeflow Spark Declarative Pipelines can define expectations that validate data quality and handle schema drift.

The following table summarizes the ingestion techniques and the challenges they address.

| Technique | Source type | Processing mode | Governance integration | Key strength |
|---|---|---|---|---|
| Lakeflow Connect | Enterprise apps, databases | Batch or incremental | Unity Catalog native | Managed connectors, no code |
| Notebooks | Any source with a Spark connector | Batch or streaming | Unity Catalog native | Full control, custom logic |
| SQL `COPY INTO` | Files in cloud storage | Batch | Unity Catalog native | Declarative, idempotent |
| SQL `CREATE TABLE AS SELECT` | Any queryable source | Batch | Unity Catalog native | Simple transformation during load |
| Spark Structured Streaming | Message buses, files | Streaming | Unity Catalog native | Exactly-once, low latency |
| Auto Loader | Files in cloud storage | Streaming | Unity Catalog native | Automatic file detection, schema inference |
| Lakeflow Spark Declarative Pipelines | Any source | Batch or streaming | Unity Catalog native | Declarative pipelines with expectations |

The table shows that there is no single best technique. The choice depends on the source, the latency requirement, and the amount of control you need. The rest of these notes explains each technique in detail.

## Unity Catalog as the governance foundation

Unity Catalog is a unified governance layer for data and AI assets in Azure Databricks. It provides a central place to define and manage access controls, audit access, and track lineage. The core abstraction is the three-level namespace: catalog, schema, and table. A catalog is a top-level container, often organized by business unit or environment. A schema is a database within a catalog, and a table is a dataset within a schema. For example, `sales.gold.orders` refers to the `orders` table in the `gold` schema of the `sales` catalog. This namespace is consistent across all workspaces in an Azure Databricks account, so you can access the same data from any workspace without copying or syncing.

Unity Catalog integrates with all ingestion techniques. When you write data to a Unity Catalog table, the write is governed by the permissions on the table. If you have `MODIFY` permission, you can write. If you have `SELECT` permission, you can read. Permissions can be granted at the catalog, schema, or table level, and they can be inherited. You can also define row-level filters and column masks to restrict access to specific rows or columns. These policies are applied automatically to every query, including ingestion queries. This means that if a user runs an ingestion job, they can only write to tables they have permission to modify, and they can only read source data they have permission to access.

Unity Catalog also records lineage. When you ingest data from a source to a target, Unity Catalog tracks the relationship between the source and the target. You can see which jobs wrote to a table, which tables were read, and how the data flowed. This is valuable for debugging, auditing, and impact analysis. If a source table changes, you can see which downstream tables are affected. If a target table has data quality issues, you can trace them back to the source.

Delta Lake is the storage layer that Unity Catalog tables use. Delta Lake provides ACID transactions, schema enforcement, time travel, and efficient upserts and deletes. When you ingest data into a Unity Catalog table, the table is a Delta table by default. This means you get all the benefits of Delta Lake without additional configuration. You can query the table with SQL, update it with `MERGE`, and time travel to previous versions. Delta Lake also stores per-file statistics that the optimizer uses to skip files during queries, which improves performance.

The medallion architecture is a common pattern for organizing data in a lakehouse. It consists of three layers: bronze, silver, and gold. The bronze layer holds raw data as it arrived from the source. The silver layer holds cleaned, conformed data. The gold layer holds aggregated, denormalized data for analytics. Ingestion typically lands data in the bronze layer. The raw data is preserved for auditing and reprocessing. Then transformations move data from bronze to silver and from silver to gold. Unity Catalog governs all three layers. You can define separate catalogs or schemas for each layer and grant different permissions. For example, the bronze layer might be accessible only to data engineers, while the gold layer is accessible to analysts.

When you ingest data, you should consider schema enforcement, schema evolution, and expectations. Schema enforcement means that Delta Lake rejects writes that do not match the table schema. This prevents accidental corruption. Schema evolution means that you can add new columns to the table during a write. This is useful when the source schema changes. Expectations are data quality rules that you define in Lakeflow Spark Declarative Pipelines. They can drop, fail, or warn on rows that violate a rule. For example, you can define an expectation that `order_id` is not null. If a row violates the expectation, the pipeline can drop it before it lands in the table. Expectations help you maintain data quality at the point of ingestion.

Null handling, case sensitivity, and time zones are important considerations for ingestion. Nulls represent missing or unknown values. In SQL and Spark, null comparisons return null, not true or false. When you ingest data, you must decide how to handle nulls. Delta Lake allows nulls in nullable columns. If a column is non-nullable, a null value causes the write to fail. Case sensitivity affects string comparisons. By default, Spark's string comparisons are case-sensitive. If your source data has inconsistent casing, you may need to normalize it before ingestion or use a case-insensitive collation. Time zones affect timestamps. Spark stores timestamps internally in UTC and displays them in the session time zone. When you ingest timestamps, you should set the session time zone explicitly to avoid off-by-hours errors. Store timestamps in UTC and convert to local time only for display.

## Overview of ingestion techniques

Azure Databricks offers several ingestion techniques. Each is designed for a specific pattern. The following sections describe each technique, when to use it, and how it works.

### Lakeflow Connect

Lakeflow Connect is a set of managed connectors for common enterprise sources such as SQL Server, Salesforce, and ServiceNow. It removes the need to write custom extraction code. You configure a connection in the Databricks UI or via the API, specify the source and the target Unity Catalog table, and Lakeflow Connect handles the rest. It supports batch and incremental ingestion. For incremental ingestion, it uses change data capture (CDC) where available, so it only reads rows that have changed since the last run. This reduces load on the source and speeds up ingestion.

Lakeflow Connect is the right choice when you need to ingest from a supported enterprise source and you do not want to maintain custom code. It is not available for all sources. If your source is not supported, you need to use another technique, such as a notebook with a JDBC connection or a custom connector.

### Notebooks

Notebooks give you full control over ingestion logic. You can use Python, SQL, or Scala to read from any source that has a Spark connector and write to a Unity Catalog table. Notebooks are flexible. You can implement custom authentication, handle complex transformations, and orchestrate multiple steps in a single notebook. You can also use notebooks to run ingestion jobs on a schedule with Databricks Jobs.

The following example shows a notebook that reads from a SQL Server database using JDBC and writes to a Unity Catalog table.

```python
# Import the necessary functions for the JDBC read.
# No special imports are required for the JDBC format,
# but we import col for column operations.
from pyspark.sql.functions import col

# Read from the SQL Server database using JDBC.
# The url specifies the JDBC connection string.
# The dbtable specifies the table or query to read.
# The user and password provide authentication.
# In production, use a secret scope instead of hardcoding credentials.
df = (spark.read
      .format("jdbc")
      .option("url", "jdbc:sqlserver://server:1433;databaseName=SalesDB")
      .option("dbtable", "dbo.Customers")
      .option("user", "ingest_user")
      .option("password", "password")
      .load())

# Write the DataFrame to a Unity Catalog table.
# The mode("overwrite") replaces the table contents on each run.
# For incremental loads, use mode("append") or a merge operation.
# The saveAsTable method uses the three-level namespace.
df.write.mode("overwrite").saveAsTable("sales.bronze.customers")
```

The example reads all customers from the source and overwrites the target table. For incremental ingestion, you would add a filter on a timestamp or an ID column and use append or merge mode. Notebooks are also used for file-based ingestion when you need custom logic that `COPY INTO` does not support.

### SQL commands: COPY INTO and CREATE TABLE AS SELECT

SQL commands provide a declarative way to ingest file-based data. `COPY INTO` loads files from cloud storage into a Delta table. It is idempotent: if you run it multiple times on the same files, it skips files that have already been loaded. This makes it safe to retry. `COPY INTO` supports CSV, JSON, Parquet, Avro, ORC, and text files. It can infer the schema, or you can specify it. It can also merge schema changes if you enable the option.

The following SQL example shows `COPY INTO` loading CSV files into a Unity Catalog table.

```sql
-- Create the target table in Unity Catalog.
-- The table has three columns: id, name, and amount.
-- The table is created in the sales.bronze schema.
CREATE TABLE IF NOT EXISTS sales.bronze.transactions (
  id INT,
  name STRING,
  amount DOUBLE
);

-- Load data from cloud storage into the table.
-- COPY INTO is idempotent: it tracks which files have been loaded
-- and skips them on subsequent runs.
COPY INTO sales.bronze.transactions
FROM 's3://my-bucket/transactions/'
FILEFORMAT = CSV
-- The format options tell COPY INTO that the files have a header row
-- and that it should infer the schema from the data.
FORMAT_OPTIONS ('header' = 'true', 'inferSchema' = 'true')
-- The copy options allow schema evolution if new columns appear.
COPY_OPTIONS ('mergeSchema' = 'true');
```

`CREATE TABLE AS SELECT` (CTAS) creates a new table from the result of a query. It is useful when you want to transform data during ingestion. For example, you can select specific columns, filter rows, and join tables, and the result becomes a new table.

```sql
-- Create a new table from a SELECT query.
-- The query reads from a source table, filters rows,
-- and selects specific columns.
CREATE TABLE sales.silver.transactions_clean AS
SELECT
    id,
    name,
    amount,
    current_timestamp() AS ingested_at
FROM sales.bronze.transactions
WHERE amount > 0;
```

CTAS is a batch operation. It reads the source data and writes the result in one transaction. It is not incremental. If you run it again, it fails because the table already exists unless you use `CREATE OR REPLACE TABLE`. Use CTAS for one-time transformations or for rebuilding a table from scratch.

### Spark Structured Streaming

Spark Structured Streaming processes data continuously as it arrives. It reads from a streaming source such as Kafka, Event Hubs, or a file system, and writes to a Delta table. It provides exactly-once processing guarantees when you configure a checkpoint location and an output mode. It supports event-time processing, watermarks, and windowing. Structured Streaming is the right choice when you need low-latency ingestion and you want to process data as it arrives.

The following example shows a Structured Streaming job that reads from Kafka and writes to a Unity Catalog table.

```python
# Read from Kafka using Structured Streaming.
# The format is "kafka".
# The bootstrap servers specify the Kafka cluster.
# The subscribe option names the topic.
df = (spark.readStream
      .format("kafka")
      .option("kafka.bootstrap.servers", "kafka-server:9092")
      .option("subscribe", "transactions")
      .load())

# The Kafka value column is binary, so cast it to string.
# In a real pipeline, you would parse the JSON or Avro payload.
df_parsed = df.selectExpr("CAST(value AS STRING) AS json_value")

# Write the stream to a Delta table in Unity Catalog.
# The checkpoint location stores the progress of the stream.
# The output mode "append" adds new rows as they arrive.
# The trigger "availableNow" processes all available data and stops.
(df_parsed.writeStream
   .option("checkpointLocation", "/checkpoints/kafka_transactions")
   .outputMode("append")
   .trigger(availableNow=True)
   .toTable("sales.bronze.kafka_transactions"))
```

Structured Streaming is more complex than batch ingestion because it must handle continuous operation, checkpointing, and failure recovery. It is the standard choice for real-time data.

### Auto Loader

Auto Loader is a specialized streaming source for files in cloud storage. It automatically detects new files as they arrive, infers the schema, and processes the files incrementally. It is designed for file-based ingestion at scale. It uses a schema location to store the inferred schema and a checkpoint location to track progress. It can handle millions of files and can detect schema changes. Auto Loader is the recommended approach for ingesting files into Delta tables.

The following example shows Auto Loader reading CSV files and writing to a Unity Catalog table.

```python
# Configure Auto Loader to read from cloud storage.
# The format "cloudFiles" is the Auto Loader source.
# The cloudFiles.format option specifies the file format (csv).
# The cloudFiles.schemaLocation stores the inferred schema.
# The header option tells Auto Loader that the CSV files have a header.
df = (spark.readStream
      .format("cloudFiles")
      .option("cloudFiles.format", "csv")
      .option("cloudFiles.schemaLocation", "/schemas/transactions")
      .option("header", "true")
      .load("s3://my-bucket/transactions/"))

# Write the stream to a Delta table in Unity Catalog.
# The checkpoint location tracks which files have been processed.
# The trigger "availableNow" processes all new files and stops.
(df.writeStream
   .option("checkpointLocation", "/checkpoints/transactions")
   .trigger(availableNow=True)
   .toTable("sales.bronze.transactions_auto"))
```

Auto Loader is simpler than general Structured Streaming because it handles file detection and schema inference automatically. It is the best choice for ingesting files from cloud storage.

### Lakeflow Spark Declarative Pipelines

Lakeflow Spark Declarative Pipelines is a framework for building data pipelines using SQL and Python. You define tables and their transformations declaratively, and the framework handles orchestration, dependency resolution, and data quality. You can define expectations that validate data quality and handle schema drift. Pipelines can be batch or streaming. They integrate with Unity Catalog, so all tables are governed.

The following example shows a simple pipeline definition in Python using the `@dlt.table` decorator.

```python
import dlt
from pyspark.sql.functions import col

# Define a bronze table that reads from cloud storage using Auto Loader.
@dlt.table(
    name="bronze_transactions",
    comment="Raw transactions ingested from cloud storage"
)
def bronze_transactions():
    return (spark.readStream
            .format("cloudFiles")
            .option("cloudFiles.format", "csv")
            .option("header", "true")
            .load("s3://my-bucket/transactions/"))

# Define a silver table that filters and cleans the bronze data.
# The @dlt.expect decorator defines a data quality expectation.
# If a row violates the expectation, it is dropped.
@dlt.table(
    name="silver_transactions",
    comment="Cleaned transactions"
)
@dlt.expect("valid_amount", "amount > 0")
def silver_transactions():
    return (dlt.read_stream("bronze_transactions")
            .filter(col("amount").isNotNull()))
```

Lakeflow Spark Declarative Pipelines is the highest-level abstraction. It is the right choice when you want to define a complete pipeline with data quality rules and let the framework handle the details.

## Choosing the right ingestion technique

The choice of ingestion technique depends on the source, the latency requirement, and the amount of control you need. The following table summarizes the decision criteria.

| Source | Latency requirement | Recommended technique |
|---|---|---|
| Enterprise app (Salesforce, SQL Server) | Batch or incremental | Lakeflow Connect |
| Any source with a Spark connector | Batch | Notebook |
| Files in cloud storage | Batch | `COPY INTO` or CTAS |
| Files in cloud storage | Streaming | Auto Loader |
| Message bus (Kafka, Event Hubs) | Streaming | Spark Structured Streaming |
| Multiple sources with data quality rules | Batch or streaming | Lakeflow Spark Declarative Pipelines |

The table shows that the source and latency are the primary drivers. If the source is a supported enterprise system, Lakeflow Connect is the simplest. If you need full control, use a notebook. For files, use `COPY INTO` for batch and Auto Loader for streaming. For message buses, use Structured Streaming. For complex pipelines with data quality, use Lakeflow Spark Declarative Pipelines.

In practice, pipelines often combine techniques. A common pattern is to use Auto Loader to ingest files into a bronze table, then use Lakeflow Spark Declarative Pipelines to transform the data into silver and gold tables. Another pattern is to use Lakeflow Connect for enterprise sources and notebooks for custom sources, both landing data in bronze tables. The medallion architecture provides a consistent structure for organizing these layers.

## Schema enforcement, evolution, and expectations

Schema enforcement is a Delta Lake feature that rejects writes that do not match the table schema. When you ingest data, Delta Lake compares the schema of the incoming data with the schema of the target table. If the data has extra columns, the write fails unless schema evolution is enabled. If the data is missing nullable columns, those columns are written as null. If a non-nullable column is missing, the write fails. Schema enforcement protects the table from accidental corruption and ensures that downstream queries can rely on the schema.

Schema evolution allows you to add new columns to the table during a write. In SQL, you use `WITH SCHEMA EVOLUTION` in a `MERGE` statement, or you set the `mergeSchema` option in `COPY INTO`. In PySpark, you use the `mergeSchema` option on the write. Schema evolution is useful when the source schema changes. For example, a new column is added to a CSV file. Auto Loader can detect the new column and update its schema location. If schema evolution is enabled, the write adds the new column to the target table. Existing rows get null in the new column. Schema evolution should be used deliberately because it changes the table schema and may break downstream consumers that expect a fixed set of columns.

Expectations are data quality rules that you define in Lakeflow Spark Declarative Pipelines. You attach an expectation to a table or a column, and the framework evaluates the rule on each row. If a row violates the rule, the framework can drop the row, fail the pipeline, or warn. Expectations help you maintain data quality at the point of ingestion. For example, you can define an expectation that `order_id` is not null and that `amount` is positive. If a row violates either expectation, it is dropped before it reaches the target table.

The following table summarizes the schema and quality controls.

| Control | Mechanism | Effect |
|---|---|---|
| Schema enforcement | Delta Lake write | Rejects writes that do not match the table schema |
| Schema evolution | `mergeSchema` option or `WITH SCHEMA EVOLUTION` | Adds new columns to the table during a write |
| Expectations | Lakeflow Spark Declarative Pipelines | Drops, fails, or warns on rows that violate a rule |

The table shows that schema enforcement and evolution are about structure, while expectations are about data quality. Use schema enforcement to protect the table, schema evolution to handle legitimate schema changes, and expectations to validate business rules.

## Null handling, case sensitivity, and time zones

Null handling is a critical consideration for ingestion. In SQL and Spark, a null represents an unknown value. Comparisons with null return null, not true or false. When you ingest data, you must decide how to handle nulls. Delta Lake allows nulls in nullable columns. If a column is non-nullable, a null value causes the write to fail. If you are ingesting from a source that uses empty strings to represent missing values, you may want to convert them to nulls before writing. You can use `when` and `otherwise` in PySpark or `CASE` in SQL. For example, `when(col("name") == "", None).otherwise(col("name"))` converts empty strings to nulls.

Case sensitivity affects string comparisons. By default, Spark's string comparisons are case-sensitive. `'ABC'` and `'abc'` are different values. If your source data has inconsistent casing in a key column, joins and merges may not match rows that should match. You can normalize the case before ingestion using `upper()` or `lower()`, or you can use a case-insensitive collation if the table is configured for one. Unity Catalog supports collations at the column level. Be aware that applying a function to a column can prevent predicate pushdown and may force a full scan.

Time zones affect timestamps. Spark stores timestamps internally in UTC and displays them in the session time zone. The session time zone is set by `spark.sql.session.timeZone`. When you ingest timestamps, the values are stored in UTC. When you compare a timestamp to a string literal, the literal is interpreted in the session time zone. To avoid off-by-hours errors, set the session time zone explicitly at the start of your job, for example `spark.conf.set("spark.sql.session.timeZone", "UTC")`. Use timestamp literals with explicit offsets when comparing to timestamps. Store timestamps in UTC and convert to local time only for display.

## An end-to-end example

Consider a scenario where you need to ingest CSV files from cloud storage into a bronze table, clean the data into a silver table, and aggregate it into a gold table. The pipeline uses Auto Loader for ingestion, Lakeflow Spark Declarative Pipelines for transformation, and Unity Catalog for governance. The following example shows the pipeline definition.

```python
import dlt
from pyspark.sql.functions import col, sum, count, current_timestamp

# Define the bronze table using Auto Loader.
# The table ingests CSV files from cloud storage.
# The schema location and checkpoint location are managed by the pipeline.
@dlt.table(
    name="bronze_transactions",
    comment="Raw transactions ingested from cloud storage using Auto Loader"
)
def bronze_transactions():
    return (spark.readStream
            .format("cloudFiles")
            .option("cloudFiles.format", "csv")
            .option("cloudFiles.schemaLocation", "/schemas/bronze_transactions")
            .option("header", "true")
            .load("s3://my-bucket/transactions/"))

# Define the silver table with expectations.
# The expectation drops rows where amount is null or negative.
@dlt.table(
    name="silver_transactions",
    comment="Cleaned transactions"
)
@dlt.expect_or_drop("valid_amount", "amount > 0")
def silver_transactions():
    return (dlt.read_stream("bronze_transactions")
            .filter(col("amount").isNotNull())
            .withColumn("ingested_at", current_timestamp()))

# Define the gold table that aggregates the silver data.
# The gold table is a batch table that reads the full silver table.
@dlt.table(
    name="gold_daily_summary",
    comment="Daily summary of transactions by region"
)
def gold_daily_summary():
    return (dlt.read("silver_transactions")
            .groupBy("region")
            .agg(
                sum("amount").alias("total_sales"),
                count("*").alias("transaction_count")
            ))
```

The example defines three tables: bronze, silver, and gold. The bronze table uses Auto Loader to ingest CSV files. The silver table filters out invalid rows and adds an ingestion timestamp. The gold table aggregates the silver data by region. The pipeline is declarative. The framework handles orchestration, checkpointing, and data quality. All tables are created in Unity Catalog, so they are governed. The `@dlt.expect_or_drop` decorator defines an expectation that drops rows where the amount is not positive.

## Best practices

Use Unity Catalog for all tables. Unity Catalog provides centralized governance, fine-grained access control, lineage, and auditing. Creating tables in Unity Catalog from the start avoids migration later.

Choose the ingestion technique that matches the source and latency requirement. Use Lakeflow Connect for supported enterprise sources, Auto Loader for file-based streaming, `COPY INTO` for file-based batch, Structured Streaming for message buses, and notebooks for custom sources. Use Lakeflow Spark Declarative Pipelines for complex pipelines with data quality rules.

Deduplicate source data before appending or merging. Duplicates are the most common data quality problem. Use `SELECT DISTINCT`, `dropDuplicates`, or a window function to keep one row per key.

Set the session time zone explicitly to UTC. This avoids off-by-hours errors when ingesting timestamps.

Use schema evolution deliberately. Adding columns to a table changes the schema and may break downstream consumers. Communicate schema changes and test downstream queries.

Define expectations for data quality. Expectations catch invalid rows at the point of ingestion and prevent them from reaching downstream tables.

Use checkpointing for streaming ingestion. Checkpoints allow the stream to resume from where it left off after a failure. Without a checkpoint, the stream may reprocess or lose data.

Monitor ingestion jobs. Track metrics such as rows ingested, files processed, and errors. Set up alerts for failures.

## Common mistakes and pitfalls

The most common mistake is not using Unity Catalog. Creating tables outside Unity Catalog means they are not governed, and you lose access control, lineage, and auditing. Always create tables in Unity Catalog.

A second mistake is appending the same batch twice. `INSERT INTO` does not check for duplicates. Deduplicate the source and use `MERGE` for idempotent writes.

A third mistake is forgetting to set the session time zone. `current_timestamp()` and `current_date()` use the session time zone. If the session time zone differs from the data time zone, timestamps may be inconsistent.

A fourth mistake is enabling schema evolution without communication. Adding columns changes the table schema and may break downstream consumers.

A fifth mistake is using a non-unique key in a merge. The merge fails or produces non-deterministic results. Always ensure the key is unique on both sides.

A sixth mistake is not using checkpointing for streaming. Without a checkpoint, the stream cannot recover from failures and may reprocess data.

A seventh mistake is ignoring case sensitivity. String comparisons are case-sensitive by default. Normalize casing or use a collation if needed.

An eighth mistake is not handling nulls explicitly. Nulls behave differently from empty strings and zeros. Decide how to handle nulls before ingestion.

## Testing ingestion logic

Test ingestion logic with small datasets that include duplicates, nulls, and boundary values. For batch ingestion, create a small file with known data, run the ingestion, and assert the row count and values. For streaming ingestion, use a test source that you can control, such as a directory of files, and verify that the stream processes them correctly. The following example shows a test for a batch ingestion job.

```python
from pyspark.sql import Row

# Create a small DataFrame with test data.
test_data = [
    Row(id=1, name="Alice", amount=100.0),
    Row(id=2, name="Bob", amount=None),
    Row(id=3, name="Charlie", amount=200.0),
]
df_test = spark.createDataFrame(test_data)

# Write the test data to a temporary table.
df_test.write.mode("overwrite").saveAsTable("tmp.test_transactions")

# Run the ingestion logic. For example, filter out null amounts.
df_ingested = (spark.read.table("tmp.test_transactions")
               .filter("amount IS NOT NULL"))

# Assert the result.
assert df_ingested.count() == 2, "Expected 2 rows after filtering nulls"

# Assert that the remaining rows have the correct values.
rows = df_ingested.orderBy("id").collect()
assert rows[0].name == "Alice" and rows[0].amount == 100.0
assert rows[1].name == "Charlie" and rows[1].amount == 200.0
```

Run tests like this in your CI pipeline against a small local Spark session. For pipelines defined with Lakeflow Spark Declarative Pipelines, you can use the pipeline testing framework to validate expectations and transformations.

## Performance considerations

Ingestion performance depends on the source, the volume of data, and the write pattern. The following considerations apply to most ingestion techniques.

File size matters. Small files are inefficient because each file has metadata overhead and queries must open many files. Aim for files of 100 MB to 1 GB. If you are ingesting many small files, use Auto Loader with file notification mode or run `OPTIMIZE` after ingestion to compact small files into larger ones.

Partitioning and clustering improve query performance. Partition tables by columns that are commonly used in filters, such as date. Avoid high-cardinality partition columns. Liquid clustering is an alternative that adapts as data changes. Choose partitioning or clustering based on your query patterns.

Checkpointing is essential for streaming. The checkpoint location stores the progress of the stream. Use a reliable storage location such as cloud storage. Do not use a local path because it is not durable.

Trigger modes control how often the stream processes data. `availableNow` processes all available data and stops. This is useful for scheduled jobs. `processingTime` processes data at a fixed interval. `continuous` provides low latency but is more expensive. Choose the trigger that matches your latency requirement.

Use broadcast joins when merging a small source into a large target. Spark can broadcast the source to all executors and avoid shuffling the target.

Monitor the number of files and the size of the table. Run `OPTIMIZE` and `VACUUM` periodically to maintain performance.

## Summary

Data ingestion is the process of moving data from source systems into Unity Catalog tables. Unity Catalog provides centralized governance, fine-grained access control, lineage, and auditing. It uses a three-level namespace of catalog, schema, and table. Delta Lake is the storage layer, providing ACID transactions, schema enforcement, time travel, and efficient upserts.

Azure Databricks offers several ingestion techniques. Lakeflow Connect provides managed connectors for enterprise sources. Notebooks give full control over ingestion logic. SQL commands `COPY INTO` and `CREATE TABLE AS SELECT` provide declarative batch ingestion for files. Spark Structured Streaming processes data continuously from message buses. Auto Loader detects and processes new files automatically. Lakeflow Spark Declarative Pipelines orchestrates ingestion and transformation with data quality expectations.

The choice of technique depends on the source, latency requirement, and control needed. Use Lakeflow Connect for supported enterprise sources, Auto Loader for file-based streaming, `COPY INTO` for file-based batch, Structured Streaming for message buses, and notebooks for custom sources. Use Lakeflow Spark Declarative Pipelines for complex pipelines with data quality rules.

Schema enforcement, schema evolution, and expectations are important for data quality. Schema enforcement rejects writes that do not match the table schema. Schema evolution adds new columns during a write. Expectations validate data quality and drop or flag invalid rows. Null handling, case sensitivity, and time zones affect ingestion. Set the session time zone explicitly to UTC, normalize string casing, and handle nulls deliberately.

Best practices include using Unity Catalog for all tables, deduplicating source data, setting the session time zone, using schema evolution deliberately, defining expectations, and using checkpointing for streaming. Common mistakes include not using Unity Catalog, appending the same batch twice, forgetting the session time zone, and enabling schema evolution without communication.

Test ingestion logic with small datasets that include duplicates, nulls, and boundary values. Performance depends on file size, partitioning, checkpointing, and trigger modes. Use Auto Loader and Structured Streaming for scalable ingestion, and run `OPTIMIZE` to maintain file sizes.

By understanding the ingestion techniques and the governance foundation of Unity Catalog, you can build robust data pipelines that scale with your organization and maintain data quality from source to destination.
