const User = require('../models/User');
const Task = require('../models/Task');
const ApiError = require('../utils/ApiError');


const getAllUsers = async (query = {}) => {
  const { page = 1, limit = 10, role, search } = query;


  const filter = {};

  if (role && ['user', 'admin'].includes(role)) {
    filter.role = role;
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await User.countDocuments(filter);

  const users = await User.find(filter)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  return {
    users,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit)),
    },
  };
};


const getUserById = async (userId) => {
  const user = await User.findById(userId).select('-password');

  if (!user) {
    throw new ApiError(404, 'User not found.');
  }


  const taskCount = await Task.countDocuments({ userId: user._id });

  return {
    ...user.toObject(),
    taskCount,
  };
};


const updateUserRole = async (userId, newRole, adminId) => {

  if (userId === adminId.toString()) {
    throw new ApiError(400, 'You cannot change your own role.');
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, 'User not found.');
  }

  if (user.role === newRole) {
    throw new ApiError(400, `User already has the '${newRole}' role.`);
  }

  user.role = newRole;
  await user.save();

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
};


const deleteUser = async (userId, adminId) => {

  if (userId === adminId.toString()) {
    throw new ApiError(400, 'You cannot delete your own account.');
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, 'User not found.');
  }


  await Task.deleteMany({ userId: user._id });


  await User.findByIdAndDelete(userId);
};


const getUserStats = async () => {
  const totalUsers = await User.countDocuments({ role: 'user' });
  const totalAdmins = await User.countDocuments({ role: 'admin' });
  const totalTasks = await Task.countDocuments();
  const tasksByStatus = await Task.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const statusMap = {};
  tasksByStatus.forEach((item) => {
    statusMap[item._id] = item.count;
  });

  return {
    totalUsers,
    totalAdmins,
    totalTasks,
    tasksByStatus: {
      pending: statusMap.pending || 0,
      'in-progress': statusMap['in-progress'] || 0,
      completed: statusMap.completed || 0,
    },
  };
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getUserStats,
};
