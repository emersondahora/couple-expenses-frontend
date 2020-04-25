import { all } from "redux-saga/effects";

import auth from "./auth/sagas";
import category from "./category/sagas";
import paymentform from "./paymentform/sagas";
import user from "./user/sagas";

export default function* rootSaga() {
  return yield all([auth, category, paymentform, user]);
}
