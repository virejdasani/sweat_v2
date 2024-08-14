const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const settingsSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    value: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true },
);

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;
