## Ingest data from a CDC feed

Change data capture, usually called CDC, is a technique for tracking inserts, updates, and deletes in a source system and delivering those changes to a downstream system. A CDC feed is the stream of change events that a source database produces when CDC is enabled. Instead of reading the full contents of a source table on every run, a CDC feed captures only the rows that changed. This makes ingestion more efficient, reduces load on the source, and preserves the complete history of changes, including deletes. In Azure Databricks, CDC feeds are ingested into Unity Catalog tables using Lakeflow Connect database connectors or the AUTO CDC API in Lakeflow Spark Declarative Pipelines.

CDC ingestion matters because operational databases change constantly. Customer records are updated, orders are cancelled, and products are discontinued. A pipeline that only reads full snapshots misses deletes and cannot track how data evolved over time. A pipeline that reads the transaction log, which is what CDC does, captures every change with low latency and minimal impact on the source. This is essential for maintaining slowly changing dimensions, for replicating operational tables into the lakehouse, and for building analytical models that require a historical view. Unity Catalog governs the ingested data, so every change that lands in a target table is subject to access controls, lineage tracking, and auditing.

These notes cover CDC ingestion from first principles. They explain what a CDC feed is, how Lakeflow Connect database connectors capture changes, and how the AUTO CDC API applies those changes to Unity Catalog streaming tables. They explain the difference between standard gateway-based CDC and integrated CDC pipelines, how staging volumes work, how SCD type 1 and SCD type 2 determine what the target table contains, and how exactly-once semantics are guaranteed. They also cover null handling, case sensitivity, time zones, best practices, common mistakes, testing, performance, and an end-to-end example. Each concept is introduced in prose, then shown in configuration or code with full comments, then interpreted. The goal is that you can read these notes alone and understand how to ingest a CDC feed into Unity Catalog reliably and correctly.

## Understanding change data capture

Change data capture is a design pattern that reads the transaction log of a database to identify rows that have been inserted, updated, or deleted. Every relational database maintains a log of changes for recovery and replication. MySQL calls it the binary log, or `binlog`. PostgreSQL uses the write-ahead log. SQL Server has a built-in change data capture feature. The log records the before and after values of each change. A CDC connector reads the log, converts the changes into a stream of events, and delivers them to a downstream system. Because the log is the authoritative record of every change, CDC captures every insert, update, and delete. It does not miss changes that occur between snapshots, and it does not require querying the source tables directly.

The following table compares CDC with snapshot-based ingestion.

| Aspect | Snapshot ingestion | CDC ingestion |
|---|---|---|
| What is read | Full table contents | Only changed rows |
| Captures deletes | No | Yes |
| Load on source | High for large tables | Low, reads the log |
| Latency | Depends on run frequency | Low, continuous |
| Historical tracking | No | Yes, with SCD type 2 |
| Requires source configuration | No | Yes, CDC must be enabled |

The table shows that CDC is more efficient for large tables and captures deletes, which snapshot ingestion cannot. The tradeoff is setup complexity. CDC requires the source database to have CDC enabled and requires a user with permission to read the log. For MySQL, the user needs `REPLICATION SLAVE` and `REPLICATION CLIENT` privileges. For PostgreSQL, the user needs the `REPLICATION` role and access to a replication slot. For SQL Server, CDC must be enabled on the database and on the specific tables.

## Lakeflow Connect database connectors with CDC

Lakeflow Connect provides managed database connectors that use CDC to ingest changes from relational databases into Unity Catalog. The connectors support MySQL, PostgreSQL, and SQL Server. You configure a connection that stores the credentials and endpoint for the source, and a pipeline that specifies which tables to ingest and where to write them. The connector handles the initial snapshot, ongoing incremental changes, and schema evolution. The target tables are streaming tables in Unity Catalog, continuously updated as changes arrive.

The following table summarizes the CDC capabilities of the supported connectors.

| Database | CDC mechanism | Captures deletes | Typical latency |
|---|---|---|---|
| MySQL | Binary log (`binlog`) | Yes | Seconds to minutes |
| PostgreSQL | Write-ahead log, logical replication | Yes | Seconds to minutes |
| SQL Server | Built-in change data capture | Yes | Seconds to minutes |

The connectors write to a staging volume before applying changes to the target table. The staging volume is a Unity Catalog volume that temporarily stores extracted data. The pipeline reads from the staging volume and applies changes using the configured primary keys and SCD type. The staging volume is created automatically if you do not specify one. Data is automatically purged from staging after 30 days. The following YAML example shows a pipeline configuration for a SQL Server CDC connector.

```yaml
# Pipeline configuration for a SQL Server CDC connector.
# The pipeline references a Unity Catalog connection and a gateway.
resources:
  pipelines:
    sqlserver_cdc_pipeline:
      name: sqlserver-cdc-pipeline
      catalog: sales
      schema: bronze
      ingestion_definition:
        # The connection stores the source credentials.
        connection_name: sqlserver_connection
        # The gateway reads the SQL Server transaction log.
        ingestion_gateway_id: ${resources.gateways.sqlserver_gateway.id}
        # The objects list names the source tables and their destinations.
        objects:
          - table:
              source_schema: dbo
              source_table: customers
              destination_catalog: sales
              destination_schema: bronze
          - table:
              source_schema: dbo
              source_table: orders
              destination_catalog: sales
              destination_schema: bronze
```

The example configures a pipeline that ingests `customers` and `orders` from SQL Server into the `sales.bronze` schema. The `connection_name` references a Unity Catalog connection. The `ingestion_gateway_id` references a gateway that runs in your environment and reads the SQL Server transaction log. The pipeline writes to staging storage and then applies changes to the destination streaming tables.

## Integrated CDC pipelines

An integrated CDC pipeline combines the extraction and application phases into a single pipeline. In the standard gateway-based architecture, you deploy a separate ingestion gateway and an ingestion pipeline. The gateway runs continuously and stages changes. The pipeline reads from staging and applies changes. In an integrated CDC pipeline, the pipeline itself performs both phases in each update. It connects to the source database using a Unity Catalog connection, captures the initial snapshot on the first run, and captures incremental changes on subsequent runs using the database's built-in change tracking. It writes the extracted data to a staging volume and then applies the changes to the destination streaming tables.

The following table compares the two architectures.

| Aspect | Standard CDC (gateway-based) | Integrated CDC |
|---|---|---|
| Number of pipelines | Two (gateway and ingestion pipeline) | One (unified pipeline) |
| Setup | Create gateway, then create pipeline | Create a single pipeline referencing a connection |
| Gateway mode | Gateway runs continuously | Pipeline performs extraction in each update |
| Connection reference | `ingestion_gateway_id` | `connection_name` |
| Staging volume | Managed internally by the gateway | You configure it or the pipeline creates one |
| Connector type | Implicit | Explicit: `connector_type: CDC` |

The integrated CDC pipeline is simpler to set up because it does not require a separate gateway. It runs in either triggered or continuous mode. In triggered mode, the pipeline runs on a schedule. It extracts changes, applies them, and stops automatically after it has caught up with the source, bounded by a maximum runtime. This is called smart closure. In continuous mode, the pipeline runs as an always-on stream. The following YAML example shows an integrated CDC pipeline configuration.

```yaml
# Integrated CDC pipeline configuration.
# The pipeline connects directly to the source database using a connection.
resources:
  pipelines:
    integrated_cdc_pipeline:
      name: integrated-cdc-pipeline
      catalog: sales
      schema: bronze
      ingestion_definition:
        # The connection stores the source credentials.
        connection_name: sqlserver_connection
        # The connector type is explicitly set to CDC.
        connector_type: CDC
        # The staging volume is configured through data_staging_options.
        # If not specified, the pipeline creates one automatically.
        data_staging_options:
          catalog: sales
          schema: staging
        objects:
          - table:
              source_schema: dbo
              source_table: customers
              destination_catalog: sales
              destination_schema: bronze
```

The example configures an integrated CDC pipeline that connects directly to SQL Server using a Unity Catalog connection. The `connector_type` is explicitly set to `CDC`. The staging volume is configured to use the `sales.staging` schema. The pipeline extracts changes from the source and applies them to the destination tables in `sales.bronze`. The pipeline guarantees exactly-once semantics. Each update extracts changes, applies them, and stops after it has caught up with the source.

## Applying changes with the AUTO CDC API

The AUTO CDC API in Lakeflow Spark Declarative Pipelines is the recommended way to apply CDC changes to a target table. It replaces the older APPLY CHANGES API and has the same syntax. The API automates the complexity of computing slowly changing dimensions. You specify the keys that identify records, the sequence column for ordering changes, and whether to store results as SCD type 1 or SCD type 2. The API handles out-of-order records automatically. It is safer to use than a manual `MERGE INTO` statement, which can produce incorrect results when records arrive out of order.

The following SQL example shows the AUTO CDC syntax.

```sql
-- Create a streaming table that applies CDC changes.
-- The target table is a streaming table in Unity Catalog.
-- The FLOW AUTO CDC clause processes CDC records from the source.
-- The KEYS clause names the columns that uniquely identify a row.
-- The SEQUENCE BY clause names the column that orders changes.
-- The STORED AS clause specifies SCD type 2 for history tracking.
CREATE OR REFRESH STREAMING TABLE sales.silver.customers
FLOW AUTO CDC
FROM STREAM(sales.bronze.customers_cdc)
KEYS (customer_id)
SEQUENCE BY last_modified
STORED AS SCD TYPE 2;
```

The example creates a streaming table `sales.silver.customers` that applies CDC changes from `sales.bronze.customers_cdc`. The `KEYS` clause uses `customer_id` to identify records. The `SEQUENCE BY` clause uses `last_modified` to order changes. The `STORED AS SCD TYPE 2` clause stores the history of changes. The API automatically handles inserts, updates, and deletes. For deletes, you can specify an `APPLY AS DELETE WHEN` condition. The following SQL example shows a more complete configuration.

```sql
-- Create a streaming table with full CDC configuration.
-- The APPLY AS DELETE WHEN clause treats events with operation = 'DELETE'
-- as deletes rather than upserts.
-- The IGNORE NULL UPDATES clause retains existing values when the
-- incoming value is null, which is useful for partial updates.
CREATE OR REFRESH STREAMING TABLE sales.silver.customers
FLOW AUTO CDC
FROM STREAM(sales.bronze.customers_cdc)
KEYS (customer_id)
SEQUENCE BY last_modified
APPLY AS DELETE WHEN operation = 'DELETE'
IGNORE NULL UPDATES
STORED AS SCD TYPE 2;
```

The example adds the `APPLY AS DELETE WHEN` clause, which treats events where `operation` is `'DELETE'` as deletes. The `IGNORE NULL UPDATES` clause retains existing values when the incoming value is null. This is useful for partial updates where the source only sends the columns that changed.

## SCD type 1 and SCD type 2

The SCD type setting determines how the target table handles changes. SCD type 1 overwrites existing records. The target table always reflects the current state of the source. SCD type 2 preserves historical versions. When a row changes, the previous version is marked inactive and a new version is added. The target table includes `__START_AT` and `__END_AT` columns that record each version's active period. SCD type 2 is essential when you need to answer questions about the past, such as what a customer's address was when they placed an order.

The following table compares the two SCD types.

| Aspect | SCD type 1 | SCD type 2 |
|---|---|---|
| History | Not preserved | Preserved |
| Rows per entity | One | Multiple versions |
| Extra columns | None | `__START_AT`, `__END_AT` |
| Current version query | No filter needed | `__END_AT IS NULL` |
| Typical use | Current state | Historical tracking |

The following SQL example creates an SCD type 2 table and queries the current version.

```sql
-- Create an SCD type 2 table.
CREATE OR REFRESH STREAMING TABLE sales.silver.customers
FLOW AUTO CDC
FROM STREAM(sales.bronze.customers_cdc)
KEYS (customer_id)
SEQUENCE BY last_modified
STORED AS SCD TYPE 2;

-- Query the current version of each customer.
-- __END_AT IS NULL indicates the active record.
SELECT customer_id, name, address, __START_AT, __END_AT
FROM sales.silver.customers
WHERE __END_AT IS NULL;
```

The equivalent PySpark query reads the SCD type 2 table and filters to the current version.

```python
# Import the col function.
from pyspark.sql.functions import col

# Read the SCD type 2 table.
df_customers = spark.read.table("sales.silver.customers")

# Filter to the current version of each record.
# __END_AT IS NULL indicates an active record.
df_current = df_customers.filter(col("__END_AT").isNull())

# Display the current records.
display(df_current)
```

The queries show how to retrieve the current state from an SCD type 2 table. To query a historical state, you filter on `__START_AT <= point_in_time AND (__END_AT > point_in_time OR __END_AT IS NULL)`.

## The sequence_by column and out-of-order data

The `SEQUENCE BY` column determines the logical order of changes. It is required for SCD type 2 and for handling out-of-order data. When multiple changes occur for the same primary key, the connector uses the sequence column to determine which change is the most recent. Without a sequence column, changes may be applied in the order they arrive, which can produce incorrect results if they arrive out of order. The sequence column must be sortable, such as a `last_modified` timestamp or a version number.

The following SQL example specifies the sequence column.

```sql
-- Create a streaming table with a sequence column.
-- The SEQUENCE BY clause names the column that orders changes.
-- The column must be sortable and must be updated on every change.
CREATE OR REFRESH STREAMING TABLE sales.silver.orders
FLOW AUTO CDC
FROM STREAM(sales.bronze.orders_cdc)
KEYS (order_id)
SEQUENCE BY last_modified
STORED AS SCD TYPE 1;
```

The example uses `last_modified` as the sequence column. If two changes have the same `last_modified` value, the order is not deterministic. You should choose a column that is unique for each change or that has a tie-breaking mechanism. The `SYSTEM SEQUENCE BY` clause is an alternative that uses a system-generated sequence when the source does not provide a reliable sequence column.

## Staging volumes and data flow

The CDC pipeline writes extracted data to a staging volume before applying changes to the destination table. The staging volume is a Unity Catalog volume that temporarily stores the extracted changes. The pipeline reads from the staging volume and applies the changes using the configured primary keys and SCD type. The staging volume is created automatically if you do not specify one. Data is automatically purged from staging after 30 days. The following YAML example shows how to configure the staging volume.

```yaml
# Configure the staging volume for an integrated CDC pipeline.
# The data_staging_options block specifies the catalog and schema
# where the staging volume is created.
# If not specified, the pipeline creates a staging volume automatically.
ingestion_definition:
  data_staging_options:
    catalog: sales
    schema: staging
```

The example configures the staging volume to use the `sales.staging` schema. The pipeline writes extracted changes to this volume and then reads them back to apply to the destination table. The staging volume is required even if you do not specify it, because the pipeline needs a place to store the extracted data before applying it.

## Exactly-once semantics

The CDC pipeline guarantees exactly-once semantics. Each change is processed exactly once, even in the presence of failures. The pipeline tracks its progress using checkpoints. If a pipeline update fails, it resumes from the last checkpoint and continues processing. The merge operations use the configured primary keys and SCD type to apply changes idempotently. If a change is processed more than once, the result is the same as if it were processed once. This is essential for data integrity. Without exactly-once semantics, a pipeline that fails and restarts could duplicate rows or miss changes.

## Null handling, case sensitivity, and time zones

Null handling in CDC ingestion depends on the source and the configuration. The `IGNORE NULL UPDATES` clause retains existing values when the incoming value is null. This is useful for partial updates where the source only sends the columns that changed. Without this clause, null values overwrite existing values. You should decide whether nulls represent missing data or actual null values, and configure the pipeline accordingly. In SCD type 2 tables, nulls in the sequence column can cause issues. Ensure that the sequence column is not null for changes that should be applied.

Case sensitivity affects primary keys and sequence columns. By default, Spark's string comparisons are case-sensitive. If the source has inconsistent casing in a key column, the CDC pipeline may not match records correctly. Normalize the case of keys before ingesting, or use a case-insensitive collation if the table is configured for one. Unity Catalog supports collations at the column level.

Time zones affect timestamps. Spark stores timestamps internally in UTC and displays them in the session time zone. The CDC pipeline writes timestamps in UTC. When you query the data, the session time zone determines how the timestamps are displayed. Set the session time zone explicitly to UTC at the start of your job with `spark.conf.set("spark.sql.session.timeZone", "UTC")`. Use timestamp literals with explicit offsets when comparing to timestamps.

## Best practices

Enable CDC on the source database before creating the pipeline. The pipeline cannot capture changes if CDC is not enabled. Verify that the source user has the permissions needed to read the transaction log.

Choose the right SCD type. Use SCD type 1 when you only need the current state. Use SCD type 2 when you need to track history. SCD type 2 produces multiple rows per entity, so queries must filter on `__END_AT IS NULL` to get the current version.

Use a reliable sequence column. The sequence column must be sortable and must be updated on every change. If the source does not provide a reliable sequence column, use `SYSTEM SEQUENCE BY`.

Configure the staging volume deliberately. If you do not specify a staging volume, the pipeline creates one automatically. Specify the catalog and schema to control where the staging data lives and who can access it.

Use continuous mode for low-latency ingestion. Continuous mode runs the pipeline as an always-on stream. Use triggered mode with smart closure for cost-sensitive workloads. Smart closure stops the pipeline after it catches up with the source.

Monitor the pipeline. Track metrics such as rows ingested, latency, and errors. Set up alerts for failures and for latency spikes.

## Common mistakes and pitfalls

The most common mistake is not enabling CDC on the source database. The pipeline cannot capture changes if CDC is not enabled. Verify the source configuration before creating the pipeline.

A second mistake is using a sequence column that is not updated on every change. If the sequence column is not reliable, changes may be applied out of order, and the target table may reflect the wrong state.

A third mistake is forgetting that SCD type 2 creates multiple rows per entity. Queries that do not filter on `__END_AT IS NULL` return historical versions and may produce incorrect aggregations.

A fourth mistake is using the wrong SCD type. SCD type 1 overwrites existing records and does not preserve history. SCD type 2 preserves history but produces more rows. Choose the type that matches your requirements.

A fifth mistake is not configuring the staging volume. The staging volume is required even if you do not specify it. If you do not configure it, the pipeline creates one automatically, but you may not have control over its location or permissions.

A sixth mistake is not handling deletes. By default, CDC events are treated as upserts. Use `APPLY AS DELETE WHEN` to treat specific events as deletes.

A seventh mistake is not setting the session time zone. Timestamps are stored in UTC. If you compare them to local time without converting, you may get incorrect results.

## Testing CDC ingestion

Test CDC ingestion with a small source database and a target table that you can inspect. Simulate inserts, updates, and deletes, and verify that they appear correctly in the target table. The following SQL example tests a CDC pipeline.

```sql
-- Create a source table for testing.
CREATE TABLE IF NOT EXISTS tmp.source_customers (
  customer_id INT,
  name STRING,
  address STRING,
  last_modified TIMESTAMP,
  operation STRING
);

-- Insert an initial record.
INSERT INTO tmp.source_customers VALUES (1, 'Alice', '123 Main St', current_timestamp(), 'INSERT');

-- Run the CDC pipeline to ingest the initial record.
-- Verify that the target table contains the record.

-- Update the record.
INSERT INTO tmp.source_customers VALUES (1, 'Alice', '456 Oak Ave', current_timestamp(), 'UPDATE');

-- Run the CDC pipeline again.
-- Verify that the target table reflects the update.

-- Delete the record.
INSERT INTO tmp.source_customers VALUES (1, 'Alice', '456 Oak Ave', current_timestamp(), 'DELETE');

-- Run the CDC pipeline again.
-- Verify that the target table reflects the delete.
```

The test verifies that inserts, updates, and deletes are applied correctly. Run tests like this in your CI pipeline against a small local Spark session. Clean up temporary tables after the test.

## Performance considerations

CDC ingestion is more efficient than snapshot ingestion for large tables because it reads only the changes. The load on the source database is minimal because CDC reads the transaction log rather than querying tables. The pipeline's compute cost depends on the volume of changes and the complexity of the merge operations.

Use continuous mode for low-latency ingestion. Continuous mode runs the pipeline as an always-on stream. Use triggered mode with smart closure for cost-sensitive workloads. Smart closure stops the pipeline after it catches up with the source, reducing idle compute.

The staging volume adds a small amount of storage overhead. Data is purged after 30 days. The staging volume should be in a location with low latency to the compute.

Target table performance depends on file size and partitioning. The pipeline writes to Delta tables. It may create many small files during incremental ingestion. Run `OPTIMIZE` periodically to compact small files. Use partitioning or liquid clustering on columns that are commonly used in filters.

Monitor the pipeline duration and latency. Set up alerts for failures and for latency spikes. Use Unity Catalog to track lineage and audit access.

## An end-to-end example

Consider a scenario where you need to replicate a MySQL `orders` table into Unity Catalog using CDC. The source table has columns `order_id`, `customer_id`, `order_date`, `amount`, and `last_modified`. You want to maintain a current-state view and a historical view. The pipeline uses an integrated CDC connector and the AUTO CDC API.

```yaml
# Integrated CDC pipeline for MySQL orders.
resources:
  pipelines:
    mysql_orders_pipeline:
      name: mysql-orders-pipeline
      catalog: sales
      schema: bronze
      ingestion_definition:
        connection_name: mysql_connection
        connector_type: CDC
        data_staging_options:
          catalog: sales
          schema: staging
        objects:
          - table:
              source_schema: sales
              source_table: orders
              destination_catalog: sales
              destination_schema: bronze
```

```sql
-- Create a current-state table using SCD type 1.
CREATE OR REFRESH STREAMING TABLE sales.silver.orders_current
FLOW AUTO CDC
FROM STREAM(sales.bronze.orders_cdc)
KEYS (order_id)
SEQUENCE BY last_modified
APPLY AS DELETE WHEN operation = 'DELETE'
STORED AS SCD TYPE 1;

-- Create a historical table using SCD type 2.
CREATE OR REFRESH STREAMING TABLE sales.silver.orders_history
FLOW AUTO CDC
FROM STREAM(sales.bronze.orders_cdc)
KEYS (order_id)
SEQUENCE BY last_modified
APPLY AS DELETE WHEN operation = 'DELETE'
STORED AS SCD TYPE 2;
```

The example creates two tables from the same CDC source. The `orders_current` table uses SCD type 1 and reflects the current state of each order. The `orders_history` table uses SCD type 2 and preserves the history of changes. Both tables are in Unity Catalog and are governed by the same access controls. The pipeline handles inserts, updates, and deletes. It guarantees exactly-once semantics and stops automatically after it catches up with the source.

## Summary

Ingesting data from a CDC feed means capturing inserts, updates, and deletes from a source database and applying them to a target table in Unity Catalog. Change data capture reads the database transaction log, which is the authoritative record of every change. This makes ingestion more efficient than full snapshots and captures deletes, which snapshots miss. Lakeflow Connect database connectors provide managed CDC ingestion for MySQL, PostgreSQL, and SQL Server. The connectors write extracted changes to a staging volume and apply them to destination streaming tables using configured primary keys and SCD types.

Integrated CDC pipelines combine extraction and application into a single pipeline. They connect to the source using a Unity Catalog connection and perform extraction in each pipeline update. The pipeline writes to a staging volume and applies changes to the destination. Exactly-once semantics are guaranteed. The pipeline runs in triggered mode with smart closure or in continuous mode for low-latency ingestion.

The AUTO CDC API in Lakeflow Spark Declarative Pipelines applies CDC changes to a target table. You specify the keys, the sequence column, and the SCD type. SCD type 1 overwrites existing records and reflects the current state. SCD type 2 preserves historical versions and includes `__START_AT` and `__END_AT` columns. The `SEQUENCE BY` column orders changes and handles out-of-order data. The `IGNORE NULL UPDATES` clause retains existing values when the incoming value is null.

Null handling, case sensitivity, and time zones affect CDC ingestion. Set the session time zone explicitly to UTC. Normalize string casing. Handle nulls deliberately. Best practices include enabling CDC on the source, choosing the right SCD type, using a reliable sequence column, configuring the staging volume, using continuous mode for low latency, and monitoring the pipeline. Common mistakes include not enabling CDC, using an unreliable sequence column, forgetting that SCD type 2 creates multiple rows per entity, and not handling deletes.

Test CDC ingestion with small source databases and verify that inserts, updates, and deletes are applied correctly. Performance depends on the volume of changes and the complexity of the merge. Use continuous mode or triggered mode with smart closure. Compact small files in the target table. By understanding CDC ingestion with Lakeflow Connect and the AUTO CDC API, you can replicate operational data into Unity Catalog with low latency, complete history, and exactly-once guarantees.
