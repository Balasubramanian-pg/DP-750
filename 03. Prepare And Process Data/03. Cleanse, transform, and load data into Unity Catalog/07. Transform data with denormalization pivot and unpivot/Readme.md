## Transform data with denormalization pivot and unpivot

Denormalization is the deliberate reversal of normalization. Normalization organizes data into many small tables, each holding one type of fact or dimension, so that no information is stored redundantly. Denormalization combines those tables back into fewer, wider tables, accepting some redundancy in exchange for faster and simpler queries. Pivot and unpivot are reshaping operations that change the orientation of a table without changing its information. Pivoting turns rows into columns, moving values from a column into new column headers. Unpivoting does the reverse, turning columns into rows. Together, denormalization, pivot, and unpivot are the tools you use to reshape data for analysis, reporting, and machine learning.

These operations matter because the shape of your data determines how easy it is to query. A normalized schema is excellent for transactional systems, where data is written frequently and consistency is critical. It is poor for analytics, where queries must join many tables and scan large volumes. A denormalized, wide table is the opposite: it is expensive to maintain because updates must be propagated, but it is fast to query because all the needed columns are in one place. Pivot and unpivot matter because reports and visualizations often need a specific orientation. A dashboard might need one column per month, which requires a pivot. A machine learning model might need one row per observation, which requires an unpivot. The ability to reshape data without changing its meaning is essential for building data products.

These notes cover denormalization, pivot, and unpivot from first principles. They explain what normalization is and why analytics reverses it. They show how to denormalize with joins and aggregations, how to pivot rows into columns in SQL and PySpark, and how to unpivot columns into rows. They cover null handling, case sensitivity, and time zone behavior as they affect reshaping. They also cover performance considerations, the relationship to Delta Lake, Unity Catalog, and the medallion architecture, and the schema enforcement and evolution issues that arise when you write reshaped data. Each concept is introduced in prose, then shown in code with full comments, then interpreted. The goal is that you can read these notes alone and understand not only how to reshape data, but when reshaping is the right approach and how to avoid the mistakes that make reshaped data misleading.

## Understanding normalization and denormalization

Normalization is a design technique that organizes data into tables so that each fact is stored once. In a normalized schema, a customers table holds customer attributes, a products table holds product attributes, and an orders table holds order facts with foreign keys to the customers and products tables. The goal is to eliminate redundancy and prevent update anomalies. If a customer changes their address, you update one row in the customers table, and every order that references that customer automatically reflects the new address. Normalization is the default for transactional systems because it keeps data consistent.

Denormalization is the deliberate introduction of redundancy to improve query performance. In a denormalized schema, you might store the customer name and address directly on each order row, so that a query for orders and customer details does not need to join two tables. The redundancy means that if the customer changes their address, you must update every order row, or accept that historical orders show the address as it was at the time of the order. The latter is often desirable. A denormalized fact table is sometimes called a wide table because it contains many columns. A star schema is a partially denormalized design in which one central fact table joins to several dimension tables, each of which is denormalized. A snowflake schema normalizes the dimension tables further.

In a medallion architecture, normalization and denormalization serve different layers. The bronze layer holds raw data as it arrived, often normalized or semi-structured. The silver layer holds cleaned, conformed data, often still normalized to avoid redundancy. The gold layer holds denormalized, aggregated data optimized for specific queries. Denormalization happens as data moves from silver to gold. A silver orders table might join to a silver customers table to produce a gold orders table that contains customer name, region, and segment directly on each order. This gold table is larger than the silver orders table, but it answers the business question without a join.

| Aspect | Normalized | Denormalized |
|---|---|---|
| Redundancy | Minimal | Some duplication |
| Query complexity | Many joins | Few or no joins |
| Write complexity | Simple updates | Updates may need propagation |
| Storage | Smaller | Larger |
| Read performance | Slower for analytics | Faster for analytics |
| Best for | Transactional systems | Analytical systems |

The table shows the tradeoff. Normalization optimizes for writes and consistency. Denormalization optimizes for reads and simplicity. Neither is universally better. The choice depends on whether the workload is transactional or analytical. In Databricks, the workloads are almost always analytical, so denormalization is common in the gold layer.

## Denormalizing with joins and aggregations

Denormalization is not a single operation. It is a design choice that you implement with joins, aggregations, and sometimes pivots. The most common form is a join that adds columns from a dimension table to a fact table. The second most common form is an aggregation that collapses many rows into one, producing a summary table. The third form is a pivot that turns values into columns. These operations can be combined in a single pipeline.

The following example shows a denormalization pipeline that joins orders to customers and products, then aggregates the result to produce a gold table. The pipeline uses a left join to keep all orders, and it selects only the columns needed for the final table.

```python
# Import the functions needed for the denormalization pipeline.
# col() references a column by name.
# sum() and count() are aggregate functions.
from pyspark.sql.functions import col, sum, count

# Read the silver orders, customers, and products tables.
# Silver tables are cleaned and conformed but still normalized.
df_orders = spark.read.table("sales.orders_silver")
df_customers = spark.read.table("sales.customers_silver")
df_products = spark.read.table("sales.products_silver")

# Step 1: Join orders to customers on customer_id.
# A left join keeps all orders, even those with a missing customer.
# The join adds customer_name and region to each order.
df_enriched = df_orders.join(
    df_customers,
    on="customer_id",
    how="left"
)

# Step 2: Join the result to products on product_id.
# Again, a left join keeps all orders.
# The join adds product_name and category.
df_enriched = df_enriched.join(
    df_products,
    on="product_id",
    how="left"
)

# Step 3: Select only the columns needed for the gold table.
# Column pruning reduces the size of the result and makes the schema explicit.
df_gold = df_enriched.select(
    "order_id",
    "order_date",
    "customer_id",
    "customer_name",
    "region",
    "product_id",
    "product_name",
    "category",
    "order_amount"
)

# Step 4: Write the denormalized data to a gold Delta table.
# mode("overwrite") replaces the table on each run.
df_gold.write.mode("overwrite").saveAsTable("sales.orders_gold")
```

The example shows a four-step pipeline. The first two steps join the fact table to two dimension tables. The third step selects the needed columns. The fourth step writes the result. The gold table is denormalized because it contains customer and product attributes directly on each order row. A query for orders by region no longer needs to join the customers table. The cost is storage and the need to refresh the gold table when the dimension tables change. In a medallion architecture, the gold table is refreshed on a schedule, often daily or hourly.

Denormalization through aggregation is similar, but it collapses rows rather than adding columns. An aggregation groups the fact table by one or more dimensions and computes summary statistics. The result is a smaller table that answers a specific question. The following SQL example produces a daily sales summary by region and category.

```sql
-- Create a gold table with daily sales by region and category.
-- The aggregation collapses many order rows into one row per group.
CREATE OR REPLACE TABLE sales.daily_sales_gold AS
SELECT
  order_date,
  region,
  category,
  -- Count the orders in each group.
  COUNT(*) AS order_count,
  -- Sum the order amounts, ignoring nulls.
  SUM(order_amount) AS total_revenue,
  -- Compute the average order amount, ignoring nulls.
  AVG(order_amount) AS avg_order_value
FROM sales.orders_gold
-- Group by the date, region, and category.
GROUP BY order_date, region, category;
```

The query produces a table with one row per date, region, and category. The table is both denormalized and aggregated. It is denormalized because it contains the region and category names directly. It is aggregated because it contains summary statistics rather than individual orders. This is the shape that dashboards and reports consume.

## Pivoting rows into columns

Pivoting is the operation of turning the values of one column into new columns. In a pivoted table, each distinct value of the pivot column becomes a column header, and the values in those columns come from an aggregate function applied to the remaining rows. Pivoting is used for cross-tabulation reports, where you want one row per category and one column per sub-category. For example, you might want one row per region and one column per order status, with the count of orders in each cell.

In SQL, pivoting is expressed with a `CASE` expression inside an aggregate function, or with the `PIVOT` clause if the SQL dialect supports it. Spark SQL supports the `PIVOT` clause. The following example pivots order counts by region and status.

```sql
-- Pivot order counts by region and status.
-- The PIVOT clause turns the distinct values of order_status into columns.
-- The FOR clause names the pivot column.
-- The IN clause lists the values that become columns.
SELECT *
FROM (
  -- The subquery selects the columns needed for the pivot.
  -- Only region, order_status, and order_id are needed.
  SELECT region, order_status, order_id
  FROM sales.orders
)
-- The PIVOT clause specifies the aggregate and the pivot.
-- COUNT(order_id) counts the orders in each cell.
-- The IN clause lists the status values that become columns.
PIVOT (
  COUNT(order_id)
  FOR order_status IN ('F', 'O', 'P')
);
```

The query produces one row per region and one column per status. The `COUNT(order_id)` aggregate computes the number of orders for each combination of region and status. The `IN` clause lists the status values explicitly. If you do not list a value, it does not become a column, and any rows with that value are excluded. This is important: the `IN` clause filters the data to only the listed values. If you want all values to appear, you must either list them all or use a dynamic pivot, which is not directly supported in Spark SQL. You can generate the list of values in a separate query and then build the pivot statement dynamically.

The following PySpark example produces the same pivot.

```python
# Read the orders table.
df_orders = spark.read.table("sales.orders")

# Group by region and pivot on order_status.
# The pivot() method takes the column whose distinct values become columns.
# The count() aggregation is applied to each pivoted group.
# The result has one row per region and one column per distinct status.
df_pivoted = (
    df_orders
    .groupBy("region")
    .pivot("order_status")
    .count()
)

# Display the pivoted result.
display(df_pivoted)
```

The PySpark `pivot()` method automatically discovers the distinct values of the pivot column and creates one output column for each. This is convenient but can be expensive if the pivot column has many distinct values, because Spark must first compute the distinct values and then perform a second pass to pivot. If you know the distinct values in advance, you can pass them as a list to `pivot()` to avoid the extra pass.

```python
# Pivot with explicit values.
# Passing the list of values avoids the extra pass to discover them.
# Only the listed values become columns.
df_pivoted = (
    df_orders
    .groupBy("region")
    .pivot("order_status", ["F", "O", "P"])
    .count()
)

# Display the result.
display(df_pivoted)
```

Pivoting with explicit values is faster and produces a stable schema. If a new status value appears in the data, it does not create a new column, so downstream code does not break. This is usually the right choice for production pipelines.

## Unpivoting columns into rows

Unpivoting is the reverse of pivoting. It turns columns into rows, converting a wide table into a long table. In a long table, one column holds the former column names, and another column holds the values. Unpivoting is used when you need to normalize a wide table for further processing, or when a visualization requires a long format. For example, a table with one column per month can be unpivoted into a table with one row per month.

In Spark SQL, unpivoting is expressed with the `stack()` function or with a `LATERAL VIEW`. The `stack()` function takes a number and a list of column-value pairs and produces multiple rows. The following example unpivots a wide table with quarterly sales columns into a long table.

```sql
-- Unpivot a wide table with quarterly sales columns.
-- The stack() function produces one row per quarter.
-- The first argument is the number of rows to produce per input row (4).
-- Each subsequent pair is a label and a value expression.
SELECT
  region,
  -- The label column holds the quarter name.
  quarter,
  -- The sales column holds the sales value.
  sales
FROM (
  SELECT region, q1_sales, q2_sales, q3_sales, q4_sales
  FROM sales.quarterly_sales
)
-- stack() creates four rows for each input row.
-- The labels are 'Q1', 'Q2', 'Q3', 'Q4'.
-- The values come from the four sales columns.
LATERAL VIEW stack(
  4,
  'Q1', q1_sales,
  'Q2', q2_sales,
  'Q3', q3_sales,
  'Q4', q4_sales
) AS quarter, sales;
```

The query produces one row per region per quarter. The `stack()` function is the standard way to unpivot in Spark SQL. It is not as elegant as the `UNPIVOT` clause in some other SQL dialects, but it is portable and works in Spark.

In PySpark, the `unpivot()` method on a DataFrame performs the same operation. In older versions of PySpark, you used `melt()`, which was available in some libraries but not in the core API. In Spark 3.4 and later, the `unpivot()` method is available directly on DataFrames.

```python
# Read the quarterly sales table.
df_quarterly = spark.read.table("sales.quarterly_sales")

# Unpivot the four sales columns into rows.
# The ids parameter names the columns that identify each row.
# The values parameter names the columns to unpivot.
# The variableColumnName is the name of the new column that holds
# the former column names.
# The valueColumnName is the name of the new column that holds the values.
df_long = df_quarterly.unpivot(
    ids=["region"],
    values=["q1_sales", "q2_sales", "q3_sales", "q4_sales"],
    variableColumnName="quarter",
    valueColumnName="sales"
)

# Display the long result.
# Each row represents one region and one quarter.
display(df_long)
```

The `unpivot()` method produces the same result as the SQL `stack()` approach. It is more readable and less error-prone because you name the id columns, the value columns, and the output column names explicitly. The resulting long table is easier to aggregate, filter, and visualize because the quarter is a value in a column rather than a column header.

## Null handling in pivot and unpivot

Null handling in pivot and unpivot requires attention. In a pivot, nulls in the pivot column are excluded by default. If the pivot column has null values, they do not become a column, and the rows with nulls are not included in the result. If you want nulls to appear as a column, you must include them explicitly in the `IN` clause or handle them before the pivot. In a PySpark pivot, nulls in the pivot column are also excluded unless you include them in the list of values.

In an unpivot, nulls in the value columns are preserved as nulls in the output. If a value column contains null, the unpivoted row has a null in the value column. This is usually what you want, but you should be aware that nulls are not dropped. If you want to drop rows with null values after unpivoting, you can apply a filter.

The following example shows null handling in a pivot and an unpivot.

```python
# Build a small DataFrame with a null in the pivot column.
from pyspark.sql import Row
df_test = spark.createDataFrame([
    Row(region="East", status="F", order_id=1),
    Row(region="East", status="O", order_id=2),
    Row(region="West", status=None, order_id=3),  # Null status.
])

# Pivot on status without listing values.
# The null status is excluded, so the West row does not appear
# with a null column. Only F and O become columns.
df_pivoted = df_test.groupBy("region").pivot("status").count()
display(df_pivoted)

# Pivot on status with null included in the list.
# The null is treated as a value and becomes a column.
# The column name for the null is "null".
df_pivoted_with_null = df_test.groupBy("region").pivot("status", ["F", "O", None]).count()
display(df_pivoted_with_null)
```

The first pivot excludes the null status, so the West row appears with nulls in the F and O columns because it has no orders with those statuses. The second pivot includes the null, so a column named `null` is created. Including nulls in a pivot is unusual but sometimes necessary for completeness.

## Case sensitivity and time zone behavior

Case sensitivity affects pivot and unpivot when the pivot column or the value columns contain strings. By default, Spark's string comparisons are case-sensitive, so `'F'` and `'f'` are different values. If the pivot column contains inconsistent casing, the pivot produces separate columns for each case. Normalize the casing before the pivot using `upper()` or `lower()`, or use a case-insensitive collation if the table is configured for one. Be aware that applying a function to the pivot column can prevent predicate pushdown and may force a full scan.

Time zones affect pivot and unpivot when the value columns are timestamps. Spark stores timestamps internally in UTC and displays them in the session time zone. When you pivot or unpivot timestamps, the internal UTC values are preserved. The session time zone affects display but not the stored values. If you need to pivot or unpivot by a time component, such as hour of day, extract the component in a specific time zone before the operation.

## Denormalization, pivot, and unpivot in the medallion architecture

In a medallion architecture, denormalization is the primary operation that turns silver data into gold data. Silver tables are normalized and conformed. Gold tables are denormalized and often aggregated. Pivot and unpivot are reshaping operations that support specific gold-layer use cases. A pivot might produce a cross-tabulation report for a dashboard. An unpivot might convert a wide table into a long table for a machine learning feature pipeline.

Delta Lake and Unity Catalog affect these operations in the same way they affect other transformations. Delta Lake enforces the schema of the target table when you write a denormalized or reshaped result. If the pivot produces new columns that are not in the target schema, the write fails unless you enable schema evolution. Use `mergeSchema` only when you intend to evolve the schema, and be aware that downstream consumers may break if new columns appear unexpectedly. Unity Catalog applies row-level filters and column masks before your query runs, so the denormalized result reflects only the rows and column values you are allowed to see. Unity Catalog also records lineage, so you can trace a gold table back to the silver tables it was built from.

A gold table built by denormalization is typically refreshed on a schedule. Because it is denormalized, it may duplicate data from the dimension tables. If a dimension changes, the gold table must be rebuilt or updated. In a medallion architecture, this is handled by a job that runs on a schedule, reads the current silver data, joins and aggregates it, and overwrites the gold table. The gold table is not updated in place row by row; it is rebuilt from the silver data. This is simpler and more reliable than trying to propagate changes through a denormalized table.

## An end-to-end example: building a pivoted gold table

Consider a pipeline that reads silver order data, joins it to customer data to denormalize it, pivots the result to produce a monthly sales report, and writes the result to a gold table. The report should have one row per region and one column per month, with the total sales for each month.

```python
# Import the functions needed for the pipeline.
from pyspark.sql.functions import col, sum, date_format

# Read the silver orders and customers tables.
df_orders = spark.read.table("sales.orders_silver")
df_customers = spark.read.table("sales.customers_silver")

# Step 1: Join orders to customers to denormalize.
# The left join keeps all orders and adds the region.
df_enriched = df_orders.join(
    df_customers,
    on="customer_id",
    how="left"
)

# Step 2: Extract the month from the order date.
# date_format() formats the date as 'yyyy-MM', which becomes the pivot column.
df_with_month = df_enriched.withColumn(
    "order_month",
    date_format(col("order_date"), "yyyy-MM")
)

# Step 3: Pivot on the month and sum the order amounts.
# Only the months listed in the pivot values become columns.
# In production, you would generate this list dynamically or
# use a fixed list for the reporting period.
df_pivoted = (
    df_with_month
    .groupBy("region")
    .pivot("order_month", ["2024-01", "2024-02", "2024-03"])
    .agg(sum("order_amount").alias("total_sales"))
)

# Step 4: Write the pivoted result to a gold table.
df_pivoted.write.mode("overwrite").saveAsTable("sales.monthly_sales_gold")
```

The example produces a gold table with one row per region and one column per month. The pivot turns the month values into column headers. The result is denormalized, aggregated, and reshaped. This is the shape that a monthly sales dashboard consumes.

## Best practices

Denormalize in the gold layer, not in the silver layer. Silver tables should remain normalized and conformed so that they can be reused for many purposes. Gold tables should be denormalized for specific queries. If you denormalize in silver, you lose flexibility and create maintenance problems.

Use explicit pivot values in production. Discovering pivot values automatically requires an extra pass over the data and produces a schema that changes when new values appear. Passing the list of values explicitly is faster and produces a stable schema.

Select only the needed columns before a pivot or unpivot. Pivoting and unpivoting are shuffling operations. Reducing the number of columns and rows before the operation reduces the shuffle size and improves performance.

Handle nulls deliberately. Nulls in the pivot column are excluded by default. If you need them, include them explicitly. Nulls in the value columns are preserved in an unpivot. Decide whether to keep or drop them after the operation.

Use `unpivot()` in PySpark when available. It is more readable and less error-prone than building a `stack()` expression manually. In Spark 3.4 and later, `unpivot()` is available directly on DataFrames.

Document the business meaning of each pivot column. A column named `F` is not self-explanatory. Add a comment or a lookup table that explains what each value means.

## Common mistakes and pitfalls

The most common mistake is assuming that a pivot includes all values of the pivot column. It does not. Only the values listed in the `IN` clause or discovered by the automatic pass become columns. If a value is not listed, the rows with that value are excluded from the result. This can silently drop data. Always verify that the list of pivot values is complete, or generate it dynamically from the data.

A second mistake is pivoting on a high-cardinality column. If the pivot column has hundreds or thousands of distinct values, the pivot produces hundreds or thousands of columns. This is almost never what you want. The result is wide, hard to read, and expensive to produce. If you need to pivot on a high-cardinality column, consider whether a different aggregation or a different report shape would work better.

A third mistake is forgetting that nulls in the pivot column are excluded. If your pivot column contains nulls, those rows are not included in the result. If you need them, include null in the list of values, or handle the nulls before the pivot.

A fourth mistake is using `PIVOT` without an aggregate function. The pivot operation always includes an aggregate. If you do not specify one, the SQL parser may reject the query. In PySpark, the `pivot()` method must be followed by an aggregate method such as `count()`, `sum()`, or `agg()`.

A fifth mistake is unpivoting columns with incompatible types. The `stack()` function and the `unpivot()` method require that all value columns have compatible types. If one column is a string and another is an integer, the unpivot fails or produces unexpected results. Cast the columns to a common type before unpivoting.

A sixth mistake is forgetting that pivoting and unpivoting require a shuffle. These operations redistribute data across the cluster. If the data is large, the shuffle can be expensive. Filter and select before the operation to reduce the data volume.

## Testing pivot and unpivot logic

Pivot and unpivot logic should be tested with small datasets that include nulls, multiple values, and boundary cases. The following example shows a test for a pivot and an unpivot.

```python
# Import the test helpers.
import pytest
from pyspark.sql import Row

# Build a small DataFrame with known values.
# The data includes two regions and three statuses.
test_data = [
    Row(region="East", status="F", order_id=1),
    Row(region="East", status="F", order_id=2),
    Row(region="East", status="O", order_id=3),
    Row(region="West", status="F", order_id=4),
]
df_test = spark.createDataFrame(test_data)

# Pivot on status and count orders.
df_pivoted = df_test.groupBy("region").pivot("status", ["F", "O"]).count()

# Collect the result into a dictionary for assertions.
pivot_result = {
    row.region: (row.F, row.O)
    for row in df_pivoted.collect()
}

# East has two F orders and one O order.
assert pivot_result["East"] == (2, 1), f"East failed: {pivot_result['East']}"
# West has one F order and no O orders. The O count is null.
assert pivot_result["West"] == (1, None), f"West failed: {pivot_result['West']}"
```

The test verifies that the pivot produces the correct counts and that a missing combination produces null. Run tests like this in your CI pipeline against a small local Spark session.

## Performance considerations

Pivot and unpivot are shuffle operations. They redistribute data across the cluster so that rows with the same pivot key end up on the same partition. The shuffle is expensive because it writes data to disk and transfers it over the network. Reducing the amount of data that must be shuffled is the primary way to improve performance.

Filter and select before the pivot or unpivot. A filter that removes half the rows also halves the shuffle size. A select that removes unnecessary columns reduces the amount of data transferred. Always reduce the input before reshaping.

Avoid pivoting on high-cardinality columns. The number of output columns is equal to the number of distinct pivot values. If the pivot column has thousands of distinct values, the result has thousands of columns, which is expensive to produce and difficult to use. If you need to pivot on a high-cardinality column, consider whether a different aggregation or a different report shape would work better.

Use explicit pivot values to avoid an extra pass. When you pass the list of values explicitly, Spark does not need to scan the data to discover the distinct values. This saves a pass and produces a stable schema.

For denormalization joins, use broadcast joins when one side is small. If a dimension table is small enough to fit in memory, Spark can broadcast it to all executors and avoid shuffling the large fact table. This can dramatically improve the performance of a denormalization join.

Delta Lake stores per-file statistics that can help the optimizer skip files during the join or aggregation that precedes a pivot. If the join key or the grouping key aligns with the table's partitioning or clustering columns, Spark can reduce the shuffle. Choose partitioning and clustering columns based on the keys you use most often.

## Summary

Denormalization, pivot, and unpivot are reshaping operations that change the structure of data without changing its meaning. Denormalization combines normalized tables into wider tables to improve query performance. Pivot turns rows into columns, moving values from a column into new column headers. Unpivot turns columns into rows, converting a wide table into a long table.

Normalization organizes data into many small tables to eliminate redundancy. Denormalization deliberately introduces redundancy to improve read performance. In a medallion architecture, silver tables are normalized, and gold tables are denormalized and often aggregated. Denormalization is implemented with joins, aggregations, or both. A denormalized fact table contains dimension attributes directly on each row, so queries do not need to join.

Pivoting is expressed with the `PIVOT` clause in SQL or the `pivot()` method in PySpark. The pivot column's distinct values become columns, and an aggregate function fills the cells. Nulls in the pivot column are excluded by default. Explicit pivot values avoid an extra pass and produce a stable schema. Unpivoting is expressed with the `stack()` function in SQL or the `unpivot()` method in PySpark. Unpivot preserves nulls in the value columns.

Null handling, case sensitivity, and time zones affect reshaping. Nulls in the pivot column are excluded unless included explicitly. String comparisons are case-sensitive by default. Timestamps are stored in UTC and displayed in the session time zone. Delta Lake enforces the schema of the target table when you write a reshaped result. Unity Catalog applies row-level filters and column masks before the operation. Schema evolution should be used only when you intend to evolve the schema.

Best practices include denormalizing in the gold layer, using explicit pivot values in production, selecting only needed columns before reshaping, handling nulls deliberately, and documenting the meaning of pivot columns. Common mistakes include assuming a pivot includes all values, pivoting on high-cardinality columns, forgetting that nulls are excluded, and unpivoting columns with incompatible types. Testing with small datasets that include nulls and multiple values catches errors. Performance depends on the shuffle, so filter and select before reshaping, use broadcast joins for denormalization, and avoid high-cardinality pivots. Used well, denormalization, pivot, and unpivot turn normalized data into the shapes that analysis, reporting, and machine learning require.
