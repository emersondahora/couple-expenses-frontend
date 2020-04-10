import produce from "immer";

const INICIAL_STATE = {
  categories: []
};

export default function user(state = INICIAL_STATE, action) {
  return produce(state, draft => {
    switch (action.type) {
      case "@category/LOAD_SUCESS": {
        draft.categories = action.payload;
        break;
      }
      case "@auth/SIGN_OUT": {
        draft.categories = [];
        break;
      }
      default:
    }
  });
}
