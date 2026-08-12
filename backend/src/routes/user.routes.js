const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

router.use(authMiddleware);

router.get('/', roleMiddleware(['admin']), userController.getUsers);
router.get('/:id', roleMiddleware(['admin']), userController.getUserById);
router.put('/:id', roleMiddleware(['admin']), userController.updateUser);
router.delete('/:id', roleMiddleware(['admin']), userController.deleteUser);

module.exports = router;