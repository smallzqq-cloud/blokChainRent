import React, { useState  } from 'react'
import { Layout, Button } from 'antd';
import '../css/header.css'
import { injected } from "../Connector/Connectors";
import { useWeb3React } from "@web3-react/core";
import { useEffect } from "react"
import Web3 from "web3";
import Address from "../config/address.json";
import HouseToken from "../contracts/HouseToken.sol/HouseToken.json";

import {
  WalletFilled,
  HomeFilled
} from '@ant-design/icons';

const web3 = new Web3(window.ethereum);
const { Header } = Layout;
const LayoutHeader = (props) => {



  function handleClick() {

    props.onData(2);
  }

  function handleClick2() {

    props.onData(4);
  }

  function handleClick3() {

    props.onData(0);
  }

  function handleClick5() {

    props.onData(5);
  }
  const { active, account, library, connector, activate, deactivate } = useWeb3React()

  const [balance, setBalance] = useState(0);


 

 const getBalance = async function componentDidMount() {
    if (window.ethereum.selectedAddress === null) {
      await window.ethereum.enable();
    }
    const networkId = await web3.eth.net.getId();
    // const contractNetworkId = 201;
    // if (networkId !== contractNetworkId) {
    //   throw new Error(`Please connect to network ${contractNetworkId}`);
    // }

    let contractAddress = Address.rentManager;
    const contract = new web3.eth.Contract(HouseToken.abi, contractAddress);
    // 调用合约方法

    const result = await contract.methods.balanceOf(window.ethereum.selectedAddress).call({ from: window.ethereum.selectedAddress })
    
    setBalance(result);
  }
  getBalance();

  async function connect() {
    try {
      await activate(injected)
      localStorage.setItem('isWalletConnected', true)
    } catch (ex) {
      console.log(ex)
    }
  }

  async function disconnect() {
    try {
      deactivate()
      localStorage.setItem('isWalletConnected', false)
    } catch (ex) {
      console.log(ex)
    }
  }

  useEffect(() => {
    const connectWalletOnPageLoad = async () => {
      if (localStorage?.getItem('isWalletConnected') === 'true') {
        try {
          await activate(injected)
          localStorage.setItem('isWalletConnected', true)
        } catch (ex) {
          console.log(ex)
        }
      }
    }
    connectWalletOnPageLoad()
  }, [])





  return (

    <Header style={{ backgroundColor: '#262629', height: "100px", display: 'flex', alignItems: "center", gap: "150px", justifyContent: "space-between" }}>
      <div style={{ display: 'flex', flexWrap: "nowrap" }}>
        <HomeFilled onClick={handleClick} style={{ fontSize: '50px', color: '#ffffff' }} />
        <p style={{ fontWeight: 'bold', fontSize: 'larger', color: "#ffffff" }}>Rental housing system</p>
      </div>
      <button className='header-button' onClick={handleClick3} style={{ fontWeight: 'bold', fontSize: 'larger', color: "#ffffff" }}>创建身份</button>
      <button className='header-button' onClick={handleClick2} style={{ fontWeight: 'bold', fontSize: 'larger', color: "#ffffff" }}>出租房屋</button>
      <button className='header-button' onClick={handleClick5} style={{ fontWeight: 'bold', fontSize: 'larger', color: "#ffffff" }}>个人信息</button>
      <span style={{ color: "#ffffff", gap: '20px',fontSize: '15px' }}>账户余额 : {balance}</span>
      {active ? <span style={{ color: "#ffffff", gap: '20px' }}>  <b >{account}</b>  <Button onClick={disconnect}>disconnect</Button></span> : <WalletFilled onClick={connect} style={{ fontSize: '50px', color: '#ffffff', position: 'absolute', right: '10%' }} />}

    </Header>
  )

}
export default LayoutHeader