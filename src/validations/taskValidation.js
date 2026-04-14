const Joi = require('joi');

const createTaskSchema = Joi.object({
  title: Joi.string().trim().min(1).max(100).required().messages({
    'string.empty': 'Task title is required',
    'string.max': 'Title cannot exceed 100 characters',
    'any.required': 'Task title is required',
  }),
  description: Joi.string().trim().max(500).allow('').optional().messages({
    'string.max': 'Description cannot exceed 500 characters',
  }),
  status: Joi.string()
    .valid('pending', 'in-progress', 'completed')
    .optional()
    .messages({
      'any.only': 'Status must be pending, in-progress, or completed',
    }),
});

const updateTaskSchema = Joi.object({
  title: Joi.string().trim().min(1).max(100).optional().messages({
    'string.empty': 'Title cannot be empty',
    'string.max': 'Title cannot exceed 100 characters',
  }),
  description: Joi.string().trim().max(500).allow('').optional().messages({
    'string.max': 'Description cannot exceed 500 characters',
  }),
  status: Joi.string()
    .valid('pending', 'in-progress', 'completed')
    .optional()
    .messages({
      'any.only': 'Status must be pending, in-progress, or completed',
    }),
})
  .min(1)
  .messages({
    'object.min': 'At least one field must be provided to update',
  });

module.exports = { createTaskSchema, updateTaskSchema };
