(function() {
  var Help, request, should;

  Help = require('./help');

  should = require('should');

  request = require('request');

  describe('Sample API', function() {
    var patientUrl, sampleUrl;
    before(function(done) {
      return Help.init(done);
    });
    after(function(done) {
      return Help.deinit(done);
    });
    patientUrl = "" + Help.url + "/patients";
    sampleUrl = "" + Help.url + "/samples";
    return describe('CRUD', function() {
      var patient, patient2, patient3, sample;
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
      sample = {
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
        sample.patient = patient3._id;
        return request({
          url: sampleUrl,
          method: 'POST',
          json: sample
        }, function(err, resp, body) {
          should.not.exist(err);
          body.should.have.property('type', sample.type);
          body.should.have.property('patient', sample.patient);
          body.should.have.property('file', sample.file);
          sample._id = body._id;
          return done();
        });
      });
      it('Read (query)', function(done) {
        var conditions;
        conditions = JSON.stringify({
          type: 'Foundation Medicine Report'
        });
        return request({
          url: "" + sampleUrl + "?conditions=" + conditions,
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
          url: "" + sampleUrl + "/" + sample._id,
          method: 'PUT',
          json: {
            dateReceived: '2013-08-29'
          }
        }, function(err, resp, body) {
          should.not.exist(err);
          body.should.have.property('type', sample.type);
          body.should.have.property('patient', sample.patient);
          body.should.have.property('file', sample.file);
          body.should.have.property('dateReceived', '2013-08-29');
          return done();
        });
      });
      return it('Delete', function(done) {
        return request({
          url: "" + sampleUrl + "/" + sample._id,
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
