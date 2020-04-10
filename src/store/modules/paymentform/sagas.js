import { all, takeLatest, call, put } from "redux-saga/effects";
import api from "~/service/api";

import { loadPaymentSuccess } from "./actions";

export function* loadPayment() {
  const response = yield call(api.get, "payment-forms");
  yield put(loadPaymentSuccess(response.data));
}

export default all([takeLatest("@paymentform/LOAD_REQUEST", loadPayment)]);
