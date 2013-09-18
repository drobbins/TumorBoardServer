(function() {
  var Help, Interpretation, Observation, Patient, saveOneInterpretation, should;

  Observation = require('../dist/observation');

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
      return Observation.remove({}, function(err) {
        if (err) {
          done(err);
        }
        return Interpretation.remove({}, done);
      });
    });
    it('should allow creation', function(done) {
      return saveOneInterpretation(function(err, things) {
        should.not.exist(err);
        things.interpretation.should.have.property('observation');
        things.interpretation.should.have.property('comment');
        return done();
      });
    });
    it('should allow finding by observation', function(done) {
      return saveOneInterpretation(function(err, things) {
        return Interpretation.find({
          observation: things.observation._id
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
    var interpretation, observation, patient;
    patient = {
      mrn: '1234',
      name: 'Test Patient'
    };
    observation = {
      patient: null,
      type: "Foundation Medicine Report",
      value: 1234
    };
    interpretation = {
      observation: null,
      comment: "Looks good"
    };
    return Patient.create(patient, function(err, patient) {
      observation.patient = patient._id;
      return Observation.create(observation, function(err, observation) {
        interpretation.observation = observation._id;
        return Interpretation.create(interpretation, function(err, interpretation) {
          return callback(err, {
            observation: observation,
            interpretation: interpretation,
            patient: patient
          });
        });
      });
    });
  };

}).call(this);
