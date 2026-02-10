# Database Seeding Scripts

## Seed Universities

This script populates the database with Ethiopian universities from `universities.json`.

### Prerequisites

- MongoDB connection must be configured in your environment
- The database should be running
- The Campus module must be properly set up

### Usage

Run the seeding script using:

```bash
pnpm run seed:universities
```

Or using npm:

```bash
npm run seed:universities
```

### What it does

1. Reads all universities from `universities.json`
2. Transforms the address object into a formatted string: "City, Region, Zone"
3. Creates each university as a campus entry in the database
4. Provides detailed feedback for each operation
5. Shows a summary of successes and failures

### Output

The script will show:

- ✓ for each successfully added university
- ✗ for any failures with error messages
- A final summary with counts

### Data Structure

The script expects `universities.json` to contain an array of objects with:

```json
{
  "name": "University Name",
  "address": {
    "city": "City Name",
    "region": "Region Name",
    "zone": "Zone Name"
  },
  "description": "University description"
}
```

### Notes

- The script uses `createApplicationContext` to access services without starting the full HTTP server
- Duplicate entries may cause errors if the database has unique constraints
- The script will continue processing even if some entries fail
