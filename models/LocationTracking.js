const mongoose = require("mongoose");

const LocationTrackSchema = new mongoose.Schema({

  emp_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true //  one valuer = one location record
  },

  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },

  tracked_at: {
    type: Date,
    default: Date.now
  }

});

//  Required for geospatial queries
LocationTrackSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("LocationTrack", LocationTrackSchema);
