require("dotenv").config();
const express = require("express");
const path = require("path");
const { body, validationResult } = require("express-validator");
const db = require("./db/queries");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  const messages = await db.getAllMessages();
  res.render("index", { messages: messages });
});

app.get("/new", (req, res) => {
  res.render("form", { errors: [] });
});

app.post(
  "/new",
  [
    // Validation middleware
    body("messageUser")
      .trim()
      .notEmpty()
      .withMessage("Author name cannot be empty")
      .isLength({ max: 50 })
      .withMessage("Name is too long"),
    body("messageText")
      .trim()
      .notEmpty()
      .withMessage("Message text cannot be empty"),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    // If validation fails, re-render the form with error messages
    if (!errors.isEmpty()) {
      return res.status(400).render("form", { errors: errors.array() });
    }

    // If valid, insert into DB
    const { messageUser, messageText } = req.body;
    await db.insertMessage(messageUser, messageText);
    res.redirect("/");
  },
);

app.get("/message/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const message = await db.getMessageById(id);

  if (message) {
    res.render("details", { message: message });
  } else {
    res.status(404).send("Message not found");
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
