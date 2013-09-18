(function() {
  var Help, Patient, should;

  Patient = require('../dist/patient');

  Help = require('./help');

  should = require('should');

  describe('Patient Model', function() {
    before(function(done) {
      return Help.startMongo(done);
    });
    after(function(done) {
      return Help.stopMongo(done);
    });
    afterEach(function(done) {
      return Patient.remove({}, done);
    });
    it('should save a patient with just name and mrn', function(done) {
      var testPatient;
      testPatient = {
        mrn: '1234',
        name: 'TestMcPatient'
      };
      return Patient.create(testPatient, function(err, patient) {
        should.not.exist(err);
        patient.should.have.property('name', testPatient.name);
        patient.should.have.property('mrn', testPatient.mrn);
        return done();
      });
    });
    it('should allow saving values not defined in the schema', function(done) {
      var testPatient;
      testPatient = {
        mrn: '1234',
        name: 'TestMcPatient',
        age: '98'
      };
      return Patient.create(testPatient, function(err, patient) {
        should.not.exist(err);
        patient = patient.toObject();
        patient.should.have.property('name', testPatient.name);
        patient.should.have.property('mrn', testPatient.mrn);
        patient.should.have.property('age', testPatient.age);
        return done();
      });
    });
    it('should require name', function(done) {
      return Patient.create({
        mrn: '1234'
      }, function(err, patient) {
        should.exist(err);
        err.errors.name.type.should.equal('required');
        return done();
      });
    });
    return it('should require mrn', function(done) {
      return Patient.create({
        name: '1234'
      }, function(err, patient) {
        should.exist(err);
        err.errors.mrn.type.should.equal('required');
        return done();
      });
    });
  });

}).call(this);
