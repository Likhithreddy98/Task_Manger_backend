const Task = require('../models/Task');
const ApiError = require('../utils/ApiError');


const createTask = async (taskData, userId) => {
  const task = await Task.create({
    ...taskData,
    userId,
  });

  return task;
};


const getTasks = async (user, query = {}) => {
  const { status, page = 1, limit = 10 } = query;


  const filter = {};


  if (user.role !== 'admin') {
    filter.userId = user._id;
  }


  if (status && ['pending', 'in-progress', 'completed'].includes(status)) {
    filter.status = status;
  }


  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Task.countDocuments(filter);

  const tasks = await Task.find(filter)
    .populate('userId', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  return {
    tasks,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit)),
    },
  };
};


const getTaskById = async (taskId, user) => {
  const task = await Task.findById(taskId).populate('userId', 'name email');

  if (!task) {
    throw new ApiError(404, 'Task not found.');
  }


  if (user.role !== 'admin' && task.userId._id.toString() !== user._id.toString()) {
    throw new ApiError(403, 'You are not authorized to view this task.');
  }

  return task;
};


const updateTask = async (taskId, updateData, user) => {
  let task = await Task.findById(taskId);

  if (!task) {
    throw new ApiError(404, 'Task not found.');
  }


  if (user.role !== 'admin' && task.userId.toString() !== user._id.toString()) {
    throw new ApiError(403, 'You are not authorized to update this task.');
  }

  task = await Task.findByIdAndUpdate(taskId, updateData, {
    new: true,
    runValidators: true,
  }).populate('userId', 'name email');

  return task;
};


const deleteTask = async (taskId, user) => {
  const task = await Task.findById(taskId);

  if (!task) {
    throw new ApiError(404, 'Task not found.');
  }


  if (user.role !== 'admin' && task.userId.toString() !== user._id.toString()) {
    throw new ApiError(403, 'You are not authorized to delete this task.');
  }

  await Task.findByIdAndDelete(taskId);
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
