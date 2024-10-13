import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import utilisateurSlice from "./slices/utilisateurSlice";
import utilisateurTransform from "./transforms/utilisateurTransform";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["utilisateur"],
  transforms: [utilisateurTransform],
};

const persistedReducer = persistReducer(persistConfig, utilisateurSlice);

const myStore = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

const persistor = persistStore(myStore);

export { myStore, persistor };
export default myStore;
