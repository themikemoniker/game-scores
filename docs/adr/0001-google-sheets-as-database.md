# Google Sheets as the database

The Catalog (Games, their Source data and External Ratings) is stored in a Google Sheet rather than a real database. A Next.js server reads it and writes to it through the Sheets API with a service account, and it calls IGDB itself. We chose Sheets so the data is human-readable and editable with no database to run. That's acceptable because the Catalog is small, hand-curated and read-mostly.

## Consequences

- Sheets API calls are slow (hundreds of ms) and rate-limited (about 60 reads per minute per user by default), so the site never reads the Sheet on each page view. Pages are cached and revalidated after a Sync or import.
- There are no transactions or constraints. Concurrent writes are avoided by having a single site owner, and data integrity lives in application code.
- Moving to SQLite or Postgres later means replacing the storage module, not the domain logic. Keep Sheets access behind one module.
