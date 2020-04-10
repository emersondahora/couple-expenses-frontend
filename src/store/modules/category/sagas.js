import { all, takeLatest, call, put } from "redux-saga/effects";
import api from "~/service/api";

import { loadCategorySuccess } from "./actions";

export function* loadCategory() {
  try {
    const response = yield call(api.get, "categories");

    yield put(loadCategorySuccess(response.data));
  } catch (error) {}
}

export default all([takeLatest("@category/LOAD_REQUEST", loadCategory)]);
