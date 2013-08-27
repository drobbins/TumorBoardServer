Patient = require '../dist/patient'
Help = require './help'

describe 'Patient Model', () ->

    afterEach (done) ->
        Patient.remove {}, done # Empty the patient collection after each test.

    it 'should save a patient with just name and mrn', (done) ->
        testPatient =
            mrn: '1234'
            name: 'TestMcPatient'
        Patient.create testPatient,
            (err, patient) ->
                patient.should.have.property 'name',testPatient.name
                patient.should.have.property 'mrn', testPatient.mrn
                done()

    it 'should allow saving values not defined in the schema', (done) ->
        testPatient =
            mrn: '1234'
            name: 'TestMcPatient'
            age: '98'
        Patient.create testPatient,
            (err, patient) ->
                patient = patient.toObject() # Convert from a mongoose model to just an object
                patient.should.have.property 'name',testPatient.name
                patient.should.have.property 'mrn', testPatient.mrn
                patient.should.have.property 'age', testPatient.age
                done()
