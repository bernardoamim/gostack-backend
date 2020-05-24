const express = require('express');

const server = express();
server.use(express.json());
//Query params = ?teste=1
//Route params = /users/1
//Route body = { "name": "bernardo", "email": "bernardoamim18@gmai..com" }

const users = ['Diego', 'Robson', 'Vitor'];

server.use((req, res, next) => {
  console.time('Request');
  console.log(`Method: ${req.method}; URL: ${req.url}`);

  next();

  console.timeEnd('Request');
});

function checkIfNameExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: 'User name is required' });
  }

  return next();
}

function checkUserInArray(req, res, next) {
  const user = users[req.params.index];

  if (!user) {
    return res.status(400).json({ error: 'User does not exist' });
  }

  req.user = user;

  return next();
}

server.get('/users', (req, res) => {
  return res.json(users); //listar todos os usuários R
});

server.get('/users/:index', checkUserInArray, (req, res) => {
  return res.json(req.user); //listar um usuário r
});

server.post('/users', checkIfNameExists, (req, res) => {
  const { name } = req.body; //Criar um novo usuário

  users.push(name);

  return res.json(users);
});

server.put('/users/:index', checkUserInArray, checkIfNameExists, (req, res) => {
  const { name } = req.body;
  const { index } = req.params;

  users[index] = name; //Editar um usuário

  return res.json(users);
});

server.delete('/users/:index', checkUserInArray, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1); //Deletar um usuário

  return res.send();
});

server.listen(3000);
