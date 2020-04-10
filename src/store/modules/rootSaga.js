import { all } from "redux-saga/effects";

import auth from "./auth/sagas";
import category from "./category/sagas";
import paymentform from "./paymentform/sagas";

export default function* rootSaga() {
  return yield all([auth, category, paymentform]);
}
