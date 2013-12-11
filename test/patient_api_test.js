(function() {
  var Help, request, should;

  Help = require('./help');

  should = require('should');

  request = require('request');

  describe('Patient API', function() {
    before(function(done) {
      return Help.init(done);
    });
    after(function(done) {
      return Help.deinit(done);
    });
    return describe('CRUD', function() {
      var patient, patient2, patient3, patientUrl;
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
      patientUrl = "" + Help.url + "/patients";
      it('Create (one)', function(done) {
        return request({
          url: patientUrl,
          method: 'POST',
          json: patient
        }, function(err, resp, body) {
          should.not.exist(err);
          body.should.have.property('mrn', patient.mrn);
          body.should.have.property('name', patient.name);
          body.should.have.property('age', patient.age);
          return done();
        });
      });
      it('Create (multiple)', function(done) {
        return request({
          url: patientUrl,
          method: 'POST',
          json: [patient2, patient3]
        }, function(err, resp, body) {
          var p3;
          should.not.exist(err);
          body.length.should.eql(2);
          p3 = body[1];
          p3.should.have.property('mrn', patient3.mrn);
          p3.should.have.property('name', patient3.name);
          p3.should.have.property('age', patient3.age);
          return done();
        });
      });
      it('Read (all)', function(done) {
        return request({
          url: patientUrl,
          method: 'GET',
          json: true
        }, function(err, resp, body) {
          var p2;
          should.not.exist(err);
          body.length.should.eql(3);
          p2 = body[1];
          p2.should.have.property('mrn', patient2.mrn);
          p2.should.have.property('name', patient2.name);
          p2.should.have.property('age', patient2.age);
          should.not.exist(resp.headers.location);
          return done();
        });
      });
      it('Read (query)', function(done) {
        var conditions;
        conditions = JSON.stringify({
          name: "The Other One"
        });
        return request({
          url: patientUrl + ("?conditions=" + conditions),
          method: 'GET',
          json: true
        }, function(err, resp, body) {
          var p3;
          should.not.exist(err);
          body.length.should.eql(1);
          p3 = body[0];
          p3.should.have.property('mrn', patient3.mrn);
          p3.should.have.property('name', patient3.name);
          p3.should.have.property('age', patient3.age);
          return done();
        });
      });
      it('Read (one by id)', function(done) {
        return request({
          url: patientUrl,
          method: 'GET',
          json: true
        }, function(err, resp, body) {
          should.not.exist(err);
          return request({
            url: "" + patientUrl + "/" + body[0]._id,
            method: 'GET',
            json: true
          }, function(err, resp, body) {
            should.not.exist(err);
            body.should.have.property('mrn', patient.mrn);
            body.should.have.property('name', patient.name);
            body.should.have.property('age', patient.age);
            return done();
          });
        });
      });
      it('Update (new field)', function(done) {
        var conditions;
        conditions = JSON.stringify({
          mrn: "123ABC"
        });
        return request({
          url: patientUrl + ("?conditions=" + conditions),
          method: 'GET',
          json: true
        }, function(err, resp, body) {
          var status;
          status = 'DECEASED';
          return request({
            url: "" + patientUrl + "/" + body[0]._id,
            method: 'PUT',
            json: {
              status: status
            }
          }, function(err, resp, body) {
            should.not.exist(err);
            body.should.have.property('mrn', patient.mrn);
            body.should.have.property('name', patient.name);
            body.should.have.property('age', patient.age);
            body.should.have.property('status', status);
            return done();
          });
        });
      });
      it('Update (update field)', function(done) {
        var conditions;
        conditions = JSON.stringify({
          mrn: "123ABC"
        });
        return request({
          url: patientUrl + ("?conditions=" + conditions),
          method: 'GET',
          json: true
        }, function(err, resp, body) {
          var newAge;
          newAge = 45;
          return request({
            url: "" + patientUrl + "/" + body[0]._id,
            method: 'PUT',
            json: {
              age: newAge
            }
          }, function(err, resp, body) {
            should.not.exist(err);
            body.should.have.property('mrn', patient.mrn);
            body.should.have.property('name', patient.name);
            body.should.have.property('age', newAge);
            return done();
          });
        });
      });
      return it('Delete (by condition)', function(done) {
        var conditions;
        conditions = JSON.stringify({
          mrn: "123ABC"
        });
        return request({
          url: patientUrl + ("?conditions=" + conditions),
          method: 'DELETE',
          json: true
        }, function(err, resp, body) {
          return request({
            url: patientUrl,
            method: 'GET',
            json: true
          }, function(err, resp, body) {
            should.not.exist(err);
            body.length.should.eql(2);
            return done();
          });
        });
      });
    });
  });

}).call(this);
