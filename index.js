const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Notion API configuration
const NOTION_API_BASE_URL = 'https://api.notion.com/v1';
const NOTION_TOKEN = 'ntn_T99702586045G0e8QQbZ9Ae2LGi97XSlnRZLy9SKfLt9ln';
const NOTION_VERSION = '2022-06-28';

// Middleware to parse JSON bodies
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Notion API Proxy is running',
    endpoints: ['/databases']
  });
});

// Proxy endpoint for Notion databases
app.all('/databases*', async (req, res) => {
  try {
    // Extract the path after /databases
    const notionPath = req.path.replace('/databases', '/databases');
    const notionUrl = `${NOTION_API_BASE_URL}${notionPath}`;
    
    // Prepare headers for Notion API
    const headers = {
      'Authorization': `Bearer ${NOTION_TOKEN}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json'
    };

    // Forward the request to Notion API
    const response = await axios({
      method: req.method,
      url: notionUrl,
      headers: headers,
      data: req.body,
      params: req.query
    });

    // Forward the response back to client
    res.status(response.status).json(response.data);
    
  } catch (error) {
    console.error('Proxy error:', error.message);
    
    if (error.response) {
      // Forward Notion API errors
      res.status(error.response.status).json(error.response.data);
    } else {
      // Handle network or other errors
      res.status(500).json({
        error: 'Proxy error',
        message: 'Failed to connect to Notion API'
      });
    }
  }
});

// 404 handler for unsupported endpoints
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'This proxy only supports /databases endpoints'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Notion API Proxy running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/`);
  console.log(`Proxy endpoint: http://localhost:${PORT}/databases`);
});

module.exports = app;