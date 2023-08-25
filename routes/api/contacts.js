const express = require("express");
// const contacts = require("../../models/contacts");
const router = express.Router();
const ctrlContact = require("../../controller");

router.get("/", ctrlContact.get);

router.get("/:contactId", ctrlContact.getById);

router.post("/", ctrlContact.create);

router.delete("/:contactId", ctrlContact.remove);

router.put("/:contactId", ctrlContact.update);

router.patch("/:contactId/favorite", ctrlContact.favorite);

module.exports = router;
