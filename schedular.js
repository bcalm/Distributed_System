const http = require('http');

class Schedular {
  constructor(workerOptions) {
    this.workerOptions = workerOptions;
    this.jobs = [];
    this.isWorkerFree = true;
  }

  schedule(job) {
    this.jobs.push(job);
  }

  start(interval) {
    setInterval(() => {
      if (this.isWorkerFree && this.jobs.length > 0) {
        const job = this.jobs.shift();
        this.delegateToWorker(job);
      }
    }, interval);
  }

  setWorkerFree() {
    this.isWorkerFree = true;
  }

  delegateToWorker(params) {
    const options = this.workerOptions;
    options.path = `/process`;
    const req = http.request(options, (res, err) => {
      console.log('Got from worker', res.statusCode);
    });
    req.write(JSON.stringify(params));
    req.end();
    this.isWorkerFree = false;
  }
}

module.exports = {Schedular};
