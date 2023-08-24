import React, { Component } from 'react'
import { Layout } from 'antd';
import '../../css/item.css';
import { Select } from 'antd';
import { Button } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import ItemCard from './ItemCard';
import { Card } from 'antd';
import Web3 from "web3";
import Address from "../../config/address.json"
import RentManager from '../../contracts/RentManagement.sol/RentManagement.json'

const { Meta } = Card;
const web3 = new Web3(window.ethereum);
export default class Item extends Component {

  constructor() {
    super()
    this.state = {
      status: 3,
      contractData: [],
      clickedData: null // 保存所点击的数据
    }
  }

  //定义一个向 父组件 传值方法
  sendToValueParent = () => {
    this.props.callback({
      status: this.state.status,
    })
  }

  handleClick = (data) => {
    this.setState({ clickedData: data }, () => {
      // 2. 点击时调用父组件传入的回调函数，并传入所点击的数据以及自定义数据
      this.props.onClick(this.state.clickedData, 3);
    });
  };

  
  async componentDidMount() {
    if (window.ethereum.selectedAddress === null) {
      await window.ethereum.enable();
    }
    const networkId = await web3.eth.net.getId();
    // const contractNetworkId = 201;
    // if (networkId !== contractNetworkId) {
    //   throw new Error(`Please connect to network ${contractNetworkId}`);
    // }

    let contractAddress = Address.rentManager;
    const contract = new web3.eth.Contract(RentManager.abi, contractAddress);
    // 调用合约方法

    const result = await contract.methods.getItemsContractInfo().call({ from: window.ethereum.selectedAddress })
    let noRent = [];
    for (let index = 0; index < result.length; index++) {
      const res = result[index];
      let isRent = await contract.methods.isRent(res.itemId).call({ from: window.ethereum.selectedAddress })
      if (!isRent) {
        noRent.push(res)
      }
      
    }
    console.log("noRent",noRent);
    this.setState({ contractData:noRent });
  }


  render() {

    const { Content } = Layout;
    const { contractData } = this.state;

    return (
      <Content
        style={{
          padding: '0 ',
        }}
      >
        <div className="site-item-content">



          <div className='item-box'>
            {/* <Scroll></Scroll> */}
            {contractData.map((data, index) => (
            <Card className="item-card"  key={index} data={data} hoverable onClick={() => this.handleClick(data)} cover={<img className='item-img' style={{ height: 180, width: 250 }} alt="example" src={data.roomUrl} />}>
              <Meta title={data.title} description={data.itemId} />
            </Card>
        ))}
          
            <div>

            </div>
          </div>



        </div>


      </Content>
    )
  }
}
