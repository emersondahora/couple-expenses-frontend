import { combineReducers } from "redux";

import auth from "./auth/reducer";
import user from "./user/reducer";
import category from "./category/reducer";
import paymentform from "./paymentform/reducer";

export default combineReducers({ auth, user, category, paymentform });
