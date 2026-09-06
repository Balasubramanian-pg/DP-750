# Module assessment

Completed

* 5 minutes

## Check your knowledge

1.

What is the primary advantage of using Lakeflow Connect for data ingestion compared to writing custom extraction code?

Lakeflow Connect provides faster query performance on ingested data

Lakeflow Connect offers managed connectors that handle change data capture and pipeline orchestration automatically

Lakeflow Connect requires fewer Unity Catalog permissions than notebook-based ingestion

2.

Which SQL command should a data engineer use to continuously load new files from cloud storage without reprocessing files that have already been ingested?

CREATE TABLE AS SELECT with the read\_files function

CREATE OR REPLACE TABLE

COPY INTO

3.

What is the purpose of the sequence column in a change data capture (CDC) flow?

To determine the correct order of changes when records arrive out of order

To specify which columns should be included in the destination table

To identify which records should be treated as deletes

4.

Which trigger mode should be used when a data engineer wants to process all available streaming data and then stop the stream?

processingTime trigger with a short interval

availableNow trigger

Default trigger with no configuration

5.

What happens when Auto Loader detects new columns in source files while using the addNewColumns schema evolution mode?

The stream ignores the new columns and continues processing without changes

The stream fails, new columns are added to the schema, and the stream continues with the updated schema on restart

The new columns are captured in the \_rescued\_data column without modifying the schema

6.

What is the primary benefit of using explicit flows in Lakeflow Spark Declarative Pipelines to ingest data from multiple sources into a single table?

Explicit flows process data faster than UNION-based approaches

Explicit flows allow adding new source flows without modifying existing ones or triggering a full refresh

Explicit flows automatically deduplicate records from multiple sources

You must answer all questions before checking your work.




You must answer all questions before checking your work.

---

## Navigation

- Previous: [[09 - Exercise]]
- Next: [[11 - Summary]]

## Source

Microsoft Learn: [Knowledge check](https://learn.microsoft.com/en-us/training/modules/ingest-data-into-unity-catalog/10-knowledge-check)
