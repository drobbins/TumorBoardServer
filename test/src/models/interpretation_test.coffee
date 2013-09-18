Observation = require '../dist/observation'
Interpretation = require '../dist/interpretation'
Patient = require '../dist/patient'
Help = require './help'
should = require 'should'

describe 'Interpretation Model', () ->

    before (done) ->
        Help.startMongo done

    after (done) ->
        Help.stopMongo done

    afterEach (done) ->
        Observation.remove {}, (err) ->
            done err if err
            Interpretation.remove {}, done

    it 'should allow creation', (done) ->
        saveOneInterpretation (err, things) ->
            should.not.exist err
            things.interpretation.should.have.property 'observation'
            things.interpretation.should.have.property 'comment'
            done()

    it 'should allow finding by observation', (done) ->
        saveOneInterpretation (err, things) ->
            Interpretation.find
                observation: things.observation._id
                (err, interpretations) ->
                    should.not.exist err
                    interpretation = interpretations[0]
                    #interpretation.should.eql things.interpretation
                    interpretation._id.should.eql things.interpretation._id
                    interpretation.comment.should.eql things.interpretation.comment
                    done()

    xit 'should allow finding by patient'

# Helper Functions
saveOneInterpretation = (callback) ->
    patient =
        mrn: '1234'
        name: 'Test Patient'
    observation =
        patient: null # will be patient._id
        type: "Foundation Medicine Report"
        value: 1234
    interpretation =
        observation: null # will be observation._id
        comment: "Looks good"
    Patient.create patient, (err, patient) ->
            observation.patient = patient._id
            Observation.create observation, (err, observation) ->
                interpretation.observation = observation._id
                Interpretation.create interpretation, (err, interpretation) ->
                    callback err,
                        observation: observation
                        interpretation: interpretation
                        patient: patient
