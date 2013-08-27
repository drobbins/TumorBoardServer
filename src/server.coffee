express = require 'express'
http = require 'http'

module.exports = app = express()

# Routes
app.get "/hello", (req, res) -> res.end "Hello World"

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
    server = http.createServer app
    app.set '__server', server
    if args.length is 0
        server.listen.apply(server, [app.get("port")])
    else
        server.listen.apply(server, args)

app.close = (callback) ->
    if app.get('__server').address() is null
        callback?()
    else
        app.get('__server').close callback
