# Notion API Proxy

A Node.js Express API proxy that forwards requests to the Notion API with proper authentication and headers.

## Features

- Proxies requests to Notion's `/databases` endpoints
- Automatically adds required `Authorization` and `Notion-Version` headers
- Built with Express.js and Axios
- Ready for deployment on Render

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

3. The server will run on port 3000 (or the PORT environment variable)

## API Endpoints

- `GET /` - Health check endpoint
- `ALL /databases/*` - Proxy to Notion API databases endpoints

## Usage Examples

### Health Check
```bash
curl http://localhost:3000/
```

### List Databases (requires valid Notion token)
```bash
curl http://localhost:3000/databases \
  -H "Content-Type: application/json"
```

## Deployment

This app is ready for deployment on Render. The `PORT` environment variable is automatically configured.

## Environment Variables

- `PORT` - Server port (default: 3000)

## License

MIT
