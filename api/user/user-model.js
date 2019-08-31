const db = require('../../data/data-config');

module.exports = {
  findUsers,
  findUserById,
  findUserByUsername,
  findUsersByDept,
  addUser,
  deleteUser,
  updateUser
}

function findUsers() {
  return db('users').select('username', 'department').select('id', 'username', 'department');
}

function findUserById(id) {
  return db('users').where({ id }).first();
}

function findUsersByDept(dept) {
  return db('users').where('department', dept).select('id', 'username', 'department');
}

function findUserByUsername(username) {
  return db('users').where({ username }).first();
}

function addUser(user) {
  return db('users').insert(user).then(id => findUserById(id[0]));
}

function deleteUser(id) {
  return db('users').where({ id }).del();
}

function updateUser(id, changes){
  return db('users').where({ id }).update(changes).then(() => findUserById(id));
}