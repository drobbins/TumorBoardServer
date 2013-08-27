mongoose = require 'mongoose'

sampleSchema = new mongoose.Schema
    type:
        type: 'String'
        required: 'true'
    value:
        type: 'String'
    patient:
        type: 'ObjectId'
        ref: 'Patient'

sampleSchema.set 'strict', false

module.exports = mongoose.model 'Sample', sampleSchema

