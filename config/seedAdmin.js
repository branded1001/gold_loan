const User = require("../models/User.js");
const bcrypt = require("bcryptjs");

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: "admin" });
     

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(process.env.DEFAULT_ADMIN_PASSWORD, 10);

      await User.create({
        name: "Super Admin",
        email: process.env.DEFAULT_ADMIN_EMAIL,
        password: hashedPassword,
        role: "admin"
      });

      console.log("Default admin created");
    } else {
      console.log(" Admin already exists");
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = seedAdmin;
