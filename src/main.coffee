optimist = require 'optimist'
server = require './server'

argv = optimist.options 'port',
        default: 8888
        describe: 'Port to listen on'
    .options 'mongourl',
        default: 'mongodb://localhost/tb'
        describe: 'MongoDB connection string'
    .check (args) ->
        throw "Example: node dist/main.js --port 8181 --mongourl mongodb://localhost/mydb" if args.h or args.help
    .argv

server.config argv
server.listen()
console.log "TumorBoardServer listening on #{server.get 'port'}"
