Help = require './help'
should = require 'should'
request = require 'request'

describe 'Sample API', () ->

    before (done) ->
        Help.init done

    after (done) ->
        Help.deinit done

    patientUrl = "#{Help.url}/patients"
    sampleUrl = "#{Help.url}/samples"

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

        sample =
            type: 'Foundation Medicine Report'
            file: 'AKD934-FMR.pdf'

        before (done) ->
            request
                url: patientUrl
                method: 'POST'
                json: [patient, patient2, patient3]
                (err, resp, body) ->
                    if err then callback?(err) else
                        [patient, patient2, patient3] = body
                        done()

        it 'Create', (done) ->
            sample.patient = patient3._id
            request
                url: sampleUrl
                method: 'POST'
                json: sample
                (err, resp, body) ->
                    should.not.exist err
                    body.should.have.property 'type', sample.type
                    body.should.have.property 'patient', sample.patient
                    body.should.have.property 'file', sample.file
                    sample._id = body._id
                    done()

        it 'Read (query)', (done) ->
            conditions = JSON.stringify
                type: 'Foundation Medicine Report'
            request
                url: "#{sampleUrl}?conditions=#{conditions}"
                method: 'GET'
                json: true
                (err, resp, body) ->
                    should.not.exist err
                    body.length.should.eql 1
                    done()

        it 'Update', (done) ->
            request
                url: "#{sampleUrl}/#{sample._id}"
                method: 'PUT'
                json:
                    dateReceived: '2013-08-29'
                (err, resp, body) ->
                    should.not.exist err
                    body.should.have.property 'type', sample.type
                    body.should.have.property 'patient', sample.patient
                    body.should.have.property 'file', sample.file
                    body.should.have.property 'dateReceived', '2013-08-29'
                    done()

        it 'Delete', (done) ->
            request
                url: "#{sampleUrl}/#{sample._id}"
                method: 'DELETE'
                json: true
                (err, resp, body) ->
                    should.not.exist err
                    done()
