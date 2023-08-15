const express = require("express");
const contacts = require("../../models/contacts");
const { validateAddContact, valodateEditContact } = require("../../validator");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const contactsList = await contacts.listContacts();
    res.json({
      message: "success",
      status: 200,
      data: { contactsList },
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await contacts.getContactById(contactId);

    if (contact) {
      res.json({
        message: "success",
        status: 200,
        data: { contact },
      });
    } else {
      res.json({
        message: "Not found",
        status: 200,
      });
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const body = req.body;
    const { error } = validateAddContact(body);

    if (error) {
      console.log(error.details);

      return res.send({
        message: error.details,
        status: 400,
      });
    }

    const newContactsList = await contacts.addContact(body);
    res.json({
      message: "contact added",
      status: 201,
      data: { newContactsList },
    });
  } catch (error) {
    console.log(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const deleteResult = await contacts.removeContact(contactId);

    if (deleteResult) {
      res.json({
        message: "contact deleted",
        status: 200,
      });
    } else {
      res.json({
        message: "not found",
        status: 404,
      });
    }
  } catch (error) {
    console.log(error);
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const body = req.body;
    const { contactId } = req.params;
    const { error } = valodateEditContact(body);

    if (error) {
      return res.send({
        message: error.details,
        status: 400,
      });
    }

    const editContact = await contacts.updateContact(contactId, body);

    if (editContact) {
      res.json({
        message: "contact edited",
        status: 200,
        data: { editContact },
      });
    } else {
      res.json({
        message: "Not found",
        status: 404,
      });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
