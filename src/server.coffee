express = require 'express'
mongoose = require 'mongoose'
baucis = require 'baucis'
http = require 'http'
corser = require 'corser'

module.exports = app = express()

# Middleware
app.use corser.create
    methods: corser.simpleMethods.concat ["PUT", "DELETE"]

# Static Routes
app.get "/hello", (req, res) -> res.end "Hello World"
app.options '*', (req, res) ->
    # End Corser CORS preflight requests
    res.writeHead 204
    res.end()

# Model Routes
require './patient'
baucis.rest singular: 'Patient'
require './observation'
baucis.rest singular: 'Observation'
require './interpretation'
baucis.rest singular: 'Interpretation'
require './conference'
baucis.rest singular: 'Conference'
controller = baucis # Need to capture the controller here for use later
    swagger:true
    version: "0.2.0"
app.use "/api/v1", controller

# Testability Helpers
app.set '__options', {}

app.config = (options) ->
    for option,value of options
        app.set option,value
        (app.get '__options')[option] = true

app.clear = () ->
    for option of app.get '__options'
        app.set option, null
        (app.get '__options')[option] = false

app.listen = (args...) ->
  # Prefix routes, if asked to.
    if app.get('prefix')
        app.use app.get('prefix'),app.router
        app.use "#{app.get 'prefix'}/api/v1", controller

  # Initalize MongoDB Connection
    switch mongoose.connection.readyState
        when 0, 3 then mongoose.connect (app.get 'mongoUrl') or 'mongodb://localhost/tb'

  # Initialize HTTP Server
    server = http.createServer app
    app.set '__server', server
    if args.length is 0
        server.listen.apply(server, [app.get("port")])
    else
        server.listen.apply(server, args)

app.close = (callback) ->
    mongoose.disconnect()
    if app.get('__server').address() is null
        callback?()
    else
        app.get('__server').close callback

app.clearData = (callback) ->
    models = mongoose.modelNames()
    done = 0
    if models.length is 0 then callback?() else
        for model in models
            mongoose.model(model).remove {}, (err) ->
                done++
                if err then callback?(err)
                else if done >= models.length then callback?()
