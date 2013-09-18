(function() {
  var mongoose, observationSchema;

  mongoose = require('mongoose');

  observationSchema = new mongoose.Schema({
    type: {
      type: String,
      required: 'true'
    },
    value: {
      type: String
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient'
    }
  });

  observationSchema.set('strict', false);

  module.exports = mongoose.model('Observation', observationSchema);

}).call(this);
