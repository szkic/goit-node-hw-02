const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const User = require("../service/schemas/users");
require("dotenv").config();
const { DB_HOST } = process.env;

describe("test user registration & login", () => {
  let server;
  let response;

  beforeAll(() => {
    mongoose
      .connect(DB_HOST, { dbName: "db-contacts" })
      .then(() => (server = app.listen(3000)))
      .catch((err) => process.exit(1));
  });

  afterAll(() => {
    mongoose.disconnect(DB_HOST).then(() => {
      server.close();
    });
  });

  describe("register user", () => {
    beforeEach(async () => {
      response = await request(app).post("/api/users/signup").send({
        email: "bartek2@example.com",
        password: "examplepassword",
      });
    });

    afterEach(
      async () => await User.findOneAndRemove({ email: "bartek2@example.com" })
    );

    test("should respond with a 201 status code", async () =>
      expect(response.statusCode).toBe(201));

    test("should return user", async () => {
      const getUser = await User.findOne({ email: "bartek2@example.com" });
      const { email, subscription } = getUser;
      const user = {
        email,
        subscription,
      };

      expect(user).toMatchObject({
        email: "bartek2@example.com",
        subscription: "starter",
      });
    });
  });

  describe("login user", () => {
    beforeEach(async () => {
      response = await request(app).post("/api/users/login").send({
        email: "bartek@example.com",
        password: "examplepassword",
      });
    });

    test("should respond with a 200 status code", async () =>
      expect(response.statusCode).toBe(200));

    test("should return user", async () => {
      const getUser = await User.findOne({ email: "bartek@example.com" });
      const { email, subscription } = getUser;
      const user = {
        email,
        subscription,
      };

      expect(user).toMatchObject({
        email: "bartek@example.com",
        subscription: "starter",
      });
    });

    test("should return token token", async () => {
      const getUser = await User.findOne({ email: "bartek@example.com" });
      const { token } = getUser;
      expect(token).toBeTruthy();
    });
  });
});
