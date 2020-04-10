export function loadPaymentFormRequest() {
  return {
    type: "@paymentform/LOAD_REQUEST",
    loading: false
  };
}
export function loadPaymentSuccess(paymentforms) {
  return {
    type: "@paymentform/LOAD_SUCESS",
    payload: paymentforms,
    loading: false
  };
}
