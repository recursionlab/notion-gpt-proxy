const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Notion API configuration
const NOTION_API_BASE_URL = 'https://api.notion.com/v1';
const NOTION_TOKEN = process.env.NOTION_TOKEN || 'ntn_T99702586045G0e8QQbZ9Ae2LGi97XSlnRZLy9SKfLt9ln';
const NOTION_VERSION = '2022-06-28';

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Notion GPT Proxy is running',
    endpoints: ['/databases']
  });
});

// Proxy endpoint for /databases
app.all('/databases*', async (req, res) => {
  try {
    const path = req.path;
    const query = req.query;
    
    // Build the target URL
    const targetUrl = `${NOTION_API_BASE_URL}${path}`;
    
    // Prepare headers
    const headers = {
      'Authorization': `Bearer ${NOTION_TOKEN}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json'
    };

    // Forward any additional headers from the original request (except host and authorization)
    Object.keys(req.headers).forEach(key => {
      if (!['host', 'authorization', 'notion-version'].includes(key.toLowerCase())) {
        headers[key] = req.headers[key];
      }
    });

    // Make the request to Notion API
    const response = await axios({
      method: req.method.toLowerCase(),
      url: targetUrl,
      headers: headers,
      data: req.body,
      params: query,
      validateStatus: () => true // Don't throw on HTTP error status codes
    });

    // Forward the response
    res.status(response.status).json(response.data);

  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(500).json({
      error: 'Proxy error',
      message: 'Failed to forward request to Notion API'
    });
  }
});

// 404 handler for unsupported endpoints
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'This proxy only supports /databases endpoints',
    supportedEndpoints: ['/databases']
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Notion GPT Proxy server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/`);
  console.log(`Databases proxy: http://localhost:${PORT}/databases`);
});

module.exports = app;