const express = require("express");
const router = express.Router();
const ctrlContact = require("../../controller/users");

router.get("/signup", ctrlContact.getUsers);

router.post("/signup", ctrlContact.signup);

module.exports = router;
