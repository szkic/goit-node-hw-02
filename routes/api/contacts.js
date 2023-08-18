const express = require("express");
const contacts = require("../../models/contacts");
const { validateAddContact, valodateEditContact } = require("../../validator");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const contactsList = await contacts.listContacts();
    res.status(200).json({
      message: "success",
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
});

router.post("/", async (req, res, next) => {
  try {
    const body = req.body;
    const { error } = validateAddContact(body);

    if (error) return res.status(400).send({ message: error.details });

    const newContactsList = await contacts.addContact(body);
    res.status(201).json({
      message: "contact added",
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

    deleteResult
      ? res.status(200).json({ message: "contact deleted" })
      : res.status(404).json({ message: "not found" });
  } catch (error) {
    console.log(error);
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const body = req.body;
    const { contactId } = req.params;
    const { error } = valodateEditContact(body);

    if (error) return res.status(400).send({ message: error.details });

    const editContact = await contacts.updateContact(contactId, body);

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
});

module.exports = router;
