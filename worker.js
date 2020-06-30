const http = require('http');
const { processImage } = require('./processImage');
const imageSets = require('./imageSets');
const redis = require('redis');

const redisClient = redis.createClient({ db: 1 });

const getServerOptions = () => {
  return {
    host: 'localhost',
    port: '8000',
    path: '/request-job',
  };
};

const getJob = () => {
  return new Promise((resolve, reject) => {
    const options = getServerOptions();
    const req = http.request(options, (res, err) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        console.log(data);
        if (JSON.parse(data).id !== undefined) resolve(data);
        else reject('no job');
      });
    });
    req.end();
  });
};

const runLoop = () => {
  getJob()
    .then((data) => {
      const params = JSON.parse(data);
      imageSets
        .get(redisClient, params.id)
        .then((imageSet) =>
          processImage(imageSet).then((tags) =>
            imageSets.completeProcessing(redisClient, params.id, tags)
          )
        )
        .then(runLoop);
    })
    .catch((err) => {
      console.log(err);
      setTimeout(() => {
        runLoop();
      }, 1000);
    });
};

runLoop();
