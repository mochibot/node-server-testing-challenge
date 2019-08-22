const bcrypt = require('bcryptjs')

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users')
    .truncate()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {username: 'user1', password: bcrypt.hashSync('password', 12), department: 'dept1'},
        {username: 'user2', password: bcrypt.hashSync('password', 12), department: 'dept2'},
        {username: 'user3', password: bcrypt.hashSync('password', 12), department: 'dept3'}
      ]);
    });
};
