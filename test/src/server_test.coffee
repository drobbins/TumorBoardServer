should = require 'should'
request = require 'request'
server = require '../dist/server'

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

        options =
            port: 8888

        beforeEach () ->
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
