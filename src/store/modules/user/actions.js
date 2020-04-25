export function loadUserRequest() {
  return {
    type: "@user/LOAD_REQUEST"
  };
}
export function loadUserSuccess(users) {
  return {
    type: "@user/LOAD_SUCESS",
    payload: users
  };
}
