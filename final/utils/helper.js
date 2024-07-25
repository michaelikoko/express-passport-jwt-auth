const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("./config");
const { v4: uuidv4 } = require('uuid');
const RefreshToken = require("../models/RefreshToken");

const saltRounds = 10;

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(saltRounds);
  const passwordHash = await bcrypt.hash(password, salt);
  return passwordHash;
}

async function comparePassword(password, hashPassword) {
  return await bcrypt.compare(password, hashPassword);
}


function issueAccessToken(payload) {
  return jwt.sign(payload, config.SECRET, { expiresIn: 60 * 2}); //2 mins validity 
}

async function createRefreshToken(userId) {
  let expiryDate = new Date()
  expiryDate.setSeconds(60 * 60 *24) //24 hours validity 

  const token = uuidv4() 
  const refreshToken = await RefreshToken.create({
    token,
    user: userId,
    expiryDate: expiryDate.getTime()
  })
  return refreshToken.token
}

function verifyRefreshTokenExpiration (token) {
  return token.expiryDate.getTime() < new Date().getTime();
}

module.exports = {
  hashPassword,
  comparePassword,
  issueAccessToken,
  createRefreshToken,
  verifyRefreshTokenExpiration
};
