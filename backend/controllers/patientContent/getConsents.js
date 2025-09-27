import { badRequest, successResponse } from "../../utils/response.js";
import { buildSearchConditions } from "./utils/buildSearchConditions.js";
import patientConsentUser from "../../model/patientContent.model.js";

const getPatientConsents = async (req, res) => {
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

    let query = patientConsentUser
      .find(searchCondition)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1, _id: -1 });

    const [totalRecords, allUsers] = await Promise.all([
      patientConsentUser.countDocuments(searchCondition),
      query,
    ]);

    // Transform database format to frontend format
    const transformedUsers = allUsers.map(user => {
      const userObj = user.toObject();

      // Convert individual discipline/frequency fields to array format
      const disciplineFrequencies = [];
      for (let i = 1; i <= 6; i++) {
        disciplineFrequencies.push({
          discipline: userObj[`discipline${i}`] || '',
          newFrequency: userObj[`newFrequency${i}`] || ''
        });
      }

      // Add the array format to the object
      userObj.disciplineFrequencies = disciplineFrequencies;

      return userObj;
    });

    const Response = {
      totalRecords,
      patientConsents: transformedUsers,
    };

    return successResponse(res, 200, "Forms", Response);
  } catch (error) {
    console.log("Error getting users:", error?.message);
    return badRequest(res, 400, error?.message || "Error getting users");
  }
};

export default getPatientConsents;
