const express = require("express");
const cors = require("cors");
const { json } = require("express");

const { v4: uuidv4, validate: isUuid, validate } = require("uuid");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const uuid = uuidv4();
  const likes = 0;
  const newRepositories = { uuid, title, url, techs, likes };

  repositories.push(newRepositories);

  response.json(newRepositories);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  if (!validate(id))
    return response.status(400).json({ error: "User id invalid!" });

  const indexFound = repositories.findIndex(
    (repository) => repository.uuid === id
  );

  if (indexFound < 0)
    return response.status(400).json({ error: "User not found!" });

  if (title) repositories[indexFound].title = title;
  if (url) repositories[indexFound].url = url;
  if (techs) repositories[indexFound].techs = techs;

  response.json(repositories[indexFound]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  if (!validate(id))
    return response.status(404).json({ error: "User id invalid!" });

  const indexFound = repositories.findIndex(
    (repository) => repository.uuid === id
  );

  if (indexFound < 0)
    return response.status(400).json({ error: "User not found!" });

  repositories.pop(indexFound);

  response.status(204).send({});
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  if (!validate(id))
    return response.status(400).json({ error: "User id invalid!" });

  const indexFound = repositories.findIndex(
    (repository) => repository.uuid === id
  );

  if (indexFound < 0)
    return response.status(400).json({ error: "User not found!" });

  const likes = repositories[indexFound].likes + 1;
  console.log(likes);
  repositories[indexFound].likes = likes;

  response.send(repositories[indexFound]);
});

module.exports = app;
