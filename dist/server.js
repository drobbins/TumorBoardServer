(function() {
  var app, express, http,
    __slice = [].slice;

  express = require('express');

  http = require('http');

  module.exports = app = express();

  app.get("/hello", function(req, res) {
    return res.end("Hello World");
  });

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

}).call(this);
