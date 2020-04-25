export const findOrCreateArray = (array, finder, defaultItem, updater) => {
  const itemFound = array.find(finder);
  if (itemFound) {
    updater(itemFound);
  } else {
    array.push(defaultItem);
  }
  return array;
};
