# MongoDB Atlas Search Setup

This module uses MongoDB Atlas Search for fast, efficient full-text search across lecturers and campuses.

## Features

- **Fast Full-Text Search**: Leverages MongoDB Atlas Search for optimal performance
- **Fuzzy Matching**: Tolerates typos with up to 2 character edits
- **Fallback Support**: Automatically falls back to regex search if Atlas Search is not configured
- **Relevance Scoring**: Returns results with search relevance scores
- **Multi-Field Search**: Searches across name, department, courses, and descriptions

## Search Behavior

### 1. Campus-Only Search

```
GET /search?campusName=Addis Ababa
```

Searches for campuses matching "Addis Ababa" across name, address, and description fields.

### 2. Lecturer-Only Search

```
GET /search?lecturerName=John
```

Searches for lecturers matching "John" across name, department, and courses fields.

### 3. Narrowed Search (Both Parameters)

```
GET /search?lecturerName=John&campusName=Addis Ababa University
```

Searches for lecturers matching "John" specifically at "Addis Ababa University".

## MongoDB Atlas Search Index Setup

For optimal performance, create the following search indexes in MongoDB Atlas:

### Campus Search Index

1. Go to MongoDB Atlas → Database → Search
2. Click "Create Search Index"
3. Select your database and `campuses` collection
4. Use the following configuration:

```json
{
  "name": "campus_search",
  "mappings": {
    "dynamic": false,
    "fields": {
      "name": {
        "type": "string",
        "analyzer": "lucene.standard"
      },
      "address": {
        "type": "string",
        "analyzer": "lucene.standard"
      },
      "description": {
        "type": "string",
        "analyzer": "lucene.standard"
      }
    }
  }
}
```

### Lecturer Search Index

1. Go to MongoDB Atlas → Database → Search
2. Click "Create Search Index"
3. Select your database and `lecturers` collection
4. Use the following configuration:

```json
{
  "name": "lecturer_search",
  "mappings": {
    "dynamic": false,
    "fields": {
      "name": {
        "type": "string",
        "analyzer": "lucene.standard"
      },
      "university": {
        "type": "string",
        "analyzer": "lucene.standard"
      },
      "department": {
        "type": "string",
        "analyzer": "lucene.standard"
      },
      "courses": {
        "type": "string",
        "analyzer": "lucene.standard"
      }
    }
  }
}
```

## Fallback Behavior

If MongoDB Atlas Search indexes are not configured, the service automatically falls back to regex-based searching. This ensures the search functionality works in all environments:

- **Development**: Works without Atlas Search configuration
- **Production**: Recommended to use Atlas Search for better performance

## Response Format

All search responses include:

```json
{
  "type": "campus" | "lecturer",
  "query": "search string" | { "lecturerName": "string", "campusName": "string" },
  "results": [...],
  "count": number
}
```

Each result includes a `score` field indicating search relevance (higher is better).

## Performance Considerations

- Results are limited to 20 items for performance
- Fuzzy matching allows up to 2 character edits
- Index creation typically takes a few minutes
- Search queries are cached by MongoDB for repeated searches

## Troubleshooting

### Search Returns Empty Results

1. Verify index names match exactly: `campus_search` and `lecturer_search`
2. Ensure indexes are in "Active" state in Atlas
3. Check that your MongoDB connection has proper permissions

### Slow Search Performance

1. Verify Atlas Search indexes are created and active
2. Check MongoDB Atlas cluster tier (M10+ recommended for production)
3. Monitor index usage in Atlas metrics

### Error: "Atlas Search not configured"

The system will automatically fall back to regex search. This is expected in development environments without Atlas.
