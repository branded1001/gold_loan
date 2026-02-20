const LocationTrack = require("../../models/LocationTracking");

exports.trackLocation = async (req, res) => {
  try {

    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        message: "Latitude and Longitude required"
      });
    }

    const locationData = await LocationTrack.findOneAndUpdate(
      { emp_id: req.user.id },
      {
        location: {
          type: "Point",
          coordinates: [longitude, latitude]
        },
        tracked_at: new Date()
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      success: true,
      message: "Location updated",
      location: locationData
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getAllValuerLocations = async (req, res) => {
  try {

    const locations = await LocationTrack.find()
      .populate("emp_id", "name email mobile");

    res.status(200).json({
      success: true,
      total: locations.length,
      locations
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};