const { roles, allowedUserStatus } = require("../../config/user");
const { User } = require("../../models/user.model");
const { successResponse, badRequest } = require("../../utils/response");

require("dotenv").config();

const updateUser = async (req, res) => {
  try {
    const userExists = req.user;
    const { userId } = req.params;
    const { firstName, lastName, phoneNo, status, role } = req.body;

    if (!userId) {
      return badRequest(res, 400, "User ID is required");
    }

    const userToUpdate = await User.findById(userId);
    if (!userToUpdate) {
      return badRequest(res, 404, "User not found");
    }

    if (userToUpdate.isDeleted) {
      return badRequest(res, 400, "Cannot update deleted user");
    }

    const updateData = {
      updatedBy: userExists._id,
    };

    if (firstName !== undefined) {
      if (firstName.trim().length < 4) {
        return badRequest(res, 400, "First name must be at least 4 characters");
      }
      updateData.firstName = firstName.trim();
    }

    if (lastName !== undefined) {
      updateData.lastName = lastName.trim();
    }

    if (phoneNo !== undefined) {
      updateData.phoneNo = phoneNo ? phoneNo.trim() : null;
    }

    if (status !== undefined) {
      if (!Object.values(allowedUserStatus).includes(status)) {
        return badRequest(res, 400, "Invalid status");
      }

      if (userExists.role === roles.admin && userToUpdate.role !== roles.user) {
        return badRequest(res, 403, "You can only update user status");
      }

      updateData.status = status;
    }

    if (role !== undefined) {
      if (!Object.values(roles).includes(role)) {
        return badRequest(res, 400, "Invalid role");
      }

      if (userExists.role === roles.admin) {
        return badRequest(res, 403, "You cannot change user roles");
      }

      if (userExists.role === roles.super) {
        if (role === roles.super && userToUpdate.role !== roles.super) {
          return badRequest(res, 403, "You cannot promote users to Super Admin");
        }

        if (userToUpdate.role === roles.super && userExists._id.toString() !== userId) {
          return badRequest(res, 403, "You cannot change other Super Admin roles");
        }
      }

      updateData.role = role;
    }

    if (Object.keys(updateData).length === 1) {
      return badRequest(res, 400, "No valid fields to update");
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select("firstName lastName email phoneNo role status updatedAt")
     .populate({
       path: "updatedBy",
       select: "_id firstName lastName email username role",
     });

    return successResponse(res, 200, "User updated successfully", {
      user: updatedUser,
    });
  } catch (error) {
    console.log("Error updating user:", error?.message);

    if (error.name === "ValidationError") {
      return badRequest(res, 400, error.message);
    }

    return badRequest(res, 400, error?.message || "Error updating user");
  }
};

module.exports = { updateUser };