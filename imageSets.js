class ImageSets {
  constructor() {
    this.jobs = {};
    this.id = 0;
  }

  addImageSet(imageSet) {
    const jobToSchedule = Object.assign({id: this.id}, imageSet);
    this.jobs[this.id] = Object.assign({}, jobToSchedule);
    this.jobs[this.id].status = 'scheduled';
    this.jobs[this.id].receivedAt = new Date();
    this.id++;
    return jobToSchedule;
  }

  completeProcessing({id, tags}) {
    console.log(tags);
    this.jobs[id].status = 'completed';
    this.jobs[id].completedAt = new Date();
    this.jobs[id].tags = tags;
  }

  get(id) {
    return Object.assign({}, this.jobs[id]);
  }
}

module.exports = {ImageSets};
