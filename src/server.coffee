express = require 'express'
mongoose = require 'mongoose'
baucis = require 'baucis'
http = require 'http'
corser = require 'corser'
auth = require 'basic-auth'

module.exports = app = express()

# Middleware
app.use corser.create
    requestHeaders:  corser.simpleRequestHeaders.concat ["X-Requested-With", "Authorization"]
    methods: corser.simpleMethods.concat ["PUT", "DELETE"]

authenticate = (req, res, next) ->
    unauthenticated = () ->
        res.setHeader "WWW-Authenticate", "Basic realm=\"TumorBoardServer\""
        res.send 401, "Unauthorized"
    user = auth(req)
    if not user
        unauthenticated()
    else
        mongoose.connection.db.authenticate user.name, user.pass, (err, result) ->
            if err isnt null or result is false
                unauthenticated()
            else
                next()

                #app.use authenticate

# Static Routes
app.get "/hello", (req, res) -> res.end "Hello World"
app.get "/secure", authenticate, (req, res) -> res.end "Authorized"
app.options '*', (req, res) ->
    # End Corser CORS preflight requests
    res.writeHead 204
    res.end()

# Model Routes
require './patient'
baucis.rest singular: 'Patient'

require './observation'
observationController = baucis.rest singular: 'Observation' # Capture observation controller to add file-uploads subcontroller
observationFiles = require './observationFiles'
observationController.use observationFiles # Add file-uploads subcontroller
observationController.request 'del', observationFiles.get 'deleteFileMiddleware'

require './interpretation'
baucis.rest singular: 'Interpretation'

require './conference'
baucis.rest singular: 'Conference'

controller = baucis # Need to capture the controller here for use later
    swagger:true
    version: "0.3.2"
controller.use authenticate # Require authentication for all API routes
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
        when 0, 3 then mongoose.connect (app.get 'mongoUrl') or 'mongodb://tb:tb@troup.mongohq.com:10061/TumorBoards'

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
