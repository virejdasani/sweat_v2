const mongoose = require('mongoose');

const programmeSchema = new mongoose.Schema({
  id: {
    type: String,
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

const Programme = mongoose.model('programmes', programmeSchema);

module.exports = Programme;
