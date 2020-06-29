const processImage = function ({ count, height, width, tags }) {
  return new Promise((resolve, reject) => {
    let a = 0;
    let b = 0;
    for (let index = 0; index < +count; index++) {
      for (let index = 0; index < +height; index++) {
        for (let index = 0; index < +width; index++) {
          a = a + 1 * 2;
          b = b + 1 * 2;
        }
      }
    }
    resolve(tags.split('_'));
  });
};

module.exports = { processImage };
