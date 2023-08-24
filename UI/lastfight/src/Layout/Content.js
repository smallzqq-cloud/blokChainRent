import React, { Component } from 'react'
import { Layout } from 'antd';
import '../css/layout.css';
import CardImage from '../Card';
import { Card } from 'antd';
import Web3 from "web3";
import { NODE_URL } from "../config/config";

const web3 = new Web3(NODE_URL);

web3.eth.getBlockNumber((error, result) => {
  if (!error) {
    console.log(result);
  } else {
    console.error(error);
  }
});

export default class LayContent extends Component {

  constructor() {
    super()
    this.state = {
      status: 1,
      status2:6
    }
  }


  //定义一个向 父组件 传值方法
  sendToValueParent = () => {
    this.props.callback({
      status: this.state.status,
    })
  }

   //定义一个向 父组件 传值方法
   sendToValueParent2 = () => {
    this.props.callback({
      status: this.state.status2,
    })
  }
  
  render() {
    const { Content } = Layout;

    return (
      <Content
        style={{
          padding: '0 ',
        }}
      >
        <p style={{ left: '35%', fontSize: '60px', color: '#ffffff', position: 'absolute', top: '15%', fontWeight: 800 }} >Rental housing system</p>
        <div
          className="site-layout-content"
          style={{
            backgroundImage: ' linear-gradient(to top,#000000,#696969,#D3D3D3,#DCDCDC)', width: "100%"
          }} x
        >
        </div>

        <div style={{
          backgroundColor: '#262629',
          margin: 'auto', width: "60%", height: "50%", left: 0, right: 0, top: 0, bottom: '0', gap: '90px', borderRadius: "30px",
          display: 'flex', flexDirection: 'row', alignItems: "center", justifyContent: "center", position: 'absolute', borderStyle: 'none'
        }}>

          <Card hoverable onClick={this.sendToValueParent} style={{ width: 240, height: 300, backgroundColor: 'black' }} bordered={false} cover={<img alt="example" style={{ width: 240, height: 250 }} src='https://bafkreif4twg7wqst3rjxydbrm64uva4p7ecndcgockajlksmpqa76q37vu.ipfs.nftstorage.link/' />}>
            <p style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 'larger', color: '#ffffff', fontWeight: 800 }}>我是房东</p>
          </Card>

          <Card hoverable onClick={this.sendToValueParent2}  style={{ width: 240, height: 300, backgroundColor: 'black' }} bordered={false} cover={<img alt="example" style={{ width: 240, height: 250 }} src="https://bafkreifqnkorvgd4qbe4hv6sxm4zufz2inr6wqbvf4boc2d5qawriwx7fa.ipfs.nftstorage.link/" />}>
            <p style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 'larger', color: '#ffffff', fontWeight: 900, fontSize: '15px' }}>我是租户</p>
          </Card>
          <p style={{ left: '40%', fontSize: '30px', color: '#ffffff', position: 'absolute', bottom: '10%', fontWeight: 800 }} >Choose your identity</p>
        </div>

      </Content>
    )
  }
}
