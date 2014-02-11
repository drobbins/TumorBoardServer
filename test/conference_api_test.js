(function() {
  var Help, req, request, should;

  Help = require('./help');

  should = require('should');

  request = require('request');

  req = {};

  describe('Conference API', function() {
    var conferenceUrl, patientUrl;
    before(function(done) {
      req = request.defaults({
        headers: {
          'authorization': Help.authorization
        }
      });
      return Help.init(done);
    });
    after(function(done) {
      return Help.deinit(done);
    });
    patientUrl = "" + Help.url + "/patients";
    conferenceUrl = "" + Help.url + "/conferences";
    return describe('CRUD', function() {
      var conference, patient, patient2, patient3;
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
      before(function(done) {
        return req({
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
      it('Requires Auth', function(done) {
        return request({
          url: conferenceUrl,
          method: 'GET',
          json: true
        }, function(err, resp, body) {
          should.not.exist(err);
          resp.statusCode.should.equal(401);
          return done();
        });
      });
      it('Create', function(done) {
        conference.patients = [patient._id, patient2._id, patient3._it];
        return req({
          url: conferenceUrl,
          method: 'POST',
          json: conference
        }, function(err, resp, body) {
          should.not.exist(err);
          body.name.should.eql(conference.name);
          body.date.slice(0, 10).should.eql(conference.date);
          conference = body;
          return done();
        });
      });
      it('Read (by id, with populate)', function(done) {
        var conditions;
        conditions = JSON.stringify({
          pat: {
            $elemMatch: patient2._id
          }
        });
        return req({
          url: "" + conferenceUrl + "/" + conference._id + "?populate=patients",
          method: 'GET',
          json: true
        }, function(err, resp, body) {
          should.not.exist(err);
          body.name.should.eql(conference.name);
          body.date.should.eql(conference.date);
          body.patients[0].should.eql(patient);
          return done();
        });
      });
      it('Update', function(done) {
        conference.name = "Multidisciplinary TB";
        return req({
          url: "" + conferenceUrl + "/" + conference._id,
          method: 'PUT',
          json: {
            name: conference.name
          }
        }, function(err, resp, body) {
          should.not.exist(err);
          body.name.should.eql(conference.name);
          return done();
        });
      });
      return it('Delete', function(done) {
        return req({
          url: "" + conferenceUrl + "/" + conference._id,
          method: 'DELETE'
        }, function(err, resp, body) {
          should.not.exist(err);
          return req({
            url: conferenceUrl,
            method: 'GET',
            json: true
          }, function(err, resp, body) {
            should.not.exist(err);
            body.length.should.eql(0);
            return done();
          });
        });
      });
    });
  });

}).call(this);
