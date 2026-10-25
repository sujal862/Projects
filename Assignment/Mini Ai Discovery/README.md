
---

# Agent Discovery + Usage Platform

This is a simple in-memory implementation of an Agent Discovery and Usage Platform built using FastAPI as part of an internship assignment.

---

## Running the Application

Make sure FastAPI and Uvicorn are installed, then run:

```bash
pip install fastapi uvicorn pydantic
uvicorn main:app --reload
```

---

## Design Decisions

1. **Storage Structure**
   I used basic Python data structures like dictionaries and sets. They are fast and easy to work with, which keeps the project simple without adding database complexity.

2. **Validation**
   I used Pydantic models for request validation. This helps catch missing fields automatically and keeps the API code clean.

3. **Idempotency Handling**
   I stored all `request_id`s in a set to prevent duplicate usage logs. If the same request comes again, it is ignored.

4. **Tag Extraction (Bonus)**
   Instead of using heavy libraries, I implemented simple keyword extraction using string cleaning and removing common stop words.

---

## Example Requests

You can test the APIs locally after starting the server:

```bash
uvicorn main:app --reload
```

### 1. Create an Agent

```bash
curl -X POST "http://127.0.0.1:8000/agents" \
-H "Content-Type: application/json" \
-d '{"name": "DocParser", "description": "Extracts structured data from PDFs", "endpoint": "https://api.docparser.com"}'
```

### 2. List All Agents

```bash
curl -X GET "http://127.0.0.1:8000/agents"
```

### 3. Search for an Agent

```bash
curl -X GET "http://127.0.0.1:8000/search?q=structured"
```

### 4. Log Usage Activity

*(Try running this twice to test idempotency)*

```bash
curl -X POST "http://127.0.0.1:8000/usage" \
-H "Content-Type: application/json" \
-d '{"caller": "AgentA", "target": "DocParser", "units": 10, "request_id": "abc123"}'
```

### 5. Get Usage Summary

```bash
curl -X GET "http://127.0.0.1:8000/usage-summary"
```

---
