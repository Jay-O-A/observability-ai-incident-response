const express = require('express');
const client = require('prom-client');
const app = express();
const port = process.env.PORT || 3001;

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

const httpRequests = new client.Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method','route','status']
});

app.get('/', (req, res) => {
  httpRequests.inc({ method: 'GET', route: '/', status: '200' });
  res.send('Hello from sample app');
});

// simulate endpoint that errors sometimes
app.get('/error', (req, res) => {
  httpRequests.inc({ method: 'GET', route: '/error', status: '500' });
  res.status(500).send('Error!');
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Sample app listening on http://0.0.0.0:${port}`);
});
