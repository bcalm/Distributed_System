const express = require('express');
const http = require('http');
const app = express();
const {ImageSets} = require('./imageSets');
const port = process.env.port || 8080;

let isWorkerFree = true;
const jobs = [];
const imageSets = new ImageSets();

setInterval(() => {
  if (isWorkerFree && jobs.length > 0) {
    const job = jobs.shift();
    delegateToWorker(job);
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

app.get('/status/:id', (req, res) => {
  const imageSet = imageSets.get(req.params.id);
  res.write(JSON.stringify(imageSet));
  res.end();
});

app.post('/completedJob/:id/:tags', (req, res) => {
  imageSets.completeProcessing(req.params);
  isWorkerFree = true;
  res.end();
});

const delegateToWorker = function ({id, count, height, width, tags}) {
  const options = getWorkerOptions();
  options.path = `/process/${id}/${count}/${height}/${width}/${tags}`;
  const req = http.request(options, (res, err) => {
    console.log('Got from worker', res.statusCode);
  });
  isWorkerFree = false;
  req.end();
};

app.post('/process/:name/:count/:height/:width/:tags', (req, res) => {
  const job = imageSets.addImageSet(req.params);
  jobs.push(job);
  res.send(`${job.id}`);
  res.end();
});

app.listen(port, () => console.log(`app is listening on port ${port}`));
