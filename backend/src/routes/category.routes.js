const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

router.get('/', categoryController.getCategories);
router.post('/', authMiddleware, roleMiddleware(['admin']), categoryController.createCategory);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), categoryController.updateCategory);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), categoryController.deleteCategory);

module.exports = router;