const express = require('express');
const http = require('http');
const app = express();
const port = process.env.port || 8080;

let isWorkerFree = true;
let id = 0;
const jobs = [];

setInterval(() => {
  if (isWorkerFree && jobs.length > 0) {
    const job = jobs.shift();
    delegateToWorker(id, job);
  }
}, 1000);

const getWorkerOptions = () => {
  return {
    host: 'localhost',
    port: '5000',
    method: 'POST',
  };
};

app.use((req, res, next) => {
  console.log(`${req.url} ${req.method}`);
  next();
});

app.post('/process/completedJob/:id/:tags', (req, res) => {
  console.log(req.params);
  isWorkerFree = true;
  res.end();
});

const delegateToWorker = function (id, {name, count, height, width, tags}) {
  const options = getWorkerOptions();
  options.path = `/process/${id}/${count}/${height}/${width}/${tags}`;
  const req = http.request(options, (res, err) => {
    console.log('Got from worker', res.statusCode);
  });
  isWorkerFree = false;
  req.end();
};

app.post('/process/:name/:count/:height/:width/:tags', (req, res) => {
  jobs.push(req.params);
  res.send(`${id}`);
  res.end();
  id++;
});

app.listen(port, () => console.log(`app is listening on port ${port}`));
