mongoose = require 'mongoose'
server = require '../dist/server'

mongoUrl = 'mongodb://tb:tb@127.0.0.1/tboard_test'

module.exports =
    init: (done) ->
        server.config
            port: 8888
            mongoUrl: mongoUrl
        server.listen()
        server.clearData done
    deinit: (done) ->
        server.close done
    url: "http://localhost:8888/api/v1"
    startMongo: (callback) ->
        mongoose.connect mongoUrl, callback
    stopMongo: (callback) ->
        mongoose.disconnect callback
