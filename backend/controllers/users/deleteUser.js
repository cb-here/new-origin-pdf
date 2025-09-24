const { roles } = require("../../config/user");
const { User } = require("../../models/user.model");
const { successResponse, badRequest } = require("../../utils/response");

require("dotenv").config();

const deleteUser = async (req, res) => {
  try {
    const userExists = req.user;
    const { userId } = req.params;

    if (!userId) {
      return badRequest(res, 400, "User ID is required");
    }

    const userToDelete = await User.findById(userId);
    if (!userToDelete) {
      return badRequest(res, 404, "User not found");
    }

    if (userToDelete.isDeleted) {
      return badRequest(res, 400, "User is already deleted");
    }

    if (userExists._id.toString() === userId) {
      return badRequest(res, 400, "You cannot delete yourself");
    }

    if (userExists.role === roles.admin) {
      if (userToDelete.role !== roles.user) {
        return badRequest(res, 403, "You can only delete users");
      }
    } else if (userExists.role === roles.super) {
      if (userToDelete.role === roles.super) {
        return badRequest(res, 403, "You cannot delete other super admins");
      }
    } else {
      return badRequest(res, 403, "You don't have permission to delete users");
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        isDeleted: true,
        deletedBy: userExists._id,
        deletedAt: new Date(),
      },
      { new: true }
    );

    return successResponse(res, 200, "User deleted successfully", {
      deletedUser: {
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        role: updatedUser.role,
        deletedAt: updatedUser.deletedAt,
      },
    });
  } catch (error) {
    console.log("Error deleting user:", error?.message);

    return badRequest(res, 400, error?.message || "Error deleting user");
  }
};

module.exports = { deleteUser };