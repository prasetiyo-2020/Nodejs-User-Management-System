const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Router
router.get('/', userController.view);
router.post('/', userController.find);
router.get('/adduser', userController.form);
router.post('/adduser', userController.create);
router.get('/viewuser/:id', userController.viewall);
router.get('/edituser/:id', userController.edit);
router.post('/edituser/:id', userController.update);
router.get('/:id', userController.delete);

module.exports = router;