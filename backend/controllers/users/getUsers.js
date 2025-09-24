import { badRequest, successResponse } from "../../utils/response.js";
import { buildSearchConditions } from "./utils/buildSearchConditions.js";
import User from "../../model/formData.model.js";

const getUsers = async (req, res) => {
  try {
    const searchTerm = req?.query?.search || null;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let searchCondition = {};

    if (searchTerm) {
      const nameSearchConditions = buildSearchConditions(searchTerm);
      searchCondition.$or = nameSearchConditions;
    }

    let query = User.find(searchCondition)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const [totalRecords, allUsers] = await Promise.all([
      User.countDocuments(searchCondition),
      query,
    ]);

    const Response = {
      totalRecords,
      Users: allUsers,
    };

    return successResponse(res, 200, "Users", Response);
  } catch (error) {
    console.log("Error getting users:", error?.message);
    return badRequest(res, 400, error?.message || "Error getting users");
  }
};

export default getUsers;
