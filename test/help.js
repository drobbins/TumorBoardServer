(function() {
  var mongoUrl, mongoose, server;

  mongoose = require('mongoose');

  server = require('../dist/server');

  mongoUrl = 'mongodb://tb:tb@127.0.0.1/tboard_test';

  module.exports = {
    init: function(done) {
      server.config({
        port: 8888,
        mongoUrl: mongoUrl
      });
      server.listen();
      return server.clearData(done);
    },
    deinit: function(done) {
      return server.close(done);
    },
    url: "http://localhost:8888/api/v1",
    startMongo: function(callback) {
      return mongoose.connect(mongoUrl, callback);
    },
    stopMongo: function(callback) {
      return mongoose.disconnect(callback);
    }
  };

}).call(this);
