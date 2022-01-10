import {createReducer} from "@reduxjs/toolkit";
import * as actions from "../actions";

const INITIAL_STATE = {
    address: "",
    email: "",
    name: "",
    profile_picture: "",
    userStatus: "",
    id: "",
    nfts: [],
};

export const userReducer = createReducer(INITIAL_STATE, (builder) => {
    builder
        .addCase(actions.onGetNfts, (state: typeof INITIAL_STATE, action) => {
            state.nfts = action.payload as NFT[];
        })
        .addCase(actions.onLoginUser.fulfilled, (state: typeof INITIAL_STATE, action) => {
            Object.entries(action.payload).forEach(section => {
                state[section[0]] = section[1]
            })
        })
        .addCase(actions.onUpdateUser, (state: typeof INITIAL_STATE, action) => {
            Object.entries(action.payload).forEach(section => {
                state[section[0]] = section[1]
            })
        })
        .addCase(actions.onUpdateUserCredentials.fulfilled, (state: typeof INITIAL_STATE, action) => {
            state.email = action.payload.email
        });
});