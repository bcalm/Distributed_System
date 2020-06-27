const express = require('express');
const app = express();
const {ImageSets} = require('./imageSets');
const {Schedular} = require('./schedular');
const port = process.env.port || 8080;

const imageSets = new ImageSets();
const getWorkerOptions = () => {
  return {
    host: 'localhost',
    port: '5000',
    method: 'POST',
  };
};

const schedular = new Schedular(getWorkerOptions());
schedular.start(1000);

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
  schedular.setWorkerFree();
  res.end();
});

app.post('/process/:name/:count/:height/:width/:tags', (req, res) => {
  const job = imageSets.addImageSet(req.params);
  schedular.schedule(job);
  res.send(`${job.id}`);
  res.end();
});

app.listen(port, () => console.log(`app is listening on port ${port}`));
