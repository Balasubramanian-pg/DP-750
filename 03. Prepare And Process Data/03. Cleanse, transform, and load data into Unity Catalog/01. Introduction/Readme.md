# Introduction

Raw data rarely arrives in a format ready for analysis. Missing values, duplicate records, inconsistent data types, and poorly structured datasets are common challenges that data engineers must address before data can deliver business value. Without proper cleansing and transformation, analytics results become unreliable and downstream processes fail. Unity Catalog in Azure Databricks provides the governance foundation for managing transformed data assets throughout this process. This module explores the comprehensive toolkit that Azure Databricks offers for data quality and transformation work. It covers data profiling, type selection, duplicate and null handling, transformation operations, advanced reshaping techniques, and loading strategies. Each topic is essential for building reliable data pipelines that produce trustworthy data for analytics and machine learning.

The journey from raw data to analytics-ready data is not a single step. It is a series of deliberate actions. You must first understand the data. You must profile it to discover its characteristics. You must identify problems such as nulls, duplicates, outliers, and inconsistent types. You must decide how to handle each problem. You must transform the data into a shape that supports your analytical questions. You must load it into a target table using a strategy that matches your use case. Throughout this process, you must maintain governance. You must track lineage, control access, and ensure that data is auditable. Unity Catalog provides this governance layer. It integrates with Delta Lake, the storage format that underpins most Databricks workloads. It provides a unified namespace for data and metadata. It enforces access control. It tracks lineage. It supports auditing. By using Unity Catalog, you ensure that your transformed data assets are governed from the moment they are created.

## Data profiling

Data profiling is the first step in understanding your data. It generates summary statistics that reveal issues like null percentages, unexpected value distributions, and data drift. Profiling helps you answer questions such as: How many nulls are in each column? What are the minimum and maximum values? What is the average? What are the distinct values? How are values distributed? Are there outliers? Has the distribution changed over time? These questions are critical for designing effective cleansing and transformation logic.

In Azure Databricks, you can profile data using SQL, PySpark, or built-in profiling tools. The simplest way to get summary statistics is to use the `summary()` method on a DataFrame or the `DESCRIBE` statement in SQL. The `summary()` method computes count, mean, standard deviation, minimum, maximum, and percentiles for numeric columns. For string columns, it computes count, unique count, top values, and frequency. The following PySpark example shows how to profile a DataFrame. Each line is commented.

```python
# Read a table from Unity Catalog.
df = spark.read.table("catalog.schema.raw_customers")

# Compute summary statistics.
# The summary method returns a DataFrame with statistics.
# The statistics include count, mean, stddev, min, max, and percentiles.
# For string columns, it includes count, unique, top, and freq.
summary_df = df.summary()

# Display the summary statistics.
# The show method prints the results to the console.
# The truncate parameter controls whether to truncate long strings.
summary_df.show(truncate=False)
```

In SQL, you can use the `DESCRIBE` statement or the `SUMMARIZE` statement. The `DESCRIBE` statement returns the schema of a table. The `SUMMARIZE` statement returns summary statistics similar to the PySpark `summary()` method. The following SQL example shows how to summarize a table.

```sql
-- Summarize the raw_customers table.
-- The SUMMARIZE statement returns count, mean, stddev, min, max, and percentiles for numeric columns.
-- For string columns, it returns count, unique, top, and freq.
SUMMARIZE catalog.schema.raw_customers;
```

For more advanced profiling, you can use the Databricks Data Profiling feature. This feature is available in the Databricks UI. It generates a profile report that includes null counts, distinct counts, data types, and distribution charts. You can access it from the table details page. You can also use the `dbutils.data.summarize()` function in a notebook to generate a profile report. The following Python example shows how to use `dbutils.data.summarize()`.

```python
# Read a table.
df = spark.read.table("catalog.schema.raw_customers")

# Generate a profile report.
# The summarize method displays an interactive profile report.
# The report includes statistics and charts for each column.
dbutils.data.summarize(df)
```

Profiling is not a one-time activity. You should profile your data regularly. Data drift occurs when the statistical properties of data change over time. For example, the average transaction amount might increase. The distribution of customer ages might shift. New categories might appear in a categorical column. By profiling regularly, you can detect drift and take action. You can compare profiles over time. You can set up alerts when key metrics change beyond a threshold. You can use the profiling results to update your data quality expectations.

## Type selection

Type selection is the process of ensuring that columns use appropriate data types. The right data type improves storage efficiency and query performance. It also prevents errors. For example, storing a date as a string prevents date arithmetic. Storing a number as a string prevents aggregation. Storing a boolean as a string prevents logical operations. Choosing the right type is important for correctness and performance.

In Delta Lake and Unity Catalog, you can define the schema of a table explicitly. You can specify the data type for each column. When you write data to the table, Delta Lake enforces the schema. If the incoming data does not match the schema, Delta Lake attempts a safe cast. If the cast fails, the write fails. This is schema enforcement. It protects the table from type mismatches. It ensures that the data always conforms to the expected types.

To select the right type, consider the following guidelines. Use integer types for whole numbers. Use `INT` for values up to about 2 billion. Use `BIGINT` for larger values. Use `SMALLINT` or `TINYINT` for small values to save storage. Use `DECIMAL` for exact numeric values, such as money. Specify the precision and scale. For example, `DECIMAL(10,2)` for amounts up to 99,999,999.99. Use `DOUBLE` or `FLOAT` for approximate numeric values, such as scientific measurements. Use `STRING` for text. Use `DATE` for dates. Use `TIMESTAMP` for date and time. Use `BOOLEAN` for true/false values. Use `ARRAY`, `MAP`, and `STRUCT` for nested data. Use `BINARY` for binary data.

When you read raw data, it often arrives as strings. You need to cast the strings to the correct types. You can use the `cast` function in SQL or the `cast` method in PySpark. You can use `try_cast` to safely cast and return null on failure. The following PySpark example shows how to cast columns to the correct types. Each line is commented.

```python
from pyspark.sql.functions import col

# Read raw data.
df = spark.read.table("catalog.schema.raw_transactions")

# Cast columns to the correct types.
# The cast method converts the column to the specified type.
# If the conversion fails, an error is raised.
# Use try_cast if you want to return null on failure.
df_casted = df.withColumn("amount", col("amount").cast("decimal(10,2)")) \
              .withColumn("transaction_date", col("transaction_date").cast("date")) \
              .withColumn("quantity", col("quantity").cast("int")) \
              .withColumn("is_active", col("is_active").cast("boolean"))

# Write the casted data to a new table.
df_casted.write.saveAsTable("catalog.schema.clean_transactions")
```

In SQL, you can use the `CAST` function. The following SQL example shows how to cast columns in a SELECT statement.

```sql
-- Cast columns to the correct types.
SELECT
    transaction_id,
    CAST(amount AS DECIMAL(10,2)) AS amount,
    CAST(transaction_date AS DATE) AS transaction_date,
    CAST(quantity AS INT) AS quantity,
    CAST(is_active AS BOOLEAN) AS is_active
FROM catalog.schema.raw_transactions;
```

Type selection also involves schema evolution. As source systems change, new columns may appear, and existing columns may change type. Delta Lake supports schema evolution. You can enable it when writing data. You can also use Auto Loader with schema evolution modes. Type selection is not a one-time decision. You should review your schema regularly and update it as needed.

## Duplicate and null handling

Duplicate records and null values are among the most common data quality problems. Duplicates can skew aggregations and lead to incorrect results. Nulls can cause errors in calculations and can make joins and filters unpredictable. Handling duplicates and nulls is a core part of data cleansing.

To identify duplicates, you can use the `GROUP BY` clause or the `dropDuplicates` method. To identify nulls, you can use the `IS NULL` condition or the `isNull` method. The following SQL example shows how to find duplicate records. Each line is commented.

```sql
-- Find duplicate records based on customer_id.
SELECT
    customer_id,
    COUNT(*) AS duplicate_count
FROM catalog.schema.raw_customers
GROUP BY customer_id
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;
```

To remove duplicates, you can use the `ROW_NUMBER()` window function or the `dropDuplicates` method. The following PySpark example shows how to remove duplicates based on a key column, keeping the most recent record. Each line is commented.

```python
from pyspark.sql.window import Window
from pyspark.sql.functions import row_number, col

# Read raw data.
df = spark.read.table("catalog.schema.raw_customers")

# Define a window partitioned by customer_id and ordered by updated_at descending.
# This assigns row number 1 to the most recent record for each customer.
window_spec = Window.partitionBy("customer_id").orderBy(col("updated_at").desc())

# Add a row number column.
df_with_row_num = df.withColumn("row_num", row_number().over(window_spec))

# Keep only the most recent record for each customer.
df_deduplicated = df_with_row_num.filter(col("row_num") == 1).drop("row_num")

# Write the deduplicated data.
df_deduplicated.write.saveAsTable("catalog.schema.clean_customers")
```

To handle nulls, you have several options. You can drop rows with nulls. You can fill nulls with a default value. You can impute nulls with a statistical measure such as mean or median. You can leave nulls and handle them in downstream queries. The right choice depends on the column and the business requirement. The following SQL example shows how to fill nulls with a default value. Each line is commented.

```sql
-- Fill nulls in the email column with 'unknown@example.com'.
SELECT
    customer_id,
    name,
    COALESCE(email, 'unknown@example.com') AS email
FROM catalog.schema.raw_customers;
```

The following PySpark example shows how to fill nulls using the `fillna` method. Each line is commented.

```python
# Read raw data.
df = spark.read.table("catalog.schema.raw_customers")

# Fill nulls in the email column.
df_filled = df.fillna({"email": "unknown@example.com"})

# Fill nulls in numeric columns with 0.
df_filled = df_filled.fillna({"amount": 0, "quantity": 0})

# Write the filled data.
df_filled.write.saveAsTable("catalog.schema.clean_customers")
```

You can also drop rows with nulls. The following PySpark example shows how to drop rows where the customer_id is null.

```python
# Drop rows where customer_id is null.
df_dropped = df.dropna(subset=["customer_id"])
```

When handling duplicates and nulls, you should document your decisions. Why did you choose to drop rather than fill? Why did you choose a particular default value? Documenting these decisions helps others understand the data. It also helps with auditing and compliance.

## Transformation operations

Transformation operations reshape data to meet analytical requirements. The core operations include filtering, grouping, aggregation, joins, and set operators. These operations are the building blocks of data pipelines. They are used to clean, combine, and summarize data.

Filtering selects a subset of rows based on a condition. In SQL, you use the `WHERE` clause. In PySpark, you use the `filter` or `where` method. The following SQL example shows how to filter rows where the amount is greater than 100.

```sql
SELECT *
FROM catalog.schema.transactions
WHERE amount > 100;
```

The following PySpark example shows the same filter. Each line is commented.

```python
# Read the transactions table.
df = spark.read.table("catalog.schema.transactions")

# Filter rows where amount is greater than 100.
df_filtered = df.filter(df.amount > 100)

# Display the results.
df_filtered.show()
```

Grouping and aggregation summarize data. In SQL, you use `GROUP BY` and aggregate functions such as `SUM`, `AVG`, `COUNT`, `MIN`, `MAX`. In PySpark, you use the `groupBy` method and the `agg` method. The following SQL example shows how to compute total sales per customer.

```sql
SELECT
    customer_id,
    SUM(amount) AS total_sales,
    COUNT(*) AS transaction_count
FROM catalog.schema.transactions
GROUP BY customer_id;
```

The following PySpark example shows the same aggregation. Each line is commented.

```python
from pyspark.sql.functions import sum, count

# Read the transactions table.
df = spark.read.table("catalog.schema.transactions")

# Group by customer_id and compute total sales and transaction count.
df_agg = df.groupBy("customer_id").agg(
    sum("amount").alias("total_sales"),
    count("*").alias("transaction_count")
)

# Display the results.
df_agg.show()
```

Joins combine data from two or more tables. In SQL, you use the `JOIN` clause. In PySpark, you use the `join` method. The following SQL example shows how to join customers and transactions.

```sql
SELECT
    c.customer_id,
    c.name,
    t.transaction_id,
    t.amount
FROM catalog.schema.customers c
JOIN catalog.schema.transactions t
ON c.customer_id = t.customer_id;
```

The following PySpark example shows the same join. Each line is commented.

```python
# Read the customers and transactions tables.
customers = spark.read.table("catalog.schema.customers")
transactions = spark.read.table("catalog.schema.transactions")

# Join the tables on customer_id.
df_joined = customers.join(transactions, on="customer_id", how="inner")

# Display the results.
df_joined.show()
```

Set operators combine the results of two queries. In SQL, you use `UNION`, `UNION ALL`, `INTERSECT`, and `EXCEPT`. In PySpark, you use the `union`, `intersect`, and `subtract` methods. The following SQL example shows how to combine two tables with `UNION ALL`.

```sql
SELECT * FROM catalog.schema.transactions_2025
UNION ALL
SELECT * FROM catalog.schema.transactions_2026;
```

The following PySpark example shows the same union. Each line is commented.

```python
# Read the two tables.
df_2025 = spark.read.table("catalog.schema.transactions_2025")
df_2026 = spark.read.table("catalog.schema.transactions_2026")

# Union the two DataFrames.
df_union = df_2025.union(df_2026)

# Display the results.
df_union.show()
```

These transformation operations are the foundation of data preparation. You can chain them together to build complex pipelines. You can use them to clean, enrich, and summarize data.

## Advanced reshaping techniques

Beyond basic transformations, you will work with advanced reshaping techniques. These include denormalization, pivoting, and unpivoting. These techniques change the shape of the data to support specific analytical needs.

Denormalization flattens related tables for faster query performance. In a normalized schema, data is spread across multiple tables. To answer a question, you may need to join several tables. Joins can be expensive. Denormalization combines the tables into a single table. This reduces the need for joins. It can improve query performance. However, it can also increase storage and create data redundancy. The following SQL example shows how to denormalize customers and transactions into a single table.

```sql
CREATE OR REPLACE TABLE catalog.schema.denormalized_transactions AS
SELECT
    c.customer_id,
    c.name,
    c.email,
    t.transaction_id,
    t.amount,
    t.transaction_date
FROM catalog.schema.customers c
JOIN catalog.schema.transactions t
ON c.customer_id = t.customer_id;
```

The following PySpark example shows the same denormalization. Each line is commented.

```python
# Read the tables.
customers = spark.read.table("catalog.schema.customers")
transactions = spark.read.table("catalog.schema.transactions")

# Join the tables.
df_denormalized = customers.join(transactions, on="customer_id", how="inner")

# Select the columns for the denormalized table.
df_denormalized = df_denormalized.select(
    "customer_id", "name", "email",
    "transaction_id", "amount", "transaction_date"
)

# Write the denormalized table.
df_denormalized.write.saveAsTable("catalog.schema.denormalized_transactions")
```

Pivoting rotates row values into columns for cross-tabular analysis. In SQL, you use the `PIVOT` clause. In PySpark, you use the `pivot` method. The following SQL example shows how to pivot sales data by quarter.

```sql
SELECT *
FROM (
    SELECT
        product_id,
        quarter,
        sales
    FROM catalog.schema.quarterly_sales
)
PIVOT (
    SUM(sales)
    FOR quarter IN ('Q1', 'Q2', 'Q3', 'Q4')
);
```

The following PySpark example shows the same pivot. Each line is commented.

```python
# Read the quarterly sales table.
df = spark.read.table("catalog.schema.quarterly_sales")

# Pivot the data.
# The groupBy is product_id.
# The pivot column is quarter.
# The aggregation is sum of sales.
df_pivoted = df.groupBy("product_id").pivot("quarter").sum("sales")

# Display the results.
df_pivoted.show()
```

Unpivoting reverses the pivot process. It rotates columns into rows. In SQL, you can use the `UNPIVOT` clause or a `UNION ALL` query. In PySpark, you can use the `stack` function or a `UNION ALL` query. The following SQL example shows how to unpivot quarterly sales.

```sql
SELECT
    product_id,
    quarter,
    sales
FROM (
    SELECT
        product_id,
        Q1,
        Q2,
        Q3,
        Q4
    FROM catalog.schema.pivoted_sales
)
UNPIVOT (
    sales
    FOR quarter IN (Q1, Q2, Q3, Q4)
);
```

The following PySpark example shows the same unpivot using `stack`. Each line is commented.

```python
from pyspark.sql.functions import expr

# Read the pivoted sales table.
df = spark.read.table("catalog.schema.pivoted_sales")

# Unpivot the data using stack.
# The stack function takes pairs of column names and values.
# It creates a new row for each pair.
df_unpivoted = df.select(
    "product_id",
    expr("stack(4, 'Q1', Q1, 'Q2', Q2, 'Q3', Q3, 'Q4', Q4) as (quarter, sales)")
)

# Display the results.
df_unpivoted.show()
```

These reshaping techniques are powerful. They allow you to present data in the format that best supports your analysis. You should use them judiciously. Denormalization can improve performance but can also increase storage and complexity. Pivoting and unpivoting can make data easier to read but can also make it harder to maintain. Always consider the tradeoffs.

## Loading strategies

Finally, loading strategies ensure that transformed data lands correctly in target tables. The main strategies are append, overwrite, and merge. Each strategy is appropriate for different scenarios. Append adds new records to the target table. It does not modify existing records. It is useful when you are adding new data, such as daily transactions. Overwrite replaces the entire target table with the new data. It is useful when you are rebuilding a table from scratch. Merge performs an upsert. It updates existing records and inserts new records. It is useful when you are synchronizing changes from a source system.

In Delta Lake, you can use the `mode` option in PySpark to specify append or overwrite. You can use the `MERGE` statement in SQL to perform an upsert. The following PySpark example shows how to append data. Each line is commented.

```python
# Read the new transactions.
df_new = spark.read.table("catalog.schema.new_transactions")

# Append the data to the target table.
df_new.write.mode("append").saveAsTable("catalog.schema.transactions")
```

The following PySpark example shows how to overwrite data. Each line is commented.

```python
# Read the full dataset.
df_full = spark.read.table("catalog.schema.full_transactions")

# Overwrite the target table.
df_full.write.mode("overwrite").saveAsTable("catalog.schema.transactions")
```

The following SQL example shows how to merge data. Each line is commented.

```sql
-- Merge new transactions into the target table.
MERGE INTO catalog.schema.transactions AS target
USING catalog.schema.new_transactions AS source
ON target.transaction_id = source.transaction_id
WHEN MATCHED THEN UPDATE SET *
WHEN NOT MATCHED THEN INSERT *;
```

You can also use schema evolution with these strategies. For example, you can use `mergeSchema` with append or overwrite. You can use `MERGE WITH SCHEMA EVOLUTION` with merge. Schema evolution allows new columns to be added automatically. You should use it carefully and monitor the changes.

When choosing a loading strategy, consider the following. Use append when you are adding new records and you do not need to modify existing records. Use overwrite when you are rebuilding the table and you do not need to preserve the old data. Use merge when you need to synchronize changes, including updates and deletes. Merge is more expensive than append or overwrite because it compares the source and target. But it is necessary when you need to keep the target table up to date.

You should also consider idempotency. If your pipeline can rerun, you want to avoid creating duplicates. Append can create duplicates if you rerun the same batch. Overwrite is idempotent because it replaces the entire table. Merge can be idempotent if you use a unique key. You should design your loading strategy to be idempotent when possible.

## Bringing it all together with Unity Catalog

Unity Catalog provides the governance foundation for all these activities. When you create tables in Unity Catalog, you get a unified namespace. You can reference tables using a three-level namespace: catalog.schema.table. You can control access using grants. You can track lineage automatically. You can audit access and changes. You can use Delta Sharing to share data securely. You can use Unity Catalog to manage all your data assets, including tables, views, functions, and models.

When you profile data, you can store the profiling results in Unity Catalog tables. When you cleanse data, you can create new tables in Unity Catalog. When you transform data, you can use Unity Catalog tables as sources and targets. When you load data, you can use Unity Catalog tables as targets. Unity Catalog ensures that all these activities are governed and auditable.

By the end of this module, you will understand how to assess data quality through profiling, apply cleansing techniques to resolve common issues, transform data using SQL and PySpark operations, and load the results into Unity Catalog tables with the appropriate strategy for each scenario. You will have the knowledge and skills to build reliable data pipelines that deliver high-quality data for analytics and machine learning. You will understand how to use Unity Catalog to govern your data assets. You will be able to apply these techniques to real-world data engineering problems.

The journey from raw data to analytics-ready data is challenging but rewarding. With the right tools and practices, you can overcome the challenges and deliver data that drives business value. Azure Databricks and Unity Catalog provide the platform. Your skills and judgment provide the rest.

## Navigation

- Previous: None
- Next: [02. Profile data with summary statistics](02.%20Profile%20data%20with%20summary%20statistics.md)

## Source

Microsoft Learn: [Introduction](https://learn.microsoft.com/en-us/training/modules/cleanse-transform-load-data-into-unity-catalog/1-introduction)
