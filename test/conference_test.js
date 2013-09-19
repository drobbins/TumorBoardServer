(function() {
  var Conference, Help, Patient, conference, patient, patient2, patient3, saveOneConference, should;

  Conference = require('../dist/conference');

  Patient = require('../dist/patient');

  Help = require('./help');

  should = require('should');

  describe('Conference Model', function() {
    before(function(done) {
      return Help.startMongo(done);
    });
    after(function(done) {
      return Help.stopMongo(done);
    });
    afterEach(function(done) {
      return Conference.remove({}, function() {
        return Patient.remove({}, done);
      });
    });
    it('should allow creation', function(done) {
      return saveOneConference(function(err, conference) {
        should.not.exist(err);
        conference.should.have.property('date');
        conference.should.have.property('name');
        conference.should.have.property('patients');
        return done();
      });
    });
    return it('should populate patients', function(done) {
      return saveOneConference(function(err, conference) {
        return Conference.findOne({
          _id: conference._id
        }).populate('patients').exec(function(err, conference) {
          should.not.exist(err);
          conference.should.have.property('date');
          conference.should.have.property('name');
          conference.should.have.property('patients');
          conference.patients.length.should.equal(3);
          conference.patients[0].should.have.property('mrn');
          return done();
        });
      });
    });
  });

  saveOneConference = function(callback) {
    return Patient.create([patient, patient2, patient3], function(err, pt, pt2, pt3) {
      var patient, patient2, patient3, _ref;
      _ref = [pt, pt2, pt3], patient = _ref[0], patient2 = _ref[1], patient3 = _ref[2];
      conference.patients = [patient._id, patient2._id, patient3._id];
      return Conference.create(conference, callback);
    });
  };

  patient = {
    mrn: '123ABC',
    name: 'Testing McPatient',
    age: 38
  };

  patient2 = {
    mrn: '493985',
    name: 'Testina McPatient',
    age: 35
  };

  patient3 = {
    mrn: 'AKD934',
    name: 'The Other One',
    age: 19
  };

  conference = {
    date: "2013-08-31",
    name: "Molecular Tumor Conference"
  };

}).call(this);
