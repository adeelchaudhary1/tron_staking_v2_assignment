import React, {useEffect, useState} from 'react'
import {toast} from "react-toastify";
import axios from "axios";
import {TRON_API_URL, TRON_BASE_AMOUNT} from "../../../config/constants";
const StakingTrx: React.FC = () => {
  const [amountToUnFreeze, setAmountToUnFreeze] = useState(0)
  const [amountUnFreezeInProgress, setAmountUnFreezeInProgress] = useState(false)
  
  const [amountFreezeInProgress, setAmountFreezeInProgress] = useState(false)
  const [amountToFreeze, setAmountToFreeze] = useState(0)
  const [totalTRXStaked, setTotalTRXStaked] = useState(0)
  const [refetch, setRefetch] = useState(false)
  
  useEffect(() => {
    
    async function getTotalFreeze() {
      const { data } = await axios.post(`${TRON_API_URL}/wallet/getaccountresource`,{
        "address": window.tronWeb.defaultAddress.base58,
        visible: true
      })
      console.info("data for resources", data)
      setTotalTRXStaked(data.tronPowerLimit)
    }
    
    getTotalFreeze()
  }, [refetch])
  return (
    <>
      <h3>Staking TRX</h3>
      <br/>
       Your Total Freeze TRX : {totalTRXStaked} TRX
      
      <div>
      
        <label>
          Amount to Freeze:
        </label>
        <input type="number" name="Amount To Freeze" value={amountToFreeze} onChange={
          (e) => {
            setAmountToFreeze(parseInt(e.target.value))
          }
        }/>
      
       <button type="submit" onClick={async () => {
         
         setAmountFreezeInProgress(true)
          try {
            if (amountToFreeze <= 0) {
              throw new Error("Please Enter Valid Amount.")
            }
            else if (amountFreezeInProgress) {
              throw new Error("Please Wait For Freeze To Complete.")
            }
            const userBalance = await window.tronWeb.trx.getBalance(window.tronWeb.defaultAddress.base58);
            if (userBalance < amountToFreeze * TRON_BASE_AMOUNT) {
              throw new Error("Insufficient Balance For Freeze.")
            }
            const { data} = await axios.post(`${TRON_API_URL}/wallet/freezebalancev2`,
              {
                "owner_address": window.tronWeb.defaultAddress.base58,
                "frozen_balance": amountToFreeze * TRON_BASE_AMOUNT, //
                "resource": "ENERGY",
                "visible": true
              })
            
            console.info("data", data)
            const result = await window.tronWeb.trx.sign(data)
            const result2 = await window.tronWeb.trx.sendRawTransaction(result)
            console.info("result for send raw transaction", result, result2)
            toast("Freeze Successfull")
          } catch(error) {
            console.error("error in freeze", error)
            toast(error['message'], {type: "error"})
          }
         setAmountFreezeInProgress(false)
         
         setRefetch(!refetch)
          
        } // end of function
        }>
         {amountFreezeInProgress ? "Please Wait" : "Freeze More Energy"}
          </button>
      
      </div>
      
      <div>
        
          <label>
            Amount to Un Freeze:
          </label>
          <input type="number" name="Amount To UnFreeze" value={amountToUnFreeze} onChange={
            (e) => {
              setAmountToUnFreeze(parseInt(e.target.value))
            }
          }/>
          
          <button onClick={async () => {
            
            try {
              setAmountUnFreezeInProgress(true)
              
              if (amountToUnFreeze <= 0) {
                throw new Error("Please Enter Valid Amount.")
              }
              else if (amountUnFreezeInProgress) {
                throw new Error("Please Wait For Un Freeze To Complete.")
              }
              if (totalTRXStaked < amountToUnFreeze) {
                throw new Error("Insufficient Amount For Un Freeze.")
              }
              const { data} = await axios.post(`${TRON_API_URL}/wallet/unfreezebalancev2`,
                {
                  "owner_address": window.tronWeb.defaultAddress.base58,
                  "unfreeze_balance": amountToUnFreeze * TRON_BASE_AMOUNT, //
                  "resource": "ENERGY",
                  "visible": true
                })
              
              console.info("data", data)
              const result = await window.tronWeb.trx.sign(data)
              const result2 = await window.tronWeb.trx.sendRawTransaction(result)
              console.info("result for send raw transaction", result, result2)
              toast("Un Freeze Successfull")
            } catch(error) {
              console.error("error in freeze", error)
              toast(error['message'], {type: "error"})
            }
            
            setRefetch(!refetch)
            setAmountUnFreezeInProgress(false)
            
            
          } // end of function
          }>
            {amountUnFreezeInProgress ? "Please Wait" : "Un Freeze Energy" }
          </button>
        
      </div>
    </>
  )
}

export default StakingTrx
