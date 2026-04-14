const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
} = require('../../controllers/taskController');
const auth = require('../../middleware/auth');
const authorize = require('../../middleware/roleCheck');
const validate = require('../../middleware/validate');
const { createTaskSchema, updateTaskSchema } = require('../../validations/taskValidation');

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management endpoints (CRUD)
 */


router.use(auth);


router.post('/', validate(createTaskSchema), createTask);


router.get('/', getTasks);


router.get('/:id', getTask);


router.put('/:id', validate(updateTaskSchema), updateTask);


router.delete('/:id', deleteTask);

module.exports = router;
