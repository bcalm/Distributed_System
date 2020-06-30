const express = require('express');
const app = express();

const jobs = [];

app.use((req, res, next) => {
  console.log(`${req.url} ${req.method}`);
  next();
});

app.get('/request-job', (req, res) => {
  let job = {};
  if (jobs.length) {
    job = { id: jobs.shift() };
  }
  res.write(JSON.stringify(job));
  res.end();
});

app.post('/queue-job/:id', (req, res) => {
  jobs.push(req.params.id);
  res.end();
});

app.listen('8000', () => console.log('QB is listening on: 8000'));
