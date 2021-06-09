const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;
const path = require("path");

app.use(express.static("static"));
app.use(express.json());

// let messages = [];
var responses = [];

app.get("/", (req, res) => res.redirect("index.html"));

app.get("/getMessages", (req, res) => {
  responses.push(res);
});

app.post("/sendMessage", (req, res) => {
  let message = req.body;
  //   if (message.message !== "") messages.push(message);

  // console.log(message);
  // console.log(responses.length);
  responses.forEach((r) => {
    r.send([message]);
  });
  responses = [];
  res.end();
});

app.listen(PORT, () => console.log(`Serwer startuje na porcie ${PORT}`));
