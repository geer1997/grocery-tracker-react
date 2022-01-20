import {combineReducers} from "redux";
import {firebaseReducer} from "react-redux-firebase";
import {firestoreReducer} from "redux-firestore";
import currentUser from "./currentUser";

export const rootReducer = combineReducers({
    currentUser,
    firebase: firebaseReducer,
    firestore: firestoreReducer
});