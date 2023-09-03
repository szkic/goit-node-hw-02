const { validateUser } = require("../validator");
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;
const User = require("../service/schemas/users");
const passport = require("passport");

const signup = async (req, res, next) => {
  const { body } = req;
  const { email, password } = body;

  const { error } = validateUser(body);
  if (error) return res.status(400).json({ message: error });

  const user = await User.findOne({ email });
  if (user) {
    return res.status(409).json({ message: "Email in use" });
  }

  try {
    const newUser = new User({ email, password });
    newUser.setPassword(password);
    newUser.save();

    const { subscription } = newUser;

    res.status(201).json({
      message: "user added",
      data: {
        user: {
          email,
          subscription,
        },
      },
    });
  } catch (error) {
    res.status(500).json(`User create error - ${error}`);
  }
};

const login = async (req, res, next) => {
  try {
    const { body } = req;
    const { email, password } = body;

    const { error } = validateUser(body);
    if (error) return res.status(400).json({ message: error });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "There is no such user" });

    const isPasswordMatch = user.validPassword(password);
    if (!isPasswordMatch)
      return res.status(401).json({ message: "Password is wrong" });

    const { id, subscription } = user;

    const payload = {
      id,
      email,
    };

    const token = jwt.sign(payload, secret, { expiresIn: "1h" });
    user.token = token;
    await user.save();

    res.status(200).json({
      data: {
        token,
        user: {
          email,
          subscription,
        },
      },
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const auth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    console.log("user", user);

    if (!user || err) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }
    req.user = user;
    next();
  })(req, res, next);
};

const logout = (req, res, next) => {
  console.log("test logout");
};

module.exports = {
  signup,
  login,
  auth,
  logout,
};
