    
const express = require('express');
const authenticate = require('../auth/auth-middleware');
const userDB = require('./user-model');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const users = await userDB.findUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching users' })
  }
})

router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  
  try {
    const toDelete = await userDB.findUserById(id);
    const deleted = await userDB.deleteUser(id);

    if (deleted) {
      res.status(200).json({removed: toDelete});
    } else {
      res.status(400).json({ message: 'no user of such id exists'});
    }
  } catch (error) {
    res.status(500).json({ message: error.message || 'error deleting users' })
  }
})

module.exports = router;