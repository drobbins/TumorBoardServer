mongoose = require 'mongoose'
express = require 'express'

module.exports = controller = express()

prefix = 'observations'
getDb = () -> mongoose.connection.db

binaryBodyParser = (req, res, next) ->
    body = new Buffer(0)
    req.on "data", (chunk) ->
        buffer = new Buffer body.length+chunk.length
        body.copy buffer
        chunk.copy buffer, body.length
        body = buffer
    req.on "end", () ->
        req.body = body
        next()

deleteFileMiddleware = (req, res, next) ->
    db = getDb()
    db.collection "#{prefix}.files", (err, collection) ->
        next err if err
        collection.findOne
            metadata:
                observation: req.params.id
            (err, doc) ->
                next err if err
                if doc
                    gridStore = new mongoose.mongo.GridStore db, doc._id, "w", { root: prefix }
                    gridStore.open (err, gridStore) ->
                        gridStore.unlink (err, file) ->
                            next err if err
                            next()
                else
                    next()

controller.set 'deleteFileMiddleware', deleteFileMiddleware

controller.put "/:observationId/file", binaryBodyParser, (req, res, next) ->
    db = getDb()
    grid = new mongoose.mongo.Grid db, prefix
    grid.put req.body,
        content_type: req.headers["content-type"]
        metadata:
            observation: req.params.observationId
        (err, doc) ->
            next err if err
            res.send 201, doc

controller.get "/:observationId/file", (req, res, next) ->
    db = getDb()
    db.collection "#{prefix}.files", (err, collection) ->
        next err if err
        collection.findOne
            metadata:
                observation: req.params.observationId
            (err, doc) ->
                next err if err
                if not doc
                    res.send 404
                else
                    grid = new mongoose.mongo.Grid db, prefix
                    grid.get doc._id, (err, file) ->
                        next err if err
                        res.type doc.contentType || "application/octet-stream"
                        res.send file

controller['delete'] "/:id/file", deleteFileMiddleware, (req, res, next) ->
    res.send 200
