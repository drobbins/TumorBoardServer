(function() {
  var conferenceSchema, mongoose;

  mongoose = require('mongoose');

  conferenceSchema = new mongoose.Schema({
    date: {
      type: Date,
      required: 'true'
    },
    name: {
      type: String
    },
    patients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient'
      }
    ]
  });

  conferenceSchema.set('strict', false);

  module.exports = mongoose.model('Conference', conferenceSchema);

}).call(this);
