const http = require('http');

class Schedular {
  constructor() {
    this.agents = [];
    this.jobs = [];
  }

  addAgent(agent) {
    this.agents.push(agent);
  }

  schedule(job) {
    const agent = this.agents.find((agent) => agent.isFree);
    console.log(this.agents);
    if (agent) {
      this.delegateToWorker(job, agent);
    } else {
      this.jobs.push(job);
    }
  }

  setWorkerFree(agentId) {
    const agent = this.agents.find((a) => a.agentId === agentId);
    agent.isFree = true;
    if (this.jobs.length > 0) {
      const job = this.jobs.shift();
      this.delegateToWorker(job, agent);
    }
  }

  delegateToWorker(params, agent) {
    const options = agent.getOption();
    options.path = `/process`;
    const req = http.request(options, (res, err) => {
      console.log('Got from worker', res.statusCode);
    });
    agent.setBusy();
    req.write(JSON.stringify(params));
    req.end();
  }
}

module.exports = { Schedular };
