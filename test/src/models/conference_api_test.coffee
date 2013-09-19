Help = require './help'
should = require 'should'
request = require 'request'

describe 'Conference API', () ->

    before (done) ->
        Help.init done

    after (done) ->
        Help.deinit done

    patientUrl = "#{Help.url}/patients"
    conferenceUrl = "#{Help.url}/conferences"

    describe 'CRUD', () ->

      # Helper Data
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

        conference =
            date: "2013-08-31"
            name: "Molecular Tumor Conference"

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
            conference.patients = [patient._id, patient2._id, patient3._it]
            request
                url: conferenceUrl
                method: 'POST'
                json: conference
                (err, resp, body) ->
                    should.not.exist err
                    body.name.should.eql conference.name
                    body.date.slice(0,10).should.eql conference.date
                    conference = body
                    done()

        it 'Read (by id, with populate)', (done) ->
            conditions = JSON.stringify
                pat:
                    $elemMatch: patient2._id
            request
                url: "#{conferenceUrl}/#{conference._id}?populate=patients"
                method: 'GET'
                json: true
                (err, resp, body) ->
                    should.not.exist err
                    body.name.should.eql conference.name
                    body.date.should.eql conference.date
                    body.patients[0].should.eql patient
                    done()

        it 'Update', (done) ->
            conference.name = "Multidisciplinary TB"
            request
                url: "#{conferenceUrl}/#{conference._id}"
                method: 'PUT'
                json:
                    name: conference.name
                (err, resp, body) ->
                    should.not.exist err
                    body.name.should.eql conference.name
                    done()

        it 'Delete', (done) ->
            request
                url: "#{conferenceUrl}/#{conference._id}"
                method: 'DELETE'
                (err, resp, body) ->
                    should.not.exist err
                    request
                        url: conferenceUrl
                        method: 'GET'
                        json: true
                        (err, resp, body) ->
                            should.not.exist err
                            body.length.should.eql 0
                            done()
