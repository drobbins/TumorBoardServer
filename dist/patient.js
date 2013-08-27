(function() {
  var mongoose, patientSchema;

  mongoose = require('mongoose');

  patientSchema = new mongoose.Schema({
    mrn: {
      type: 'string',
      required: true
    },
    name: {
      type: 'string',
      required: true
    }
  });

  patientSchema.set('strict', false);

  module.exports = mongoose.model('Patient', patientSchema);

}).call(this);
