
# SlotSwapper - Backend

This folder contains a complete backend implementation for the SlotSwapper assignment.

## Quick start

1. Install Node.js (>=16) and MongoDB (or use Atlas).
2. Copy `.env.example` to `.env` and fill values.
3. Install dependencies:
   ```
   cd backend
   npm install
   ```
4. Run in development:
   ```
   npm run dev
   ```
5. API base: `http://localhost:5000`

## Features
- User signup/login with JWT
- Event CRUD (create/update/delete)
- Swap request creation and response with transaction safety
- Endpoints:
  - POST /api/auth/signup
  - POST /api/auth/login
  - GET /api/events
  - POST /api/events
  - PUT /api/events/:id
  - DELETE /api/events/:id
  - GET /api/swappable-slots
  - POST /api/swap-request
  - POST /api/swap-response/:id
  - GET /api/requests

## Notes
- Uses mongoose transactions. For transactions to work with a local MongoDB, ensure you're running a replica set (even a single-node replica set).
- The Postman collection is at `backend/postman_collection.json`.

