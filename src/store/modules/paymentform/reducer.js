import produce from "immer";

const INICIAL_STATE = {
  paymentforms: []
};

export default function user(state = INICIAL_STATE, action) {
  return produce(state, draft => {
    switch (action.type) {
      case "@paymentform/LOAD_SUCESS": {
        draft.paymentforms = action.payload;
        break;
      }
      case "@auth/SIGN_OUT": {
        draft.paymentforms = [];
        break;
      }
      default:
    }
  });
}
