import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const Account = new Schema({
  profile: {
    id: { type: Number }, // Discord User ID
    // Check always when they are chatting
    username: { type: String }, // getPlayer Username not ID
    thumbnail: { type: String }, // "PROFILE-URL"
  },
  Game: {
    isPlaying: { type: Boolean, default: false },
    roomNumber: { type: String, default: null },
    roomRank: { type: String, default: null }, // HeadQurter or Player
  },
  // UPDATE when they finish game or Admin used command
  score: { type: Number, default: 0 },
  balance: { type: Number, default: 0 },
  cash: { type: Number, default: 0 },
});

Account.statics.findByID = function (id) {
  return this.findOne({ 'profile.id': id }).exec();
};

Account.statics.localRegister = function ({ id, username, thumbnail }) {
  const account = new this({
    profile: {
      id,
      username,
      thumbnail,
    },
  });
  console.log(`[PASS] MongoDB created information of ${id}`);
  return account.save();
};

module.exports = mongoose.model('Account', Account);
