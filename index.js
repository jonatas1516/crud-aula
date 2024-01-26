const express = require("express");
const { request } = require("http");

const uuid = require("uuid");

const app = express();

const port = 3001;
app.use(express.json());

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

const users = [];

const chackUserId = (request, response, next) => {
  const { id } = request.params;

  const index = users.findIndex((user) => user.id === id);

  if (index < 0) {
    return response.status(404).json({ message: "User not found" });
  }

  request.userIndex = index;
  request.userId = id;

  next();
};

app.get("/crud", (request, response) => {
  return response.json(users);
});

app.post("/crud", (request, response) => {
  const { name, age } = request.body;

  const user = { id: uuid.v4(), name, age };

  users.push(user);

  return response.status(201).json(user);
});

app.put("/crud/:id", chackUserId, (request, response) => {
  const { name, age } = request.body;

  const index = request.userIndex;
  const id = request.userId;

  const updatedUser = { id, name, age };

  users[index] = updatedUser;

  return response.json(updatedUser);
});

app.delete("/crud/:id", chackUserId, (request, response) => {
  const index = request.userIndex;

  users.splice(index, 1);

  return response.status(204).json();
});
