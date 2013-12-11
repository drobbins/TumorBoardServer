(function() {
  var binaryBodyParser, controller, express, getDb, mongoose, prefix;

  mongoose = require('mongoose');

  express = require('express');

  module.exports = controller = express();

  prefix = 'observations';

  getDb = function() {
    return mongoose.connection.db;
  };

  binaryBodyParser = function(req, res, next) {
    var body;
    body = new Buffer(0);
    req.on("data", function(chunk) {
      var buffer;
      buffer = new Buffer(body.length + chunk.length);
      body.copy(buffer);
      chunk.copy(buffer, body.length);
      return body = buffer;
    });
    return req.on("end", function() {
      req.body = body;
      return next();
    });
  };

  controller.put("/:observationId/file", binaryBodyParser, function(req, res, next) {
    var db, grid;
    db = getDb();
    grid = new mongoose.mongo.Grid(db, prefix);
    return grid.put(req.body, {
      content_type: req.headers["content-type"],
      metadata: {
        observation: req.params.observationId
      }
    }, function(err, doc) {
      if (err) {
        next(err);
      }
      return res.send(201, doc);
    });
  });

  controller.get("/:observationId/file", function(req, res, next) {
    var db;
    db = getDb();
    return db.collection("" + prefix + ".files", function(err, collection) {
      if (err) {
        next(err);
      }
      return collection.findOne({
        metadata: {
          observation: req.params.observationId
        }
      }, function(err, doc) {
        var grid;
        if (err) {
          next(err);
        }
        if (!doc) {
          return res.send(404);
        } else {
          grid = new mongoose.mongo.Grid(db, prefix);
          return grid.get(doc._id, function(err, file) {
            if (err) {
              next(err);
            }
            res.type(doc.contentType || "application/octet-stream");
            return res.send(file);
          });
        }
      });
    });
  });

  controller['delete']("/:observationId/file", function(req, res, next) {
    var db;
    db = getDb();
    return db.collection("" + prefix + ".files", function(err, collection) {
      if (err) {
        next(err);
      }
      return collection.findOne({
        metadata: {
          observation: req.params.observationId
        }
      }, function(err, doc) {
        var gridStore;
        if (err) {
          next(err);
        }
        gridStore = new mongoose.mongo.GridStore(db, doc._id, "w", {
          root: prefix
        });
        return gridStore.open(function(err, gridStore) {
          return gridStore.unlink(function(err, file) {
            if (err) {
              next(err);
            }
            return res.send(200);
          });
        });
      });
    });
  });

}).call(this);
