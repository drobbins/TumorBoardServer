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
        saveOneObservation (err, things) ->
            should.not.exist err
            things.observation.should.have.property 'sample'
            things.observation.should.have.property 'comment'
            done()

    it 'should allow finding by sample', (done) ->
        saveOneObservation (err, things) ->
            Observation.find
                sample: things.sample._id
                (err, observations) ->
                    should.not.exist err
                    observation = observations[0]
                    #observation.should.eql things.observation
                    observation._id.should.eql things.observation._id
                    observation.comment.should.eql things.observation.comment
                    done()

    xit 'should allow finding by patient'

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
                Observation.create observation, (err, observation) ->
                    callback err,
                        sample: sample
                        observation: observation
                        patient: patient
