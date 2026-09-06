# Module assessment

Completed

* 5 minutes

## Check your knowledge

1.

What happens when Delta Lake's schema enforcement encounters a string value that cannot be cast to the target column's integer type?

The value is automatically converted to NULL

The write operation raises an error

The value is stored as a string in a rescued data column

2.

Which function should be used to convert values between data types when invalid values should return NULL instead of raising an error?

cast()

convert()

try\_cast()

3.

What is the purpose of the rescuedDataColumn option when using Auto Loader to handle schema drift?

To store column names that have been renamed in the source

To capture data that does not match the expected schema without blocking the pipeline

To automatically correct data type errors in the source files

4.

What action does the expect\_or\_drop expectation take when a record violates the defined constraint?

Logs a warning and writes the record to the target table

Stops the pipeline and rolls back any partial updates

Removes the record before writing to the target table

5.

Which constraint type should be added to a Delta Lake table to ensure that a price column always contains positive values?

NOT NULL constraint

CHECK constraint

PRIMARY KEY constraint

6.

What is the behavior when a Lakeflow Spark Declarative Pipeline has multiple parallel flows and one flow encounters an expect\_or\_fail expectation violation?

All flows in the pipeline stop immediately

Only the flow with the violation stops while other flows continue

The pipeline pauses all flows and waits for manual intervention

You must answer all questions before checking your work.




You must answer all questions before checking your work.

---

## Navigation

- Previous: [[06 - Exercise]]
- Next: [[08 - Summary]]

## Source

Microsoft Learn: [Knowledge check](https://learn.microsoft.com/en-us/training/modules/implement-manage-data-quality-constraints-unity-catalog/7-knowledge-check)
