const mongoose = require('mongoose')
const Schema = mongoose.Schema

const dataSchema = new Schema({
  temperature: {
    type: Number,
    required: [true, 'Temperature must have a value'],
    trim: true,
    unique: true,
  },
  SpO2: {
    type: Number,
    required: [true, 'SpO2 must have value'],
    trim: true,
  }
})

const data = mongoose.model('Data', dataSchema)

module.exports = data