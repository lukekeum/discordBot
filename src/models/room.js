import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const Room = new Schema({
  number: { type: String },
  headPlayer: { type: Number },
  players: { type: Array }, // ["Player's ID"]
  setting: {
    round: { type: Number },
  },
  createdAt: { type: Date, default: Date.now },
  playing: {
    isPlaying: { type: Boolean, default: false },
    players: { type: Array }, // ["Player's ID - Score"]
    spectator: { type: Array },
  },
  lastMessage: { type: Date },
});

module.exports = mongoose.model('Room', Room);
