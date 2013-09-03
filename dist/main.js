(function() {
  var argv, optimist, server;

  optimist = require('optimist');

  server = require('./server');

  argv = optimist.options('port', {
    "default": 8888,
    describe: 'Port to listen on'
  }).options('mongourl', {
    "default": 'mongodb://localhost/tb',
    describe: 'MongoDB connection string'
  }).argv;

  server.config(argv);

  server.listen();

  console.log("TumorBoardServer listening on " + (server.get('port')));

}).call(this);
