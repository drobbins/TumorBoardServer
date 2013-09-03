(function() {
  var Help, Patient, Sample, saveOneSample, should;

  Sample = require('../dist/sample');

  Patient = require('../dist/patient');

  Help = require('./help');

  should = require('should');

  describe('Sample Model', function() {
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
        return Patient.remove({}, done);
      });
    });
    it('should allow creation', function(done) {
      return saveOneSample(function(err, sample) {
        should.not.exist(err);
        sample.should.have.property('patient');
        sample.should.have.property('type');
        sample.should.have.property('value');
        return done();
      });
    });
    return it('should be findable by patient', function(done) {
      return saveOneSample(function(err) {
        return Patient.findOne(function(err, patient) {
          return Sample.find({
            patient: patient._id
          }, function(err, sample) {
            should.not.exist(err);
            return done();
          });
        });
      });
    });
  });

  saveOneSample = function(callback) {
    var patient;
    patient = {
      mrn: '1234',
      name: 'Test Patient'
    };
    return Patient.create(patient, function(err, patient) {
      var sample;
      sample = {
        patient: patient._id,
        type: "Foundation Medicine Report",
        value: 1234
      };
      return Sample.create(sample, callback);
    });
  };

}).call(this);
