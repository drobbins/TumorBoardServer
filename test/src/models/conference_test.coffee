Conference = require '../dist/conference'
Patient = require '../dist/patient'
Help = require './help'
should = require 'should'

describe 'Conference Model', () ->

    before (done) ->
        Help.startMongo done

    after (done) ->
        Help.stopMongo done

    afterEach (done) ->
      # Empty collections after each test
        Conference.remove {}, () ->
            Patient.remove {}, done

    it 'should allow creation', (done) ->
        saveOneConference (err, conference) ->
            should.not.exist err
            conference.should.have.property 'date'
            conference.should.have.property 'name'
            conference.should.have.property 'patients'
            done()

    it 'should populate patients', (done) ->
        saveOneConference (err, conference) ->
            Conference.findOne({ _id: conference._id }).populate('patients').exec (err, conference) ->
                should.not.exist err
                conference.should.have.property 'date'
                conference.should.have.property 'name'
                conference.should.have.property 'patients'
                conference.patients.length.should.equal 3
                conference.patients[0].should.have.property 'mrn'
                done()



# Helper functions
saveOneConference = (callback) ->
    Patient.create [patient, patient2, patient3], (err, pt, pt2, pt3) ->
        [patient, patient2, patient3] = [pt, pt2, pt3]
        conference.patients = [ patient._id, patient2._id, patient3._id ]
        Conference.create conference, callback

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
