import { createReducer } from '@reduxjs/toolkit'
import {  hidePhishingWarningBanner } from './actions'
const currentTimestamp = () => new Date().getTime()

export interface UserState {

  hideTimestampPhishingWarningBanner: number
}

export const initialState: UserState = {
  hideTimestampPhishingWarningBanner: null,
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(hidePhishingWarningBanner, (state) => {
      state.hideTimestampPhishingWarningBanner = currentTimestamp()
    }),
)
