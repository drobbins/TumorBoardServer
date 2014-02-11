(function() {
  var app, auth, authenticate, baucis, conferenceController, controller, corser, express, http, interpretationController, mongoose, observationController, observationFiles, patientController,
    __slice = [].slice;

  express = require('express');

  mongoose = require('mongoose');

  baucis = require('baucis');

  http = require('http');

  corser = require('corser');

  auth = require('basic-auth');

  module.exports = app = express();

  app.use(corser.create({
    requestHeaders: corser.simpleRequestHeaders.concat(["X-Requested-With", "Authorization"]),
    methods: corser.simpleMethods.concat(["PUT", "DELETE"])
  }));

  authenticate = function(req, res, next) {
    var unauthenticated, user;
    unauthenticated = function() {
      res.setHeader("WWW-Authenticate", "Basic realm=\"TumorBoardServer\"");
      return res.send(401, "Unauthorized");
    };
    user = auth(req);
    if (!user) {
      return unauthenticated();
    } else {
      return mongoose.connection.db.authenticate(user.name, user.pass, function(err, result) {
        if (err !== null || result === false) {
          return unauthenticated();
        } else {
          return next();
        }
      });
    }
  };

  app.get("/hello", function(req, res) {
    return res.end("Hello World");
  });

  app.get("/secure", authenticate, function(req, res) {
    return res.end("Authorized");
  });

  app.options('*', function(req, res) {
    res.writeHead(204);
    return res.end();
  });

  require('./patient');

  patientController = baucis.rest({
    singular: 'Patient'
  });

  patientController.use(authenticate);

  require('./observation');

  observationController = baucis.rest({
    singular: 'Observation'
  });

  observationController.use(authenticate);

  observationFiles = require('./observationFiles');

  observationController.use(observationFiles);

  observationController.request('del', observationFiles.get('deleteFileMiddleware'));

  require('./interpretation');

  interpretationController = baucis.rest({
    singular: 'Interpretation'
  });

  interpretationController.use(authenticate);

  require('./conference');

  conferenceController = baucis.rest({
    singular: 'Conference'
  });

  conferenceController.use(authenticate);

  controller = baucis({
    swagger: true,
    version: "1.0.2"
  });

  app.use("/api/v1", controller);

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
    if (app.get('prefix')) {
      app.use(app.get('prefix'), app.router);
      app.use("" + (app.get('prefix')) + "/api/v1", controller);
    }
    switch (mongoose.connection.readyState) {
      case 0:
      case 3:
        mongoose.connect((app.get('mongoUrl')) || 'mongodb://tb:tb@troup.mongohq.com:10061/TumorBoards');
    }
    server = http.createServer(app);
    app.set('__server', server);
    if (args.length === 0) {
      return server.listen.apply(server, [app.get("port")]);
    } else {
      return server.listen.apply(server, args);
    }
  };

  app.close = function(callback) {
    mongoose.disconnect();
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
