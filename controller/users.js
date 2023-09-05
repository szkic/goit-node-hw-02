const { validateUser } = require("../validator");
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;
const User = require("../service/schemas/users");
const passport = require("passport");

const signup = async (req, res, next) => {
  try {
    const { body } = req;
    const { email, password } = body;

    const { error } = validateUser(body);
    if (error) return res.status(400).json({ message: error });

    const user = await User.findOne({ email });
    if (user) return res.status(409).json({ message: "Email in use" });

    const newUser = new User({ email, password });
    newUser.setPassword(password);
    await newUser.save();

    const { subscription } = newUser;

    return res.status(201).json({
      message: "user added",
      data: {
        user: {
          email,
          subscription,
        },
      },
    });
  } catch (error) {
    return res.status(500).json(`User create error - ${error}`);
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
      subscription,
    };

    const token = jwt.sign(payload, secret, { expiresIn: "1h" });
    user.token = token;
    await user.save();

    return res.status(200).json({
      data: {
        token,
        user: {
          email,
          subscription,
        },
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
};

const auth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (!user || err)
      return res.status(401).json({ message: "Not authorized" });

    req.user = user;
    next();
  })(req, res, next);
};

const logout = async (req, res, next) => {
  try {
    const { user } = req;
    const { token } = user;

    if (!token) return res.status(401).json({ message: "Not authorized" });

    user.token = null;
    await user.save();

    return res.status(204).send();
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
};

const current = (req, res, next) => {
  const { user } = req;
  const { token } = user;

  if (!token) return res.status(401).json({ message: "Not authorized" });

  const decode = jwt.decode(token);
  const { email, subscription } = decode;

  return res.status(200).json({
    email,
    subscription,
  });
};

module.exports = {
  signup,
  login,
  auth,
  logout,
  current,
};
