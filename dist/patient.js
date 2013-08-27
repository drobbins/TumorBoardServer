(function() {
  var mongoose, patientSchema;

  mongoose = require('mongoose');

  patientSchema = new mongoose.Schema({
    mrn: String,
    name: String
  });

  patientSchema.set('strict', false);

  module.exports = mongoose.model('Patient', patientSchema);

}).call(this);
