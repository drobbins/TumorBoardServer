(function() {
  var Help, Observation, Patient, Sample, saveOneObservation, should;

  Sample = require('../dist/sample');

  Observation = require('../dist/observation');

  Patient = require('../dist/patient');

  Help = require('./help');

  should = require('should');

  describe('Observation Model', function() {
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
        return Observation.remove({}, done);
      });
    });
    it('should allow creation', function(done) {
      return saveOneObservation(function(err, things) {
        should.not.exist(err);
        things.observation.should.have.property('sample');
        things.observation.should.have.property('comment');
        return done();
      });
    });
    it('should allow finding by sample', function(done) {
      return saveOneObservation(function(err, things) {
        return Observation.find({
          sample: things.sample._id
        }, function(err, observations) {
          var observation;
          should.not.exist(err);
          observation = observations[0];
          observation._id.should.eql(things.observation._id);
          observation.comment.should.eql(things.observation.comment);
          return done();
        });
      });
    });
    return xit('should allow finding by patient');
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
        return Observation.create(observation, function(err, observation) {
          return callback(err, {
            sample: sample,
            observation: observation,
            patient: patient
          });
        });
      });
    });
  };

}).call(this);
