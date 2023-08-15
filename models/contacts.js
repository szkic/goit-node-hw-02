const fs = require("fs/promises");
const { nanoid } = require("nanoid");

const contacts = fs.readFile("models/contacts.json");

const listContacts = async () => {
  try {
    return JSON.parse(await contacts);
  } catch (error) {
    console.log(error);
  }
};

const getContactById = async (contactId) => {
  try {
    const parsedData = JSON.parse(await contacts);

    return parsedData.find((data) => data.id === contactId);
  } catch (error) {
    console.log(error);
  }
};

const removeContact = async (contactId) => {
  try {
    const parsedData = JSON.parse(await contacts);
    const checkIfExist = parsedData.find((data) => data.id === contactId);

    if (checkIfExist) {
      const contactsAfterRemove = parsedData.filter(
        (contact) => contact.id !== contactId
      );
      fs.writeFile("models/contacts.json", JSON.stringify(contactsAfterRemove));

      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};

const addContact = async (body) => {
  try {
    const { name, email, phone } = body;
    const newContact = {
      id: nanoid(),
      name,
      email,
      phone,
    };

    const parsedData = JSON.parse(await contacts);
    parsedData.push(newContact);
    fs.writeFile("models/contacts.json", JSON.stringify(parsedData));

    return newContact;
  } catch (error) {
    console.log(error);
  }
};

const updateContact = async (contactId, body) => {
  try {
    const { name, email, phone } = body;
    const editContact = {
      name,
      email,
      phone,
    };

    const parsedData = JSON.parse(await contacts);
    const checkIfExist = parsedData.find((data) => data.id === contactId);

    if (checkIfExist) {
      const searchContact = parsedData.find((data) => data.id === contactId);

      for (const key in searchContact) {
        editContact[key] === undefined
          ? (searchContact[key] = searchContact[key])
          : (searchContact[key] = editContact[key]);
      }

      fs.writeFile("models/contacts.json", JSON.stringify(parsedData));

      return parsedData;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
