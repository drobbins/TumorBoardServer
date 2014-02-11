Help = require './help'
should = require 'should'
request = require 'request'
req = {} #placeholder for wrapped request

describe 'Interpretation API', () ->

    before (done) ->
        req = request.defaults
            headers:
                'authorization': Help.authorization
        Help.init done

    after (done) ->
        Help.deinit done

    patientUrl = "#{Help.url}/patients"
    observationUrl = "#{Help.url}/observations"
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

        observation =
            type: 'Foundation Medicine Report'
            file: 'AKD934-FMR.pdf'

        observation2 =
            type: 'SNPs'
            file: '493985-snp.txt'

        interpretation =
            comment: 'Looks Good'
            tags: ['FMR', 'Bone Marrow']

        before (done) -> # Pre-load Patients and Observations
            req
                url: patientUrl
                method: 'POST'
                json: [patient, patient2, patient3]
                (err, resp, body) ->
                    done err if err
                    [patient, patient2, patient3] = body
                    observation.patient = patient3._id
                    observation2.patient = patient2._id
                    req
                        url: observationUrl
                        method: 'POST'
                        json: [observation, observation2]
                        (err, resp, body) ->
                            done err if err
                            [observation, observation2] = body
                            done()

        it 'Requires Auth', (done) ->
            request
                url: interpretationUrl
                method: 'GET'
                json: true
                (err, resp, body) ->
                    should.not.exist err
                    resp.statusCode.should.equal 401
                    done()

        it 'Create', (done) ->
            interpretation.observation = observation._id
            req
                url: interpretationUrl
                method: 'POST'
                json: interpretation
                (err, resp, body) ->
                    should.not.exist err
                    body.tags.should.eql interpretation.tags
                    body.comment.should.eql interpretation.comment
                    interpretation = body
                    done()

        it 'Read (query by observation id)', (done) ->
            conditions = JSON.stringify
                observation: observation._id
            req
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
            req
                url: "#{interpretationUrl}/#{interpretation._id}"
                method: 'PUT'
                json:
                    tags: interpretation.tags
                (err, resp, body) ->
                    should.not.exist err
                    body.tags.should.include 'New'
                    done()

        it 'Delete', (done) ->
            req
                url: "#{interpretationUrl}/#{interpretation._id}"
                method: 'DELETE'
                json: true
                (err, resp, body) ->
                    should.not.exist err
                    req
                        url: interpretationUrl
                        method: 'GET'
                        json: true
                        (err, resp, body) ->
                            should.not.exist err
                            body.length.should.eql 0
                            done()
