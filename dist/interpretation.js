(function() {
  var interpretationSchema, mongoose;

  mongoose = require('mongoose');

  interpretationSchema = new mongoose.Schema({
    comment: {
      type: String
    },
    observation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Observation'
    }
  });

  interpretationSchema.set('strict', false);

  module.exports = mongoose.model('Interpretation', interpretationSchema);

}).call(this);
