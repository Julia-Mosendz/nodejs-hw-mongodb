const parseSortOrder = (sortOrder) => {
  if (['asc', 'desc'].includes(sortOrder)) {
    return sortOrder;
  }
  return 'asc';
};

const parseSortBy = (sortBy) => {
  const validValues = [
    '_id',
    'name',
    'phoneNumber',
    'email',
    'isFavourite',
    'contactType',
    'createdAt',
    'updatedAt',
  ];
  if (validValues.includes(sortBy)) {
    return sortBy;
  }
  return '_id';
};

export const parseSortParams = ({ sortBy, sortOrder }) => {
  const parsedSortOrder = parseSortOrder(sortOrder);
  const parsedSortBy = parseSortBy(sortBy);
  return { sortBy: parsedSortBy, sortOrder: parsedSortOrder };
};
