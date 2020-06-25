const express = require('express');
const http = require('http');
const app = express();
const port = process.env.port || 8080;

let id = 0;

const getWorkerOptions = () => {
  return {
    host: 'localhost',
    port: '5000',
    method: 'POST',
  };
};

const delegateToWorker = function (id, {name, count, height, width, tags}) {
  const options = getWorkerOptions();
  options.path = `/process/${id}/${count}/${height}/${width}/${tags}`;
  const req = http.request(options, (res, err) => {
    console.log('Got from worker', res.statusCode);
  });
  req.end();
};

app.use((req, res, next) => {
  console.log(`${req.url} ${req.method}`);
  next();
});

app.post('/process/:name/:count/:height/:width/:tags', (req, res) => {
  delegateToWorker(id, req.params);
  res.send(`${id}`);
  res.end();
  id++;
});

app.listen(port, () => console.log(`app is listening on port ${port}`));
