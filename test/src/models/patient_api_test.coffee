Help = require './help'
should = require 'should'
request = require 'request'
req = {}

describe 'Patient API', () ->

    before (done) ->
        req = request.defaults
            headers:
                'authorization': Help.authorization
        Help.init done

    after (done) ->
        Help.deinit done

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

        patientUrl = "#{Help.url}/patients"

        it 'Create (one)', (done) ->
            req
                url: patientUrl
                method: 'POST'
                json: patient
                (err, resp, body) ->
                    should.not.exist err
                    body.should.have.property 'mrn', patient.mrn
                    body.should.have.property 'name', patient.name
                    body.should.have.property 'age', patient.age
                    done()

        it 'Create (multiple)', (done) ->
            req
                url: patientUrl
                method: 'POST'
                json: [patient2, patient3]
                (err, resp, body) ->
                    should.not.exist err
                    body.length.should.eql 2
                    p3 = body[1] # patient3 should be the second element returned
                    p3.should.have.property 'mrn', patient3.mrn
                    p3.should.have.property 'name', patient3.name
                    p3.should.have.property 'age', patient3.age
                    done()

        it 'Read (all)', (done) ->
            req
                url: patientUrl
                method: 'GET'
                json: true
                (err, resp, body) ->
                    should.not.exist err
                    body.length.should.eql 3
                    p2 = body[1] # patient2 should be second element returned: [patient, patient2, patient3]
                    p2.should.have.property 'mrn', patient2.mrn
                    p2.should.have.property 'name', patient2.name
                    p2.should.have.property 'age', patient2.age
                    should.not.exist resp.headers.location
                    done()

        it 'Read (query)', (done) ->
            conditions = JSON.stringify
                name: "The Other One"
            req
                url: patientUrl + "?conditions=#{conditions}"
                method: 'GET'
                json: true
                (err, resp, body) ->
                    should.not.exist err
                    body.length.should.eql 1
                    p3 = body[0]
                    p3.should.have.property 'mrn', patient3.mrn
                    p3.should.have.property 'name', patient3.name
                    p3.should.have.property 'age', patient3.age
                    done()

        it 'Read (one by id)', (done) ->
            req
                url: patientUrl
                method: 'GET'
                json: true
                (err, resp, body) ->
                    should.not.exist err
                    req
                        url: "#{patientUrl}/#{body[0]._id}"
                        method: 'GET'
                        json: true
                        (err, resp, body) ->
                            should.not.exist err
                            body.should.have.property 'mrn', patient.mrn
                            body.should.have.property 'name', patient.name
                            body.should.have.property 'age', patient.age
                            done()

        it 'Update (new field)', (done) ->
            conditions = JSON.stringify
                mrn: "123ABC"
            req
                url: patientUrl + "?conditions=#{conditions}"
                method: 'GET'
                json: true
                (err, resp, body) ->
                    status = 'DECEASED'
                    req
                        url: "#{patientUrl}/#{body[0]._id}"
                        method: 'PUT'
                        json:
                            status: status #Only need to include the fields to be updated
                        (err, resp, body) ->
                            should.not.exist err
                            body.should.have.property 'mrn', patient.mrn
                            body.should.have.property 'name', patient.name
                            body.should.have.property 'age', patient.age
                            body.should.have.property 'status', status
                            done()

        it 'Update (update field)', (done) ->
            conditions = JSON.stringify
                mrn: "123ABC"
            req
                url: patientUrl + "?conditions=#{conditions}"
                method: 'GET'
                json: true
                (err, resp, body) ->
                    newAge = 45
                    req
                        url: "#{patientUrl}/#{body[0]._id}"
                        method: 'PUT'
                        json:
                            age: newAge #Only need to include the fields to be updated
                        (err, resp, body) ->
                            should.not.exist err
                            body.should.have.property 'mrn', patient.mrn
                            body.should.have.property 'name', patient.name
                            body.should.have.property 'age', newAge
                            done()

        it 'Delete (by condition)', (done) ->
            conditions = JSON.stringify
                mrn: "123ABC"
            req
                url: patientUrl + "?conditions=#{conditions}"
                method: 'DELETE'
                json: true
                (err, resp, body) ->
                    req
                        url: patientUrl
                        method: 'GET'
                        json: true
                        (err, resp, body) ->
                            should.not.exist err
                            body.length.should.eql 2
                            done()


