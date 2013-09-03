Sample = require '../dist/sample'
Patient = require '../dist/patient'
Help = require './help'
should = require 'should'

describe 'Sample Model', () ->

    before (done) ->
        Help.startMongo done

    after (done) ->
        Help.stopMongo done

    afterEach (done) ->
        Sample.remove {}, (err) ->
            done err if err
            Patient.remove {}, done

    it 'should allow creation', (done) ->
        saveOneSample (err, sample) ->
            should.not.exist err
            sample.should.have.property 'patient'
            sample.should.have.property 'type'
            sample.should.have.property 'value'
            done()

    it 'should be findable by patient', (done) ->
        saveOneSample (err) ->
            Patient.findOne (err, patient) ->
                Sample.find
                    patient: patient._id
                    (err, sample) ->
                        should.not.exist err
                        done()


# Helper Functions
saveOneSample = (callback) ->
    patient =
        mrn: '1234'
        name: 'Test Patient'
    Patient.create patient,
        (err, patient) ->
            sample =
                patient: patient._id
                type: "Foundation Medicine Report"
                value: 1234
            Sample.create sample, callback
