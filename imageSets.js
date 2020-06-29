const getCurrId = (client) => {
  return new Promise((res, rej) => {
    client.incr('curr_id', (err, id) => {
      res(id);
    });
  });
};

const createJob = (client, id, imageSet) => {
  const statusDetails = ['status', 'schedule'];
  const receivingDetails = ['receivedAt', new Date()];
  const imageSets = Object.keys(imageSet).reduce((list, set) => {
    list.push(set, imageSet[set]);
    return list;
  }, []);
  const jobDetails = statusDetails.concat(receivingDetails, imageSets);
  return new Promise((resolve, reject) => {
    client.hmset(`job_${id}`, jobDetails, (err, res) => {
      resolve(Object.assign({ id: id }, imageSet));
    });
  });
};

const addImageSet = (client, imageSet) => {
  return getCurrId(client).then((id) => createJob(client, id, imageSet));
};

const completeProcessing = (client, { id, tags }) => {
  const statusDetails = ['status', 'completed'];
  const completionDetails = ['completedAt', new Date()];
  const details = statusDetails.concat(tags, completionDetails);
  return new Promise((resolve, rej) => {
    client.hmset(`job_${id}`, details, (err, res) => {
      resolve(res);
    });
  });
};

const get = (client, id) => {
  return new Promise((resolve, rej) => {
    client.hgetall(`job_${id}`, (err, res) => {
      resolve(res);
    });
  });
};

module.exports = { addImageSet, completeProcessing, get };
