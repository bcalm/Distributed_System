const express = require('express');
const app = express();
const {processImage} = require('./processImage');
const port = process.env.port || 8080;

app.use((req, res, next) => {
  console.log(`${req.url} ${req.method}`);
  next();
});

app.post('/process/:name/:count/:height/:width/:tags', (req, res) => {
  processImage(req.params)
    .then((tags) => {
      console.log(tags);
      return tags;
    })
    .then((tags) => {
      res.write(JSON.stringify(tags));
      res.end();
    });
});

app.listen(port, () => console.log(`app is listening on port ${port}`));
