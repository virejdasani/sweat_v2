const mongoose = require('mongoose');

const programmeSchema = new mongoose.Schema({
  id: {
    type: String,
    enum: ['CSEE', 'AVS', 'MCR', 'EEE'],
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  moduleIds: {
    type: [String],
    default: [],
  },
});

const Programme = mongoose.model('Programme', programmeSchema);

module.exports = Programme;
