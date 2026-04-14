const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserStats,
  getUserById,
  updateUserRole,
  deleteUser,
} = require('../../controllers/userController');
const auth = require('../../middleware/auth');
const authorize = require('../../middleware/roleCheck');
const validate = require('../../middleware/validate');
const { updateRoleSchema } = require('../../validations/userValidation');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints (Admin only)
 */


router.use(auth);
router.use(authorize('admin'));


router.get('/stats', getUserStats);


router.get('/', getAllUsers);


router.get('/:id', getUserById);


router.put('/:id/role', validate(updateRoleSchema), updateUserRole);


router.delete('/:id', deleteUser);

module.exports = router;
