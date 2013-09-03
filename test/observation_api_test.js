(function() {
  var Help, request, should;

  Help = require('./help');

  should = require('should');

  request = require('request');

  describe('Observation API', function() {
    var observationUrl, patientUrl, sampleUrl;
    before(function(done) {
      return Help.init(done);
    });
    after(function(done) {
      return Help.deinit(done);
    });
    patientUrl = "" + Help.url + "/patients";
    sampleUrl = "" + Help.url + "/samples";
    observationUrl = "" + Help.url + "/observations";
    return describe('CRUD', function() {
      var observation, patient, patient2, patient3, sample, sample2;
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
      sample2 = {
        type: 'SNPs',
        file: '493985-snp.txt'
      };
      observation = {
        comment: 'Looks Good',
        tags: ['FMR', 'Bone Marrow']
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
          sample.patient = patient3._id;
          sample2.patient = patient2._id;
          return request({
            url: sampleUrl,
            method: 'POST',
            json: [sample, sample2]
          }, function(err, resp, body) {
            if (err) {
              done(err);
            }
            sample = body[0], sample2 = body[1];
            return done();
          });
        });
      });
      it('Create', function(done) {
        observation.sample = sample._id;
        return request({
          url: observationUrl,
          method: 'POST',
          json: observation
        }, function(err, resp, body) {
          should.not.exist(err);
          body.tags.should.eql(observation.tags);
          body.comment.should.eql(observation.comment);
          observation = body;
          return done();
        });
      });
      it('Read (query by sample id)', function(done) {
        var conditions;
        conditions = JSON.stringify({
          sample: sample._id
        });
        return request({
          url: "" + observationUrl + "?conditions=" + conditions,
          method: 'GET',
          json: true
        }, function(err, resp, body) {
          var obs;
          should.not.exist(err);
          body.length.should.eql(1);
          obs = body[0];
          obs.should.eql(observation);
          return done();
        });
      });
      it('Update', function(done) {
        observation.tags.push('New');
        return request({
          url: "" + observationUrl + "/" + observation._id,
          method: 'PUT',
          json: {
            tags: observation.tags
          }
        }, function(err, resp, body) {
          should.not.exist(err);
          body.tags.should.include('New');
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
          return request({
            url: observationUrl,
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
