(function() {
  var interpretationSchema, mongoose;

  mongoose = require('mongoose');

  interpretationSchema = new mongoose.Schema({
    comment: {
      type: String
    },
    sample: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sample'
    }
  });

  interpretationSchema.set('strict', false);

  module.exports = mongoose.model('Interpretation', interpretationSchema);

}).call(this);
