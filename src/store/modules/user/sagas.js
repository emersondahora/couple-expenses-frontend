import { all, takeLatest, call, put } from "redux-saga/effects";
import api from "~/service/api";

import { loadUserSuccess } from "./actions";

export function* loadUser() {
  const response = yield call(api.get, "users");
  yield put(loadUserSuccess(response.data));
}

export default all([takeLatest("@user/LOAD_REQUEST", loadUser)]);
