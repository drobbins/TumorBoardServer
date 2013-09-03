Help = require './help'
should = require 'should'
request = require 'request'

describe 'Observation API', () ->

    before (done) ->
        Help.init done

    after (done) ->
        Help.deinit done

    patientUrl = "#{Help.url}/patients"
    sampleUrl = "#{Help.url}/samples"
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

        sample =
            type: 'Foundation Medicine Report'
            file: 'AKD934-FMR.pdf'

        sample2 =
            type: 'SNPs'
            file: '493985-snp.txt'

        observation =
            comment: 'Looks Good'
            tags: ['FMR', 'Bone Marrow']

        before (done) -> # Pre-load Patients and Samples
            request
                url: patientUrl
                method: 'POST'
                json: [patient, patient2, patient3]
                (err, resp, body) ->
                    done err if err
                    [patient, patient2, patient3] = body
                    sample.patient = patient3._id
                    sample2.patient = patient2._id
                    request
                        url: sampleUrl
                        method: 'POST'
                        json: [sample, sample2]
                        (err, resp, body) ->
                            done err if err
                            [sample, sample2] = body
                            done()

        it 'Create', (done) ->
            observation.sample = sample._id
            request
                url: observationUrl
                method: 'POST'
                json: observation
                (err, resp, body) ->
                    should.not.exist err
                    body.tags.should.eql observation.tags
                    body.comment.should.eql observation.comment
                    observation = body
                    done()

        it 'Read (query by sample id)', (done) ->
            conditions = JSON.stringify
                sample: sample._id
            request
                url: "#{observationUrl}?conditions=#{conditions}"
                method: 'GET'
                json: true
                (err, resp, body) ->
                    should.not.exist err
                    body.length.should.eql 1
                    obs = body[0]
                    obs.should.eql observation
                    done()

        it 'Update', (done) ->
            observation.tags.push 'New'
            request
                url: "#{observationUrl}/#{observation._id}"
                method: 'PUT'
                json:
                    tags: observation.tags
                (err, resp, body) ->
                    should.not.exist err
                    body.tags.should.include 'New'
                    done()

        it 'Delete', (done) ->
            request
                url: "#{observationUrl}/#{observation._id}"
                method: 'DELETE'
                json: true
                (err, resp, body) ->
                    should.not.exist err
                    request
                        url: observationUrl
                        method: 'GET'
                        json: true
                        (err, resp, body) ->
                            should.not.exist err
                            body.length.should.eql 0
                            done()
