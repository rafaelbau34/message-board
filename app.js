const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

const messages = [
  { text: "Hi there!", user: "Amando", added: new Date() },
  { text: "Hello World!", user: "Charles", added: new Date() },
];

app.get("/", (req, res) => {
  res.render("index", { messages: messages });
});

app.get("/new", (req, res) => {
  res.render("form");
});

app.post("/new", (req, res) => {
  const messageUser = req.body.messageUser;
  const messageText = req.body.messageText;
  messages.push({ text: messageText, user: messageUser, added: new Date() });
  res.redirect("/");
});

app.get("/message/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (id >= 0 && id < messages.length) {
    res.render("details", { message: messages[id] });
  } else {
    res.status(404).send("Message not found");
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
