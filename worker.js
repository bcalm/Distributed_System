const express = require('express');
const http = require('http');
const app = express();
const { processImage } = require('./processImage');

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

const informWorkerFree = function ({ id, tags }) {
  const options = getServerOptions();
  options.path = `/completedJob/${agentId}/${id}/${tags}`;
  const req = http.request(options, (res, err) => {
    console.log('Got from server', res.statusCode);
  });
  req.end();
};

app.post('/process/', (req, res) => {
  let data = '';
  req.on('data', (chunk) => (data += chunk));
  req.on('end', () => {
    const params = JSON.parse(data);
    processImage(params)
      .then((tags) => {
        return { id: params.id, tags };
      })
      .then(informWorkerFree);
  });
  res.end();
});

const main = function (port, id) {
  agentId = id;
  app.listen(port, () => console.log(`app is listening on port ${port}`));
};

main(+process.argv[2], +process.argv[3]);
