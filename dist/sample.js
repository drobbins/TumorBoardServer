(function() {
  var mongoose, sampleSchema;

  mongoose = require('mongoose');

  sampleSchema = new mongoose.Schema({
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

  sampleSchema.set('strict', false);

  module.exports = mongoose.model('Sample', sampleSchema);

}).call(this);
