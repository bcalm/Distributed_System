const express = require('express');
const app = express();
const http = require('http');
const imageSets = require('./imageSets');
const port = process.env.port || 8080;
const redis = require('redis');

const redisClient = redis.createClient({ db: 1 });

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
    redisClient.rpush('queue', job.id, (err, res) => {
      console.log('Added to the queue', job.id);
    });
    res.send(`${job.id}`);
    res.end();
  });
});

app.listen(port, () => console.log(`app is listening on port ${port}`));
