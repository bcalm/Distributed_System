const express = require('express');
const http = require('http');
const app = express();
const { processImage } = require('./processImage');
const imageSets = require('./imageSets');
const redis = require('redis');

const redisClient = redis.createClient({ db: 1 });

let agentId;
const getServerOptions = () => {
  return {
    host: 'localhost',
    port: '8080',
    method: 'POST',
  };
};

app.use((req, res, next) => {
  console.log(`${req.url} ${req.method}`);
  next();
});

const informWorkerFree = function (params) {
  imageSets.completeProcessing(redisClient, params);
  const options = getServerOptions();
  options.path = `/completedJob/${agentId}/`;
  const req = http.request(options, (res, err) => {
    console.log('Got from server', res.statusCode);
  });
  req.end();
};

app.post('/process/', (req, res) => {
  let id = '';
  req.on('data', (chunk) => (id += chunk));
  req.on('end', () => {
    imageSets.get(redisClient, id).then((params) => {
      processImage(params)
        .then((tags) => {
          return { id, tags };
        })
        .then(informWorkerFree);
    });
  });
  res.end();
});

const main = function (port, id) {
  agentId = id;
  app.listen(port, () => console.log(`app is listening on port ${port}`));
};

main(+process.argv[2], +process.argv[3]);
