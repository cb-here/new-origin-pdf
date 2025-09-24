export const buildSearchConditions = (searchTerm) => {
  const searchParts = searchTerm.trim().split(/\s+/); // Split by spaces
  let conditions = [];

  if (searchParts.length === 1) {
    conditions = [
      { firstName: { $regex: searchParts[0], $options: "i" } },
      { lastName: { $regex: searchParts[0], $options: "i" } },
      { email: { $regex: searchParts[0], $options: "i" } },
    ];
  } else if (searchParts.length === 2) {
    conditions = [
      {
        firstName: { $regex: searchParts[0], $options: "i" },
        lastName: { $regex: searchParts[1], $options: "i" },
      },
      {
        firstName: { $regex: searchParts[1], $options: "i" },
        lastName: { $regex: searchParts[0], $options: "i" },
      },
      { email: { $regex: searchTerm, $options: "i" } },
    ];
  } else {
    conditions = [
      { firstName: { $regex: searchTerm, $options: "i" } },
      { lastName: { $regex: searchTerm, $options: "i" } },
      { email: { $regex: searchTerm, $options: "i" } },
    ];
  }

  return conditions;
};
