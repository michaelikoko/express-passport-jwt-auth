const passport = require("passport");
const PassportJWT = require("passport-jwt");
const PassportHttp = require("passport-http");
const config = require("../utils/config");
const User = require("../models/User");
const helper = require("../utils/helper");

const options = {
  jwtFromRequest: PassportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.SECRET,
};

passport.use(
  new PassportJWT.Strategy(options, async (payload, done) => {
    try {
      const user = await User.findOne({ _id: payload.id });
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error);
    }
  })
);

passport.use(
  new PassportHttp.BasicStrategy( async (userid, password, done) => {
    try {
      const user = await User.findOne({ email: userid });
      if (!user) {
        return done(null, false);
      }
      const isPasswordCorrect = await helper.comparePassword(password, user.password)
      if (!isPasswordCorrect) {
        return done(null, false);
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);



module.exports = passport;
