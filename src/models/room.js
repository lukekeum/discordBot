import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const Room = new Schema({
  number: { type: String },
  headPlayer: { type: Number },
  players: { type: Array }, // ["Player's ID-score"]
  setting: {
    round: { type: Number },
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Room', Room);
