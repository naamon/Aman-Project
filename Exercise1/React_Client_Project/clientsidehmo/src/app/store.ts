import { configureStore } from "@reduxjs/toolkit";
import memberSlices from "../slices/memberSlice";


export const store=configureStore({
    reducer:{memberSlices},
})

export type RootState=ReturnType<typeof store.getState>
export type AppDispatch=typeof store.dispatch
