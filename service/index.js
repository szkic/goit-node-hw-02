const Contact = require("./schemas/contact");
const User = require("./schemas/users");

// -------- CONTACTS --------
const getAllContacts = () => Contact.find();

const getContactById = (id) => Contact.findOne({ _id: id });

const createContact = ({ name, email, phone }) =>
  Contact.create({ name, email, phone });

const updateContact = (id, fields) =>
  Contact.findOneAndUpdate({ _id: id }, { $set: fields }, { new: true });

const removeContact = (id) => Contact.findByIdAndRemove(id);

const updateStatusContact = (id, fields) =>
  Contact.findOneAndUpdate({ _id: id }, { $set: fields }, { new: true });

// -------- USERS --------

const findUser = async (email) => await User.findOne({ email });

const createUser = async ({ email, password }) => {
  const newUser = new User({ email, password });
  newUser.setPassword(password);
  await newUser.save();
  return newUser;
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  removeContact,
  updateStatusContact,
  findUser,
  createUser,
};
