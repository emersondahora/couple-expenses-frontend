export const ArrayMerge = (array, finder, insertItem, updaterCall) => {
  const itemFound = array.find(finder);
  if (itemFound) {
    if (updaterCall) updaterCall(itemFound);
  } else {
    array.push(insertItem);
  }
  return array;
};
