const passport = require("passport");
const service = require("../service");
const { validateUser } = require("../validator");
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;

require("../config/config-passport");

const getUsers = async (req, res, nest) => {
  try {
    return await service.findUser();
  } catch (error) {
    console.log(error);
  }
};

const signup = async (req, res, next) => {
  try {
    const { body } = req;
    const { email } = body;
    const { error } = validateUser(body);

    if (error) return res.status(400).json({ message: error });

    // check if email exists
    const users = await getUsers();
    const emailExists = users
      .map((user) => user.email)
      .find((userEmail) => userEmail === email);

    if (emailExists) return res.status(409).json({ message: "Email in use" });

    // add user
    const user = await service.createUser(body);
    const { subscription } = user;

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
    const { email, password } = req.body;

    const { error } = validateUser(body);
    if (error) return res.status(400).json({ message: error });

    const user = await service.findEmail(email);

    if (!user) return res.status(401).json({ message: "Email is wrong" });

    const isMatch = await user.isValidPassword(password);
    if (!isMatch) return res.status(401).json({ message: "Password is wrong" });

    const { subscription, id } = user;

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

module.exports = {
  getUsers,
  signup,
  login,
};
