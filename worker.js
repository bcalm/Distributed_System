const http = require('http');
const { processImage } = require('./processImage');
const imageSets = require('./imageSets');
const redis = require('redis');

const redisClient = redis.createClient({ db: 1 });

const getJob = () => {
  return new Promise((resolve, reject) => {
    redisClient.blpop('queue', 1, (err, res) => {
      if (res) resolve(res[1]);
      else reject('no job');
    });
  });
};

const runLoop = () => {
  getJob()
    .then((id) => {
      imageSets
        .get(redisClient, id)
        .then((imageSet) =>
          processImage(imageSet).then((tags) => imageSets.completeProcessing(redisClient, id, tags))
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
