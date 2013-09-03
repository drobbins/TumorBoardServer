(function() {
  var Help, Observation, Patient, Sample, saveOneObservation, should;

  Sample = require('../dist/sample');

  Observation = require('../dist/observation');

  Patient = require('../dist/patient');

  Help = require('./help');

  should = require('should');

  describe('Observation Model', function() {
    afterEach(function(done) {
      return Sample.remove({}, function(err) {
        if (err) {
          done(err);
        }
        return Observation.remove({}, done);
      });
    });
    return it('should allow creation', function(done) {
      return saveOneObservation(function(err, observation) {
        should.not.exist(err);
        observation.should.have.property('sample');
        observation.should.have.property('comment');
        return done();
      });
    });
  });

  saveOneObservation = function(callback) {
    var observation, patient, sample;
    patient = {
      mrn: '1234',
      name: 'Test Patient'
    };
    sample = {
      patient: null,
      type: "Foundation Medicine Report",
      value: 1234
    };
    observation = {
      sample: null,
      comment: "Looks good"
    };
    return Patient.create(patient, function(err, patient) {
      sample.patient = patient._id;
      return Sample.create(sample, function(err, sample) {
        observation.sample = sample._id;
        return Observation.create(observation, callback);
      });
    });
  };

}).call(this);
