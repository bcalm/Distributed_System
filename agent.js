class Agent {
  constructor(workerOptions, id) {
    this.workerOptions = workerOptions;
    this.agentId = id;
    this.isFree = true;
  }

  setBusy() {
    this.isFree = false;
  }

  getOption() {
    return Object.assign({}, this.workerOptions);
  }
}

module.exports = { Agent };
