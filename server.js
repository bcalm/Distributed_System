const express = require('express');
const app = express();
const imageSets = require('./imageSets');
const { Schedular } = require('./schedular');
const { Agent } = require('./agent');
const port = process.env.port || 8080;
const redis = require('redis');

const redisClient = redis.createClient({ db: 1 });

const getAgentOptions = (port) => {
  return {
    host: 'localhost',
    port: port,
    method: 'POST',
  };
};

const schedular = new Schedular();
schedular.addAgent(new Agent(getAgentOptions(5000), 1));
schedular.addAgent(new Agent(getAgentOptions(5001), 2));

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

app.post('/completedJob/:agentId/', (req, res) => {
  schedular.setWorkerFree(+req.params.agentId);
  res.end();
});

app.post('/process/:name/:count/:height/:width/:tags', (req, res) => {
  imageSets.addImageSet(redisClient, req.params).then((job) => {
    schedular.schedule(job);
    res.send(`${job.id}`);
    res.end();
  });
});

app.listen(port, () => console.log(`app is listening on port ${port}`));
