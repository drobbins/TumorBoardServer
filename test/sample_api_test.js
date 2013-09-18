(function() {
  var Help, request, should;

  Help = require('./help');

  should = require('should');

  request = require('request');

  describe('Observation API', function() {
    var observationUrl, patientUrl;
    before(function(done) {
      return Help.init(done);
    });
    after(function(done) {
      return Help.deinit(done);
    });
    patientUrl = "" + Help.url + "/patients";
    observationUrl = "" + Help.url + "/observations";
    return describe('CRUD', function() {
      var observation, patient, patient2, patient3;
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
      observation = {
        type: 'Foundation Medicine Report',
        file: 'AKD934-FMR.pdf'
      };
      before(function(done) {
        return request({
          url: patientUrl,
          method: 'POST',
          json: [patient, patient2, patient3]
        }, function(err, resp, body) {
          if (err) {
            done(err);
          }
          patient = body[0], patient2 = body[1], patient3 = body[2];
          return done();
        });
      });
      it('Create', function(done) {
        observation.patient = patient3._id;
        return request({
          url: observationUrl,
          method: 'POST',
          json: observation
        }, function(err, resp, body) {
          should.not.exist(err);
          body.should.have.property('type', observation.type);
          body.should.have.property('patient', observation.patient);
          body.should.have.property('file', observation.file);
          observation._id = body._id;
          return done();
        });
      });
      it('Read (query)', function(done) {
        var conditions;
        conditions = JSON.stringify({
          type: 'Foundation Medicine Report'
        });
        return request({
          url: "" + observationUrl + "?conditions=" + conditions,
          method: 'GET',
          json: true
        }, function(err, resp, body) {
          should.not.exist(err);
          body.length.should.eql(1);
          return done();
        });
      });
      it('Update', function(done) {
        return request({
          url: "" + observationUrl + "/" + observation._id,
          method: 'PUT',
          json: {
            dateReceived: '2013-08-29'
          }
        }, function(err, resp, body) {
          should.not.exist(err);
          body.should.have.property('type', observation.type);
          body.should.have.property('patient', observation.patient);
          body.should.have.property('file', observation.file);
          body.should.have.property('dateReceived', '2013-08-29');
          return done();
        });
      });
      return it('Delete', function(done) {
        return request({
          url: "" + observationUrl + "/" + observation._id,
          method: 'DELETE',
          json: true
        }, function(err, resp, body) {
          should.not.exist(err);
          return done();
        });
      });
    });
  });

}).call(this);
