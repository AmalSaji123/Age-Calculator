# MERN Invoice Generator

Full-stack invoice generator with PDF export and send-by-email.

## Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

## Setup

### Server
1. Copy server env and fill values:
   ```bash
   cp /workspace/server/.env.example /workspace/server/.env
   ```
2. Install and run:
   ```bash
   cd /workspace/server && npm install && npm run dev
   ```

### Client
1. Copy client env and adjust API URL if needed:
   ```bash
   cp /workspace/client/.env.example /workspace/client/.env
   ```
2. Install and run:
   ```bash
   cd /workspace/client && npm install && npm run dev
   ```

Open client at http://localhost:5173

## Email
Configure SMTP in server `.env` to enable sending invoices via email. Example uses port 587 (STARTTLS). For Gmail or other providers, use app passwords.

## Endpoints
- `GET /api/invoices`
- `POST /api/invoices`
- `GET /api/invoices/:id`
- `PUT /api/invoices/:id`
- `DELETE /api/invoices/:id`
- `GET /api/invoices/:id/pdf` (inline PDF)
- `POST /api/invoices/:id/send` (body: `{ to: "email@example.com" }`)
