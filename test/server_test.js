(function() {
  var help, request, server, should;

  should = require('should');

  request = require('request');

  server = require('../dist/server');

  help = require('./help');

  describe('Tumor Board Server', function() {
    describe('server.config', function() {
      return it('should map the given options into express app settings', function() {
        var options;
        options = {
          port: 8888
        };
        server.config(options);
        return server.get("port").should.equal(options.port);
      });
    });
    describe('server.clear', function() {
      return it('should clear any previously configured settings', function() {
        var options;
        options = {
          port: 8888
        };
        server.config(options);
        server.clear();
        return should.not.exist(server.get("port"));
      });
    });
    return describe('basic server functionality', function() {
      var options;
      options = {};
      beforeEach(function() {
        options = {
          port: 8888
        };
        return server.clear();
      });
      it('should listen after server.listen, and stop after server.close', function(done) {
        server.config(options);
        server.listen.should.not["throw"]();
        return request('http://localhost:8888/hello', function(err, resp, body) {
          should.not.exist(err);
          resp.statusCode.should.equal(200);
          body.should.equal('Hello World');
          return server.close(function() {
            return request('http://localhost:8888/hello', function(err, resp, body) {
              should.exist(err);
              return done();
            });
          });
        });
      });
      it('should accept a port # for server.listen', function(done) {
        server.config(options);
        server.listen(7777);
        return request('http://localhost:7777/hello', function(err, resp, body) {
          should.not.exist(err);
          resp.statusCode.should.equal(200);
          body.should.equal('Hello World');
          return server.close(done);
        });
      });
      it('should accept a route prefix (basepath)', function(done) {
        options.prefix = '/tboards';
        server.config(options);
        server.listen(7777);
        return request('http://localhost:7777/tboards/hello', function(err, resp, body) {
          should.not.exist(err);
          resp.statusCode.should.equal(200);
          body.should.equal('Hello World');
          return server.close(done);
        });
      });
      it('baucis should work with a route prefix (basepath)', function(done) {
        var url;
        options.prefix = '/tboards';
        server.config(options);
        server.listen(7777);
        url = 'http://localhost:7777/tboards/api/v1/api-docs';
        return request({
          url: url,
          json: true
        }, function(err, resp, body) {
          should.not.exist(err);
          resp.statusCode.should.equal(200);
          body.basePath.should.equal(url.slice(0, -9));
          body.apis.length.should.be.above(0);
          return server.close(done);
        });
      });
      it('should appropriately support CORS', function(done) {
        server.config(options);
        server.listen();
        return request({
          url: 'http://localhost:8888/',
          method: "OPTIONS",
          headers: {
            'origin': 'example.com',
            'accept-control-request-headers': 'x-requested-with',
            'access-control-request-method': 'GET'
          }
        }, function(err, resp, body) {
          should.not.exist(err);
          resp.statusCode.should.equal(204);
          resp.headers.should.have.property('access-control-allow-headers');
          return request({
            url: 'http://localhost:8888/api/v1/api-docs',
            headers: {
              'origin': 'example.com',
              'x-requested-with': 'bunnies'
            }
          }, function(err, resp, body) {
            should.not.exist(err);
            resp.headers.should.have.property('access-control-allow-origin', '*');
            return server.close(done);
          });
        });
      });
      it('should fail to access /secure without authentication', function(done) {
        server.config(options);
        server.listen();
        return request({
          url: 'http://localhost:8888/secure',
          method: 'GET'
        }, function(err, resp, body) {
          should.not.exist(err);
          resp.statusCode.should.equal(401);
          return server.close(done);
        });
      });
      return it('should succeed to access /secure with authentication', function(done) {
        server.config(options);
        server.listen();
        return request({
          url: 'http://localhost:8888/secure',
          method: 'GET',
          headers: {
            'authorization': "Basic " + (help.btoa("tb:tb"))
          }
        }, function(err, resp, body) {
          should.not.exist(err);
          resp.statusCode.should.equal(200);
          body.should.equal("Authorized");
          return server.close(done);
        });
      });
    });
  });

}).call(this);
