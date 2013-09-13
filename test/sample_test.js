(function() {
  var Help, Observation, Patient, saveOneObservation, should;

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
      return Observation.remove({}, function(err) {
        if (err) {
          done(err);
        }
        return Patient.remove({}, done);
      });
    });
    it('should allow creation', function(done) {
      return saveOneObservation(function(err, observation) {
        should.not.exist(err);
        observation.should.have.property('patient');
        observation.should.have.property('type');
        observation.should.have.property('value');
        return done();
      });
    });
    return it('should be findable by patient', function(done) {
      return saveOneObservation(function(err) {
        return Patient.findOne(function(err, patient) {
          return Observation.find({
            patient: patient._id
          }, function(err, observation) {
            should.not.exist(err);
            return done();
          });
        });
      });
    });
  });

  saveOneObservation = function(callback) {
    var patient;
    patient = {
      mrn: '1234',
      name: 'Test Patient'
    };
    return Patient.create(patient, function(err, patient) {
      var observation;
      observation = {
        patient: patient._id,
        type: "Foundation Medicine Report",
        value: 1234
      };
      return Observation.create(observation, callback);
    });
  };

}).call(this);
