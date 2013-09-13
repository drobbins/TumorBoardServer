(function() {
  var request, server, should;

  should = require('should');

  request = require('request');

  server = require('../dist/server');

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
      options = {
        port: 8888
      };
      beforeEach(function() {
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
      return it('baucis should work with a route prefix (basepath)', function(done) {
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
    });
  });

}).call(this);
