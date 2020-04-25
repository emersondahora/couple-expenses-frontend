import produce from "immer";

const INICIAL_STATE = {
  profile: null,
  users: []
};

export default function user(state = INICIAL_STATE, action) {
  return produce(state, draft => {
    switch (action.type) {
      case "@auth/SIGN_IN_SUCCESS": {
        draft.profile = action.payload.user;
        break;
      }
      case "@aut/SIGN_OUT": {
        draft.profile = null;
        break;
      }
      case "@user/LOAD_SUCESS": {
        draft.users = action.payload.map(item => ({
          ...item,
          short_name: item.name.split(" ").shift()
        }));
        break;
      }
      default:
    }
  });
}
