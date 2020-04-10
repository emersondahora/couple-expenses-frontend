export function loadCategoryRequest() {
  return {
    type: "@category/LOAD_REQUEST",
    loading: false
  };
}
export function loadCategorySuccess(categories) {
  return {
    type: "@category/LOAD_SUCESS",
    payload: categories,
    loading: false
  };
}
