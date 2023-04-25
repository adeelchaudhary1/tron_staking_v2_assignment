import React, {useEffect, useState} from 'react'
import {toast} from "react-toastify";
import axios from "axios";
import {TRON_API_URL, TRON_BASE_AMOUNT} from "../../config/constants";
import StakingTrx from "./components/StakingTrx";
import DelegationTrx from "./components/DelegationTrx";
const Home: React.FC = () => {
  const [tronAddress, setTronAddress] = useState('')
  const [tronBalance, setTronBalance] = useState('...')
  return (
    <>
      {
        tronAddress === '' &&     <button onClick={async () => {
          if (window.tronWeb && !window.tronWeb.ready) {
            toast("Please Unlock Tron Web First");
          } else if (window.tronWeb && window.tronWeb.ready) {
            if (window.tronWeb.defaultAddress.base58) {
              setTronAddress(window.tronWeb.defaultAddress.base58)
              const balance = await window.tronWeb.trx.getBalance(window.tronWeb.defaultAddress.base58)
              setTronBalance((balance / 10**6).toString());
            }
          } else{
            toast("Please Install Tron Web Extension.");
            
          } // end of else
        }
        }>
          Connect TronWeb
          </button>
      }
  
      
      {
        tronAddress && <div>{tronAddress} - {tronBalance} TRX</div>
      }
      
      <br/>
      <br/>
      
      {
        tronAddress && <StakingTrx />
      }
      
      <br/>
        <br/>
      {
        tronAddress && <DelegationTrx/>
      }
    </>
  )
}

export default Home
