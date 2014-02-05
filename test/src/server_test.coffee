should = require 'should'
request = require 'request'
server = require '../dist/server'
help = require './help'

describe 'Tumor Board Server', () ->

    describe 'server.config', () ->

        it 'should map the given options into express app settings', () ->
            options =
                port: 8888
            server.config options
            server.get("port").should.equal options.port

    describe 'server.clear', () ->

        it 'should clear any previously configured settings', () ->
            options =
                port: 8888
            server.config options
            server.clear()
            should.not.exist server.get("port")

    describe 'basic server functionality', () ->

        options = {}

        beforeEach () ->
            options =
                port: 8888
            server.clear()

        it 'should listen after server.listen, and stop after server.close', (done) ->
            server.config options
            server.listen.should.not.throw()
            request 'http://localhost:8888/hello', (err, resp, body) ->
                should.not.exist err
                resp.statusCode.should.equal 200
                body.should.equal 'Hello World'
                server.close () ->
                    request 'http://localhost:8888/hello', (err, resp, body) ->
                        should.exist err
                        done()

        it 'should accept a port # for server.listen', (done) ->
            server.config options
            server.listen(7777)
            request 'http://localhost:7777/hello', (err, resp, body) ->
                should.not.exist err
                resp.statusCode.should.equal 200
                body.should.equal 'Hello World'
                server.close done

        it 'should accept a route prefix (basepath)', (done) ->
            options.prefix = '/tboards'
            server.config options
            server.listen(7777)
            request 'http://localhost:7777/tboards/hello', (err, resp, body) ->
                should.not.exist err
                resp.statusCode.should.equal 200
                body.should.equal 'Hello World'
                server.close done

        it 'baucis should work with a route prefix (basepath)', (done) ->
            options.prefix = '/tboards'
            server.config options
            server.listen(7777)
            url = 'http://localhost:7777/tboards/api/v1/api-docs'
            request
                url: url
                json: true
                (err, resp, body) ->
                    should.not.exist err
                    resp.statusCode.should.equal 200
                    body.basePath.should.equal url.slice 0,-9
                    body.apis.length.should.be.above 0
                    server.close done

        it 'should appropriately support CORS', (done) ->
            server.config options
            server.listen()
            request
                url: 'http://localhost:8888/'
                method: "OPTIONS"
                headers:
                    'origin': 'example.com'
                    'accept-control-request-headers': 'x-requested-with'
                    'access-control-request-method': 'GET'
                (err, resp, body) ->
                    should.not.exist err
                    resp.statusCode.should.equal 204
                    resp.headers.should.have.property 'access-control-allow-headers'
                    request
                        url: 'http://localhost:8888/api/v1/api-docs'
                        headers:
                            'origin': 'example.com'
                            'x-requested-with': 'bunnies'
                        (err, resp, body) ->
                            should.not.exist err
                            resp.headers.should.have.property 'access-control-allow-origin', '*'
                            server.close done

        it 'should fail to access /secure without authentication', (done) ->
            server.config options
            server.listen()
            request
                url: 'http://localhost:8888/secure'
                method: 'GET'
                (err, resp, body) ->
                    should.not.exist err
                    resp.statusCode.should.equal 401
                    server.close done

        it 'should succeed to access /secure with authentication', (done) ->
            server.config options
            server.listen()
            request
                url: 'http://localhost:8888/secure'
                method: 'GET'
                headers:
                    'authorization': "Basic #{help.btoa("tb:tb")}"
                (err, resp, body) ->
                    should.not.exist err
                    resp.statusCode.should.equal 200
                    body.should.equal "Authorized"
                    server.close done
