import { ThunkAction } from 'redux-thunk'
import { AnyAction } from '@reduxjs/toolkit'

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, State, unknown, AnyAction>

export interface BigNumberToJson {
  type: 'BigNumber'
  hex: string
}

export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
}

// Global state

/* eslint-disable @typescript-eslint/no-empty-interface */
export interface State {}
