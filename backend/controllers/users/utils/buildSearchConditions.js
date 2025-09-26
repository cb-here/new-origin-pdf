export const buildSearchConditions = (searchTerm) => {
  const searchParts = searchTerm.trim().split(/\s+/); 
  let conditions = [];

  if (searchParts.length === 1) {
    conditions = [{ patientName: { $regex: searchParts[0], $options: "i" } }];
  } else if (searchParts.length === 2) {
    conditions = [
      {
        patientName: { $regex: searchParts[0], $options: "i" },
      },
      {
        patientName: { $regex: searchParts[1], $options: "i" },
      },
    ];
  } else {
    conditions = [{ patientName: { $regex: searchTerm, $options: "i" } }];
  }

  return conditions;
};
