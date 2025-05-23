import { combineReducers } from "@reduxjs/toolkit";
import counterReducer from "./store/slices/counterSlice";
import authReducer from "./store/slices/loginSlice";
import permissionsReducer from "./store/slices/permissions";
import columnPreferencesReducer from "./store/slices/columnPreferencesSlice";
// import darkModeReducer from "./store/slices/darkModeSlice";

const rootReducer = combineReducers({
  counter: counterReducer,
  auth: authReducer,
  permissions: permissionsReducer,
  columnPreferences: columnPreferencesReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
