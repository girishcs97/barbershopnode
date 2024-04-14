const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");

exports.signin = async (req, res, next) => {
    const { username, password } = req.body;
    const userNameExist = await Admin.findOne({ username });
    if (!userNameExist) {
      return res.status(400).json({
        success: false,
        message: "Username does not exist",
      });
    }
    try {
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: "Username and password cannot be empty",
        });
      }
      if (userNameExist && userNameExist.password === password) {
        const token = jwt.sign(
          {
            username: userNameExist.username,
          },
          "secret",
          {
            expiresIn: "24h",
          }
        );
        res.status(200).json({
          message: "Success",
          username: userNameExist.username,
          token: token,
          name: userNameExist.name,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid Password. Please try again",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };