Sample = require '../dist/sample'
Observation = require '../dist/observation'
Patient = require '../dist/patient'
Help = require './help'
should = require 'should'

describe 'Observation Model', () ->

    afterEach (done) ->
        Sample.remove {}, (err) ->
            done err if err
            Observation.remove {}, done

    it 'should allow creation', (done) ->
        saveOneObservation (err, observation) ->
            should.not.exist err
            observation.should.have.property 'sample'
            observation.should.have.property 'comment'
            done()

# Helper Functions
saveOneObservation = (callback) ->
    patient =
        mrn: '1234'
        name: 'Test Patient'
    sample =
        patient: null # will be patient._id
        type: "Foundation Medicine Report"
        value: 1234
    observation =
        sample: null # will be sample._id
        comment: "Looks good"
    Patient.create patient, (err, patient) ->
            sample.patient = patient._id
            Sample.create sample, (err, sample) ->
                observation.sample = sample._id
                Observation.create observation, callback
