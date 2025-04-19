const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');

const app = express();
const port = 3000;

// Middleware
app.use(morgan('dev'));
app.use(bodyParser.json());

// In-memory user storage
let users = [];
let nextId = 1;

// Validation middleware for user data
const validateUser = [
  body('name').isString().withMessage('Name must be a string').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Email must be valid'),
  body('age').optional().isInt({ min: 0 }).withMessage('Age must be a positive integer'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// CRUD Endpoints

// GET /users - get all users
app.get('/users', (req, res) => {
  res.json(users);
});

// GET /users/:id - get user by id
app.get('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

// POST /users - create new user
app.post('/users', validateUser, (req, res) => {
  const user = {
    id: nextId++,
    name: req.body.name,
    email: req.body.email,
    age: req.body.age || null
  };
  users.push(user);
  res.status(201).json(user);
});

// PUT /users/:id - update user by id
app.put('/users/:id', validateUser, (req, res) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === id);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  const updatedUser = {
    id: id,
    name: req.body.name,
    email: req.body.email,
    age: req.body.age || null
  };
  users[userIndex] = updatedUser;
  res.json(updatedUser);
});

// DELETE /users/:id - delete user by id
app.delete('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === id);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  users.splice(userIndex, 1);
  res.status(204).send();
});

// Start server
app.listen(port, () => {
  console.log(`User management API listening at http://localhost:${port}`);
});
