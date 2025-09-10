# Notion GPT Proxy

A Node.js proxy server that forwards requests to the Notion API with proper authentication and headers.

## Features

- Proxies requests to `/databases` endpoints
- Automatically adds required Authorization and Notion-Version headers
- CORS enabled for browser requests
- Deploy-ready for Render platform

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set environment variables (optional):
```bash
export NOTION_TOKEN=your_notion_token_here
export PORT=3000
```

3. Start the server:
```bash
npm start
```

## Usage

### Health Check
```bash
GET /
```
Returns server status and available endpoints.

### Database Queries
```bash
GET /databases
POST /databases/query
GET /databases/{database_id}
```

All requests to `/databases*` are proxied to the Notion API with proper authentication.

## Deployment on Render

1. Connect your GitHub repository to Render
2. Set the following environment variables in Render:
   - `NOTION_TOKEN`: Your Notion integration token
3. Render will automatically detect this as a Node.js app and deploy it

The server will run on the port specified by Render's `PORT` environment variable.

## API Examples

### List databases (requires proper Notion token with database access):
```bash
curl -X GET https://your-render-app.onrender.com/databases
```

### Query a database:
```bash
curl -X POST https://your-render-app.onrender.com/databases/{database_id}/query \
  -H "Content-Type: application/json" \
  -d '{"page_size": 10}'
```

## Environment Variables

- `PORT`: Server port (default: 3000)
- `NOTION_TOKEN`: Notion API token (fallback to hardcoded token for demo)

## Security Notes

For production use, always set the `NOTION_TOKEN` environment variable instead of using the hardcoded token.
