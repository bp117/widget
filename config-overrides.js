const path = require('path');

module.exports = {
  webpack: function (config, env) {
    // Disable file name hashing
    config.output.filename = 'static/js/searchWidget.js';
    config.output.chunkFilename = 'static/js/[name].chunk.js';

    // Ensure the output path is what you expect
    config.output.path = path.resolve(__dirname, 'build');

    return config;
  }
};
