const service = require("../service");
const { validateSignup } = require("../validator");
const User = require("../service/schemas/users");

const getUsers = async (req, res, nest) => {
  try {
    const users = await service.findUser();
    // res.status(200).json({
    //   message: "success",
    //   users,
    // });

    return users;
  } catch (error) {
    console.log(error);
  }
};

const signup = async (req, res, next) => {
  try {
    const { body } = req;
    const { email } = body;
    const { error } = validateSignup(body);

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

module.exports = {
  getUsers,
  signup,
};
