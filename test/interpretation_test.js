(function() {
  var Help, Interpretation, Patient, Sample, saveOneInterpretation, should;

  Sample = require('../dist/sample');

  Interpretation = require('../dist/interpretation');

  Patient = require('../dist/patient');

  Help = require('./help');

  should = require('should');

  describe('Interpretation Model', function() {
    before(function(done) {
      return Help.startMongo(done);
    });
    after(function(done) {
      return Help.stopMongo(done);
    });
    afterEach(function(done) {
      return Sample.remove({}, function(err) {
        if (err) {
          done(err);
        }
        return Interpretation.remove({}, done);
      });
    });
    it('should allow creation', function(done) {
      return saveOneInterpretation(function(err, things) {
        should.not.exist(err);
        things.interpretation.should.have.property('sample');
        things.interpretation.should.have.property('comment');
        return done();
      });
    });
    it('should allow finding by sample', function(done) {
      return saveOneInterpretation(function(err, things) {
        return Interpretation.find({
          sample: things.sample._id
        }, function(err, interpretations) {
          var interpretation;
          should.not.exist(err);
          interpretation = interpretations[0];
          interpretation._id.should.eql(things.interpretation._id);
          interpretation.comment.should.eql(things.interpretation.comment);
          return done();
        });
      });
    });
    return xit('should allow finding by patient');
  });

  saveOneInterpretation = function(callback) {
    var interpretation, patient, sample;
    patient = {
      mrn: '1234',
      name: 'Test Patient'
    };
    sample = {
      patient: null,
      type: "Foundation Medicine Report",
      value: 1234
    };
    interpretation = {
      sample: null,
      comment: "Looks good"
    };
    return Patient.create(patient, function(err, patient) {
      sample.patient = patient._id;
      return Sample.create(sample, function(err, sample) {
        interpretation.sample = sample._id;
        return Interpretation.create(interpretation, function(err, interpretation) {
          return callback(err, {
            sample: sample,
            interpretation: interpretation,
            patient: patient
          });
        });
      });
    });
  };

}).call(this);
