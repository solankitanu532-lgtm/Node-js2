const mongoose = require('mongoose')
const Favourite = require('./favourite')

const homeSchema = new mongoose.Schema({
  houseName: { type: String, required: true},
  price: {type: Number, required: true},
  location: {type: String, required: true},
  rating: {type: Number, required: true},
  photoUrl: String ,
  description: String
});

homeSchema.pre("findOneAndDelete", async function() {
  console.log("Pre hook called for findOneAndDelete");
  const homeId = this.getQuery()._id;
  await Favourite.deleteMany({ homesId: homeId });
});

module.exports = mongoose.model('Home', homeSchema)