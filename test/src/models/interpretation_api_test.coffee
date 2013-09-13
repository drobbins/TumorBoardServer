Help = require './help'
should = require 'should'
request = require 'request'

describe 'Interpretation API', () ->

    before (done) ->
        Help.init done

    after (done) ->
        Help.deinit done

    patientUrl = "#{Help.url}/patients"
    sampleUrl = "#{Help.url}/samples"
    interpretationUrl = "#{Help.url}/interpretations"

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

        interpretation =
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
            interpretation.sample = sample._id
            request
                url: interpretationUrl
                method: 'POST'
                json: interpretation
                (err, resp, body) ->
                    should.not.exist err
                    body.tags.should.eql interpretation.tags
                    body.comment.should.eql interpretation.comment
                    interpretation = body
                    done()

        it 'Read (query by sample id)', (done) ->
            conditions = JSON.stringify
                sample: sample._id
            request
                url: "#{interpretationUrl}?conditions=#{conditions}"
                method: 'GET'
                json: true
                (err, resp, body) ->
                    should.not.exist err
                    body.length.should.eql 1
                    obs = body[0]
                    obs.should.eql interpretation
                    done()

        it 'Update', (done) ->
            interpretation.tags.push 'New'
            request
                url: "#{interpretationUrl}/#{interpretation._id}"
                method: 'PUT'
                json:
                    tags: interpretation.tags
                (err, resp, body) ->
                    should.not.exist err
                    body.tags.should.include 'New'
                    done()

        it 'Delete', (done) ->
            request
                url: "#{interpretationUrl}/#{interpretation._id}"
                method: 'DELETE'
                json: true
                (err, resp, body) ->
                    should.not.exist err
                    request
                        url: interpretationUrl
                        method: 'GET'
                        json: true
                        (err, resp, body) ->
                            should.not.exist err
                            body.length.should.eql 0
                            done()
