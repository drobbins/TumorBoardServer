(function() {
  var mongoose;

  mongoose = require('mongoose');

  mongoose.connect('mongodb://localhost/tb');

}).call(this);
