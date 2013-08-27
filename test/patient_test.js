(function() {
  var Help, Patient;

  Patient = require('../dist/patient');

  Help = require('./help');

  describe('Patient Model', function() {
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
        patient.should.have.property('name', testPatient.name);
        patient.should.have.property('mrn', testPatient.mrn);
        return done();
      });
    });
    return it('should allow saving values not defined in the schema', function(done) {
      var testPatient;
      testPatient = {
        mrn: '1234',
        name: 'TestMcPatient',
        age: '98'
      };
      return Patient.create(testPatient, function(err, patient) {
        patient = patient.toObject();
        patient.should.have.property('name', testPatient.name);
        patient.should.have.property('mrn', testPatient.mrn);
        patient.should.have.property('age', testPatient.age);
        return done();
      });
    });
  });

}).call(this);
