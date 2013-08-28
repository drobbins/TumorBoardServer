(function() {
  var mongoose, patientSchema;

  mongoose = require('mongoose');

  patientSchema = new mongoose.Schema({
    mrn: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  });

  patientSchema.set('strict', false);

  module.exports = mongoose.model('Patient', patientSchema);

}).call(this);
