const userDB = {
  users: require("../model/users.json"),
  setUsers: function (Data) {
    this.users = Data;
  },
};

const jwt = require("jsonwebtoken");
const fspromises = require("fs").promises;
require("dotenv").config();
const path = require("path");

const bcrypt = require("bcrypt");

const handlelogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd) {
    return res.status(400).json({
      success: "false",
      message: "username and password are required",
    });
  }
  const foundUser = userDB.users.find((person) => person.username === user);
  if (!foundUser) {
    console.log("unauthorized ");
    return res.sendStatus(401);
  }
  const match = await bcrypt.compare(pwd, foundUser.pwd);
  if (match) {
    const accessToken = jwt.sign(
      { username: foundUser.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "120s" }
    );
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    const otherUsers = userDB.users.filter(
      (person) => person.username !== foundUser.username
    );

    const currentUser = { ...foundUser, refreshToken };

    userDB.setUsers([...otherUsers, currentUser]);

    await fspromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(userDB.users)
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, //as time is in ms 1day in ms
    });

    res.status(200).json({
      success: "true",
      message: `welcome ${user}`,
      accessToken,
    });
  } else {
    console.log("unauthorized ", res.status);
    res.sendStatus(401); //unauthorized
  }
};

module.exports = { handlelogin };
