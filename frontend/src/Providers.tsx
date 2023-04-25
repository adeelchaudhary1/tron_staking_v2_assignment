import React from 'react'
import { Provider } from 'react-redux'

import { RefreshContextProvider } from 'contexts/RefreshContext'
import 'react-toastify/dist/ReactToastify.css';

import { Store } from '@reduxjs/toolkit'
import {ToastContainer} from "react-toastify";

const Providers: React.FC<{ store: Store }> = ({ children, store }) => {
  return (
      <Provider store={store}>
        <ToastContainer />
        <RefreshContextProvider>{children}</RefreshContextProvider>
      </Provider>
  )
}

export default Providers
