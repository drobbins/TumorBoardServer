Patient = require '../dist/patient'
Help = require './help'
should = require 'should'

describe 'Patient Model', () ->

    afterEach (done) ->
        Patient.remove {}, done # Empty the patient collection after each test.

    it 'should save a patient with just name and mrn', (done) ->
        testPatient =
            mrn: '1234'
            name: 'TestMcPatient'
        Patient.create testPatient,
            (err, patient) ->
                should.not.exist err
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
                should.not.exist err
                patient = patient.toObject() # Convert from a mongoose model to just an object
                patient.should.have.property 'name',testPatient.name
                patient.should.have.property 'mrn', testPatient.mrn
                patient.should.have.property 'age', testPatient.age
                done()

    it 'should require name', (done) ->
        Patient.create
            mrn: '1234'
            (err, patient) ->
                should.exist err
                err.errors.name.type.should.equal 'required'
                done()

    it 'should require mrn', (done) ->
        Patient.create
            name: '1234'
            (err, patient) ->
                should.exist err
                err.errors.mrn.type.should.equal 'required'
                done()
