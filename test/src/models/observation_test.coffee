Observation = require '../dist/observation'
Patient = require '../dist/patient'
Help = require './help'
should = require 'should'

describe 'Observation Model', () ->

    before (done) ->
        Help.startMongo done

    after (done) ->
        Help.stopMongo done

    afterEach (done) ->
        Observation.remove {}, (err) ->
            done err if err
            Patient.remove {}, done

    it 'should allow creation', (done) ->
        saveOneObservation (err, observation) ->
            should.not.exist err
            observation.should.have.property 'patient'
            observation.should.have.property 'type'
            observation.should.have.property 'value'
            done()

    it 'should be findable by patient', (done) ->
        saveOneObservation (err) ->
            Patient.findOne (err, patient) ->
                Observation.find
                    patient: patient._id
                    (err, observation) ->
                        should.not.exist err
                        done()


# Helper Functions
saveOneObservation = (callback) ->
    patient =
        mrn: '1234'
        name: 'Test Patient'
    Patient.create patient,
        (err, patient) ->
            observation =
                patient: patient._id
                type: "Foundation Medicine Report"
                value: 1234
            Observation.create observation, callback
