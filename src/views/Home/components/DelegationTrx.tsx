import React, {useEffect, useState} from 'react'
import {toast} from "react-toastify";
import axios from "axios";
import {TRON_API_URL, TRON_BASE_AMOUNT} from "../../../config/constants";
const DelegationTrx: React.FC = () => {
  const [addressToCheck, setAddressToCheck] = useState('')
  const [addressToDelegate, setAddressToDelegate] = useState('')
  const [amountToDelegate, setAmountToDelegate] = useState(0)
  const [loading, setLoading] = useState(false)
  const [delegatedEnergy, setDelegatedEnergy] = useState(0)
  
  const [addressToUnDelegate, setAddressToUnDelegate] = useState('')
    const [amountToUnDelegate, setAmountToUnDelegate] = useState(0)
  return (
    <>
      <h3>Delegation Section</h3>
      <br/>
      <div>
        <h4>Check Delegation.</h4>
        <label>Enter Address </label>
        <input type="text" name="Enter Address" value={addressToCheck} onChange={(e) =>{
          setAddressToCheck(e.target.value)
        }}/>
        <button type="submit" onClick={async () => {
            try {
              setLoading(true)
              if (addressToCheck === '') {
                throw new Error("Please Enter Address.")
              }
              
              const { data } = await axios.post(`${TRON_API_URL}/wallet/wallet/getdelegatedresourcev2`, {
                "fromAddress": window.tronWeb.defaultAddress.base58,
                "toAddress": addressToCheck,
                "visible": true
              })
              
              
            } catch (e) {
              toast.error(e['message'])
            } finally {
              setLoading(false)
              
            }
        } // end of onClick for check delegation button.
        }>
          {loading ? "Please Wait": "Check" }
        </button>
        
        <br/>
        <text>
            Delegated Energy : {delegatedEnergy}
        </text>
      </div>
   
      
      <br/>
      <br/>
      
      <div>
        <h4>Delegation Resource.</h4>
        <label>Enter Address </label>
        <input type="text" name="Enter Address" value={addressToDelegate} onChange={(e) =>{
          setAddressToDelegate(e.target.value)
        }}/>
        
        <input type="number" name="Enter Amount" value={amountToDelegate} onChange={(e) =>{
          setAmountToDelegate(parseInt(e.target.value))
        }}/>
        <button type="submit" onClick={async () => {
          try {
            setLoading(true)
            if (addressToDelegate === '') {
              throw new Error("Please Enter Address.")
            }
            else if (amountToDelegate <= 0) {
              throw new Error("Please Enter Amount.")
            }
            
            const { data } = await axios.post(`${TRON_API_URL}/wallet/delegateresource`, {
              "owner_address": window.tronWeb.defaultAddress.base58,
              "receiver_address": addressToDelegate,
              "balance": amountToDelegate * TRON_BASE_AMOUNT,
              "resource": "ENERGY",
              "lock": false,
              "visible": true
            })
            
            console.info("data", data)
            const result = await window.tronWeb.trx.sign(data)
            const result2 = await window.tronWeb.trx.sendRawTransaction(result)
            console.info("result for send raw transaction", result, result2)
            toast.success("Delegation Successful.")
            
          } catch (e) {
            toast.error(e['message'])
          } finally {
            setLoading(false)
            
          }
        } // end of onClick for check delegation button.
        }>
          {loading ? "Please Wait": "Delegate" }
        </button>

      </div>
      
      
      <div>
        <h4>Un Delegation Resource.</h4>
        <label>Enter Address </label>
        <input type="text" name="Enter Address" value={addressToUnDelegate} onChange={(e) =>{
          setAddressToUnDelegate(e.target.value)
        }}/>
        
        <input type="number" name="Enter Amount" value={amountToUnDelegate} onChange={(e) =>{
          setAmountToUnDelegate(parseInt(e.target.value))
        }}/>
        <button type="submit" onClick={async () => {
          try {
            setLoading(true)
            if (addressToUnDelegate === '') {
              throw new Error("Please Enter Address.")
            }
            else if (amountToUnDelegate <= 0) {
              throw new Error("Please Enter Amount.")
            }
            
            const { data } = await axios.post(`${TRON_API_URL}/wallet/undelegateresource`, {
              "owner_address": window.tronWeb.defaultAddress.base58,
              "receiver_address": addressToUnDelegate,
              "balance": amountToUnDelegate * TRON_BASE_AMOUNT,
              "resource": "ENERGY",
              "lock": false,
              "visible": true
            })
            console.info("data", data)
            const result = await window.tronWeb.trx.sign(data)
            const result2 = await window.tronWeb.trx.sendRawTransaction(result)
            console.info("result for send raw transaction", result, result2)
            toast.success("Un Delegation Successful.")
            
          } catch (e) {
            toast.error(e['message'])
          } finally {
            setLoading(false)
            
          }
        } // end of onClick for check delegation button.
        }>
          {loading ? "Please Wait": "Un Delegate" }
        </button>
      
      </div>
    
    </>
  )
}

export default DelegationTrx
