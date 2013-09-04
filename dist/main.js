(function() {
  var argv, optimist, server;

  optimist = require('optimist');

  server = require('./server');

  argv = optimist.options('port', {
    "default": 8888,
    describe: 'Port to listen on'
  }).options('mongoUrl', {
    "default": 'mongodb://localhost/tb',
    describe: 'MongoDB connection string'
  }).check(function(args) {
    if (args.h || args.help) {
      throw "Example: node dist/main.js --port 8181 --mongoUrl mongodb://localhost/mydb";
    }
  }).argv;

  server.config(argv);

  server.listen();

  console.log("TumorBoardServer listening on " + (server.get('port')));

}).call(this);
