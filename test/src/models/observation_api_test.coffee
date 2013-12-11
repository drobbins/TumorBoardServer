fs = require 'fs'
Help = require './help'
should = require 'should'
request = require 'request'

describe 'Observation API', () ->

    before (done) ->
        Help.init done

    after (done) ->
        Help.deinit done

    patientUrl = "#{Help.url}/patients"
    observationUrl = "#{Help.url}/observations"

    describe 'CRUD', () ->

        patient =
            mrn: '123ABC'
            name: 'Testing McPatient'
            age: 38

        patient2 =
            mrn: '493985'
            name: 'Testina McPatient'
            age: 35

        patient3 =
            mrn: 'AKD934'
            name: 'The Other One'
            age: 19

        observation =
            type: 'Foundation Medicine Report'
            file: 'AKD934-FMR.pdf'

        testFilePath = 'test/TestFile.pdf'
        originalFile = fs.readFileSync testFilePath

        before (done) ->
            request
                url: patientUrl
                method: 'POST'
                json: [patient, patient2, patient3]
                (err, resp, body) ->
                    done err if err
                    [patient, patient2, patient3] = body
                    done()

        it 'Create', (done) ->
            observation.patient = patient3._id
            request
                url: observationUrl
                method: 'POST'
                json: observation
                (err, resp, body) ->
                    should.not.exist err
                    body.should.have.property 'type', observation.type
                    body.should.have.property 'patient', observation.patient
                    body.should.have.property 'file', observation.file
                    observation._id = body._id
                    done()

        it 'Read (query)', (done) ->
            conditions = JSON.stringify
                type: 'Foundation Medicine Report'
            request
                url: "#{observationUrl}?conditions=#{conditions}"
                method: 'GET'
                json: true
                (err, resp, body) ->
                    should.not.exist err
                    body.length.should.eql 1
                    done()

        it 'Read (by ID)', (done) ->
            request
                url: "#{observationUrl}/#{observation._id}"
                method: 'GET'
                json: true
                (err, resp, body) ->
                    should.not.exist err
                    body.should.have.property 'type', observation.type
                    body.should.have.property 'patient', observation.patient
                    body.should.have.property 'file', observation.file
                    done()


        it 'Update', (done) ->
            request
                url: "#{observationUrl}/#{observation._id}"
                method: 'PUT'
                json:
                    dateReceived: '2013-08-29'
                (err, resp, body) ->
                    should.not.exist err
                    body.should.have.property 'type', observation.type
                    body.should.have.property 'patient', observation.patient
                    body.should.have.property 'file', observation.file
                    body.should.have.property 'dateReceived', '2013-08-29'
                    done()

        it 'Put File', (done) ->
            url = "#{observationUrl}/#{observation._id}/file"
            fs.createReadStream(testFilePath).pipe request.put url, (err, resp, body) ->
                should.not.exist err
                resp.statusCode.should.eql 201
                body = JSON.parse body
                body.length.should.eql originalFile.length
                done()

        it 'Get File', (done) ->
            request.get("#{observationUrl}/#{observation._id}/file").pipe(file = fs.createWriteStream('temp.pdf'))
            file.on 'finish', () ->
                writtenFile = fs.readFileSync 'temp.pdf'
                writtenFile.length.should.eql originalFile.length
                fs.unlinkSync 'temp.pdf'
                done()

        it 'Delete File', (done) ->
            request
                url: "#{observationUrl}/#{observation._id}/file"
                method: 'DELETE'
                (err, resp, body) ->
                    should.not.exist err
                    resp.statusCode.should.eql 200
                    done()

        it 'Don\'t Get File After Delete', (done) ->
            callback = (err, resp) ->
                should.not.exist err
                resp.statusCode.should.eql 404
                done()
            request.get("#{observationUrl}/#{observation._id}/file", callback)

        it 'Delete', (done) ->
            request
                url: "#{observationUrl}/#{observation._id}"
                method: 'DELETE'
                json: true
                (err, resp, body) ->
                    should.not.exist err
                    resp.statusCode.should.eql 200
                    done()
