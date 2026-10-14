This script is an **automated data generator for a Databricks training environment**.

When you run the main `setup(spark)` function at the bottom, it builds a single Unity Catalog (`trainer_demo`) and populates it with **11 different mini-databases (schemas)**, each representing a different industry (Retail, Healthcare, Finance, etc.).

Instead of loading external CSV or JSON files, it uses Python's `random` library to invent fake, realistic-looking data on the fly and saves it as **Delta tables**. Importantly, in the later modules, it **intentionally injects "bad data"** (like missing IDs, negative prices, and duplicates) so students can practice data cleaning, governance, and pipeline building.

---

### Step-by-Step Pattern (What each function does)

Every `setup_XX` function follows the exact same 4-step recipe:

1. **Creates a folder structure:** Sets up a Schema (`demo_01`, `demo_02`, etc.) and sometimes a Databricks **Volume** (used for storing raw files or libraries).
2. **Wipes the slate clean:** Runs `DROP TABLE IF EXISTS` so the script can be re-run safely without duplicating data or crashing.
3. **Invents fake rows:** Loops hundreds or thousands of times in Python to generate fake names, dates, and numbers, then locks them into a strict PySpark table structure (`StructType`).
4. **Saves to Delta:** Writes the generated DataFrame directly into Databricks as a managed Delta table (`saveAsTable`).

---

### Breakdown of the 11 Modules

| Function / Schema | Industry | Tables & Volumes Created | What It's Designed to Teach |
| --- | --- | --- | --- |
| **`setup_01`**<br>

<br>(`demo_01`) | **Basic E-Commerce** | • **Tables:** `orders` (1k rows)<br>

<br>• **Volume:** `landing` | Basic queries, working with Unity Catalog, and landing raw files in Volumes. |
| **`setup_02`**<br>

<br>(`demo_02`) | **Healthcare** | • **Tables:** `patient_visits`, `lab_results`, `medical_devices`<br>

<br>• **Volume:** `shared_libraries` | Multi-table joins, conditional logic (categorizing lab results into Low/Normal/High), and managing custom Python wheels/libraries. |
| **`setup_03`**<br>

<br>(`demo_03`) | **Higher Education** | • **Tables:** `students`, `courses`, `enrollments`, `assessments`<br>

<br>• **Volume:** `course_materials` | Classic relational data modeling (many-to-many relationships between students and courses) and aggregations. |
| **`setup_04`**<br>

<br>(`demo_04`) | **Retail** | • **Tables:** `customers`, `products`, `stores`, `transactions` | **Data Governance & Security:** Contains fake PII (emails, phone numbers) and regional mappings meant for practicing **Column Masking** and **Row-Level Security (RLS)**. |
| **`setup_05`**<br>

<br>(`demo_05`) | **Automotive IoT** | • **Tables:** `vehicles`, `customers`, `telemetry_events`, `service_records` | Combining static customer PII with high-volume IoT sensor logs (engine temp, speed, battery warnings). |
| **`setup_06`**<br>

<br>(`demo_06`) | **Financial Services** | • **Tables:** `clients`, `accounts`, `trades`, `market_data`, `client_staging` | **SCD Type 2 & Performance:** Includes a `client_staging` table with 50 updated records and 10 new ones specifically to practice `MERGE INTO` (Slowly Changing Dimensions), plus large trade tables for **Liquid Clustering / Partitioning**. |
| **`setup_07`**<br>

<br>(`demo_07`) | **Renewable Energy** | • **Tables:** `energy_sites`, `turbines`, `turbine_readings` (50k rows), `turbine_events`, `market_prices`<br>

<br>• **Volumes:** `sensor_data_landing`, `market_prices_landing` | **Change Data Capture (CDC):** The `turbine_events` table explicitly mimics a CDC change feed (`INSERT`, `UPDATE`, `DELETE` operations with sequence numbers). |
| **`setup_08`**<br>

<br>(`demo_08`) | **Real Estate (NL)** | • **Tables:** `agents`, `properties`, `property_updates` | **Data Cleaning & Schema Optimization:** Intentionally injects ~10% `NULL` values, 30 exact duplicate rows, suboptimal data types (`DoubleType` for money instead of `DECIMAL`), and an updates table for `MERGE` practice. |
| **`setup_09`**<br>

<br>(`demo_09`) | **Insurance** | • **Tables:** `policies`, `raw_claims`, `raw_policies` | **Data Quality Expectations (DLT/Lakeflow):** `raw_claims` is full of traps—negative claim amounts, future dates, missing policy IDs, and invalid categories—to test quarantine and validation rules. |
| **`setup_10`**<br>

<br>(`demo_10`) | **Hospitality** | • **Tables:** `raw_guests`, `raw_reservations` | **Medallion Architecture (Bronze-to-Silver):** Simulates messy nightly exports where check-out dates occur *before* check-in dates, loyalty points are negative, and emails are malformed. |
| **`setup_11`**<br>

<br>(`demo_11`) | **Telecom** | • **Tables:** `subscriber_profiles`, `network_events`, `raw_cdr` (50k rows) | **Lakeflow Jobs / Orchestration:** Simulates massive Call Detail Records (`raw_cdr`) with corrupted subscriber IDs and negative call durations to test automated pipeline error handling. |
