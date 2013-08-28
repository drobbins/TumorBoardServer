(function() {
  var app, baucis, corser, express, http, mongoose,
    __slice = [].slice;

  express = require('express');

  mongoose = require('mongoose');

  baucis = require('baucis');

  http = require('http');

  corser = require('corser');

  module.exports = app = express();

  app.use(corser.create());

  app.get("/hello", function(req, res) {
    return res.end("Hello World");
  });

  app.options('*', function(req, res) {
    res.writeHead(204);
    return res.end;
  });

  require('./patient');

  baucis.rest({
    singular: 'Patient'
  });

  app.use('/api/v1', baucis({
    swagger: true
  }));

  app.set('__options', {});

  app.config = function(options) {
    var option, value, _results;
    _results = [];
    for (option in options) {
      value = options[option];
      app.set(option, value);
      _results.push((app.get('__options'))[option] = true);
    }
    return _results;
  };

  app.clear = function() {
    var option, _results;
    _results = [];
    for (option in app.get('__options')) {
      app.set(option, null);
      _results.push((app.get('__options'))[option] = false);
    }
    return _results;
  };

  app.listen = function() {
    var args, server;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    server = http.createServer(app);
    app.set('__server', server);
    if (args.length === 0) {
      return server.listen.apply(server, [app.get("port")]);
    } else {
      return server.listen.apply(server, args);
    }
  };

  app.close = function(callback) {
    if (app.get('__server').address() === null) {
      return typeof callback === "function" ? callback() : void 0;
    } else {
      return app.get('__server').close(callback);
    }
  };

  app.clearData = function(callback) {
    var done, model, models, _i, _len, _results;
    models = mongoose.modelNames();
    done = 0;
    if (models.length === 0) {
      return typeof callback === "function" ? callback() : void 0;
    } else {
      _results = [];
      for (_i = 0, _len = models.length; _i < _len; _i++) {
        model = models[_i];
        _results.push(mongoose.model(model).remove({}, function(err) {
          done++;
          if (err) {
            return typeof callback === "function" ? callback(err) : void 0;
          } else if (done >= models.length) {
            return typeof callback === "function" ? callback() : void 0;
          }
        }));
      }
      return _results;
    }
  };

}).call(this);
