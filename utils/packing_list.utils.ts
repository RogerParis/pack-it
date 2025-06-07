export const isDuplicatePackingListName = (
  lists: { [key: string]: { name: string } },
  name: string,
) => {
  return Object.values(lists).some((list) => list.name.toLowerCase() === name.toLowerCase());
};
