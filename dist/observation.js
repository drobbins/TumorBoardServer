(function() {
  var mongoose, observationSchema;

  mongoose = require('mongoose');

  observationSchema = new mongoose.Schema({
    comment: {
      type: String
    },
    sample: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sample'
    }
  });

  observationSchema.set('strict', false);

  module.exports = mongoose.model('Observation', observationSchema);

}).call(this);
