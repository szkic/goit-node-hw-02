const service = require("../service");
const {
  validateAddContact,
  validateEditContact,
  validateFavorite,
} = require("../validator");
const mongoose = require("mongoose");

const checkIfIdValid = (contactId, res) => {
  const isValidId = mongoose.isValidObjectId(contactId);
  if (!isValidId) return res.status(400).send({ message: "Invalid payload" });
};

const get = async (req, res, next) => {
  try {
    const contactsList = await service.getAllContacts();

    res.status(200).json({
      message: "success",
      data: { contactsList },
    });
  } catch (error) {
    console.log(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    checkIfIdValid(contactId, res);

    const contact = await service.getContactById(contactId);

    if (contact) {
      res.status(200).json({
        message: "success",
        data: { contact },
      });
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    console.log(error);
  }
};

const create = async (req, res, next) => {
  try {
    const body = req.body;
    const { error } = validateAddContact(body);

    if (error) return res.status(400).send({ message: error.details });

    const newContactsList = await service.createContact(body);
    res.status(201).json({
      message: "contact added",
      data: { newContactsList },
    });
  } catch (error) {
    console.log(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    checkIfIdValid(contactId, res);

    const deleteResult = await service.removeContact(contactId);

    deleteResult
      ? res.status(200).json({ message: "contact deleted" })
      : res.status(404).json({ message: "not found" });
  } catch (error) {
    console.log(error);
  }
};

const update = async (req, res, next) => {
  try {
    const body = req.body;
    const { contactId } = req.params;
    const { error } = validateEditContact(body);

    if (error) return res.status(400).send({ message: error.details });
    checkIfIdValid(contactId, res);

    const editContact = await service.updateContact(contactId, body);

    if (editContact) {
      res.status(200).json({
        message: "contact edited",
        data: { editContact },
      });
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    console.log(error);
  }
};

const favorite = async (req, res, next) => {
  try {
    const body = req.body;
    const { contactId } = req.params;
    const { error } = validateFavorite(body);

    if (error)
      return res
        .status(400)
        .send({ message: "Too much fields or missing field favorite" });

    checkIfIdValid(contactId, res);

    const editFavorite = await service.updateStatusContact(contactId, body);

    if (editFavorite) {
      res.status(200).json({
        message: "contact edited",
        data: editFavorite,
      });
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  get,
  getById,
  create,
  remove,
  update,
  favorite,
};
