const express = require("express");
const router = express.Router();
const ctrlContact = require("../../controller/users");

router.get("/signup", ctrlContact.getUsers);

router.post("/signup", ctrlContact.signup);

router.post("/login", ctrlContact.login);

module.exports = router;
