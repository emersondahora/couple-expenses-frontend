import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";

export default reducers => {
  const persistedReducer = persistReducer(
    {
      key: "couples-expenses-control",
      storage,
      whitelist: ["user", "auth", "category", "paymentform"]
    },
    reducers
  );
  return persistedReducer;
};
