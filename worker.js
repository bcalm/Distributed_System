const express = require('express');
const http = require('http');
const app = express();
const {processImage} = require('./processImage');
const port = 5000;

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

const informWorkerFree = function (id, tags) {
  const options = getServerOptions();
  options.path = `/process/completedJob/${id}/${tags}`;
  const req = http.request(options, (res, err) => {
    console.log('Got from server', res.statusCode);
  });
  req.end();
};

app.post('/process/:id/:count/:height/:width/:tags', (req, res) => {
  processImage(req.params)
    .then((tags) => {
      console.log(tags);
      return tags;
    })
    .then((tags) => {
      informWorkerFree(req.params.id, tags);
      res.write(JSON.stringify(tags));
      res.end();
    });
});

app.listen(port, () => console.log(`app is listening on port ${port}`));
