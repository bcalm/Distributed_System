const express = require('express');
const app = express();
const http = require('http');
const imageSets = require('./imageSets');
const port = process.env.port || 8080;
const redis = require('redis');

const redisClient = redis.createClient({ db: 1 });
const getQBOptions = () => {
  return {
    host: 'localhost',
    port: '8000',
    method: 'post',
    path: '/queue-job',
  };
};

app.use((req, res, next) => {
  console.log(`${req.url} ${req.method}`);
  next();
});

app.get('/status/:id', (req, res) => {
  imageSets.get(redisClient, req.params.id).then((imageSet) => {
    res.write(JSON.stringify(imageSet));
    res.end();
  });
});

app.post('/process/:name/:count/:height/:width/:tags', (req, res) => {
  imageSets.addImageSet(redisClient, req.params).then((job) => {
    const qbOptions = getQBOptions();
    qbOptions.path += `/${job.id}`;
    const req = http.request(qbOptions, (req, res) => {
      console.log('Added to the queue', job.id);
    });
    res.send(`${job.id}`);
    res.end();
    req.end();
  });
});

app.listen(port, () => console.log(`app is listening on port ${port}`));
