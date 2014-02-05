(function() {
  var Help, req, request, should;

  Help = require('./help');

  should = require('should');

  request = require('request');

  req = {};

  describe('Interpretation API', function() {
    var interpretationUrl, observationUrl, patientUrl;
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
    observationUrl = "" + Help.url + "/observations";
    interpretationUrl = "" + Help.url + "/interpretations";
    return describe('CRUD', function() {
      var interpretation, observation, observation2, patient, patient2, patient3;
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
      observation2 = {
        type: 'SNPs',
        file: '493985-snp.txt'
      };
      interpretation = {
        comment: 'Looks Good',
        tags: ['FMR', 'Bone Marrow']
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
          observation.patient = patient3._id;
          observation2.patient = patient2._id;
          return req({
            url: observationUrl,
            method: 'POST',
            json: [observation, observation2]
          }, function(err, resp, body) {
            if (err) {
              done(err);
            }
            observation = body[0], observation2 = body[1];
            return done();
          });
        });
      });
      it('Create', function(done) {
        interpretation.observation = observation._id;
        return req({
          url: interpretationUrl,
          method: 'POST',
          json: interpretation
        }, function(err, resp, body) {
          should.not.exist(err);
          body.tags.should.eql(interpretation.tags);
          body.comment.should.eql(interpretation.comment);
          interpretation = body;
          return done();
        });
      });
      it('Read (query by observation id)', function(done) {
        var conditions;
        conditions = JSON.stringify({
          observation: observation._id
        });
        return req({
          url: "" + interpretationUrl + "?conditions=" + conditions,
          method: 'GET',
          json: true
        }, function(err, resp, body) {
          var obs;
          should.not.exist(err);
          body.length.should.eql(1);
          obs = body[0];
          obs.should.eql(interpretation);
          return done();
        });
      });
      it('Update', function(done) {
        interpretation.tags.push('New');
        return req({
          url: "" + interpretationUrl + "/" + interpretation._id,
          method: 'PUT',
          json: {
            tags: interpretation.tags
          }
        }, function(err, resp, body) {
          should.not.exist(err);
          body.tags.should.include('New');
          return done();
        });
      });
      return it('Delete', function(done) {
        return req({
          url: "" + interpretationUrl + "/" + interpretation._id,
          method: 'DELETE',
          json: true
        }, function(err, resp, body) {
          should.not.exist(err);
          return req({
            url: interpretationUrl,
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
