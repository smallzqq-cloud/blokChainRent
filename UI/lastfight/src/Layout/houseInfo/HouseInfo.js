import React, { Component } from 'react'
import { Layout, Card } from 'antd';
import '../../css/houseInfo.css';
import HouseCard from './HouseCard';
import Address from '../../config/address.json'
import RentManager from '../../contracts/RentManagement.sol/RentManagement.json'
import Web3 from "web3";

const web3 = new Web3(window.ethereum);
const { Meta } = Card;
export default class HouseInfo extends Component {

  constructor() {
    super()
    this.state = {
      status: 3,
      contractData: [],
      clickedData: null,
      landlordData:[] // 保存所点击的数据
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
      this.props.onClick(this.state.clickedData, 7);
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
    const result = await contract.methods.getYourRent(window.ethereum.selectedAddress).call({ from: window.ethereum.selectedAddress })
    const landlordresult = await contract.methods.getLandlordRent(window.ethereum.selectedAddress).call({ from: window.ethereum.selectedAddress })
    let Rent = [];
    let Landlord = [];
    for (let index = 0; index < result.length; index++) {
      const res = result[index];
      const info = await contract.methods.getItemsContractInfoById(res).call({ from: window.ethereum.selectedAddress })
      Rent.push(info)
    }
    console.log("Rent", Rent);
    this.setState({ contractData: Rent });
    
    for (let index = 0; index < landlordresult.length; index++) {
      const res = landlordresult[index];
      const landinfo = await contract.methods.getItemsContractInfoById(res).call({ from: window.ethereum.selectedAddress })
      Landlord.push(landinfo)
    }
    console.log("Landlord", Landlord);
    this.setState({ landlordData: Landlord });
  }

  render() {

    const { Content } = Layout;
    const { contractData ,landlordData} = this.state;
    return (
      <Content
        style={{
          padding: '0 ',
        }}
      >
        <div className="site-item-content">
          <div className='house-item-box'>
            {contractData.map((data, index) => (
              <Card className="item-card" key={index} data={data} hoverable onClick={() => this.handleClick(data)} cover={<img className='item-img' style={{ height: 180, width: 250 }} alt="example" src={data.roomUrl} />}>
                 <Meta title={data.title} description={data.itemId} />
              </Card>
            ))}
          </div>

          <div className='house-item-box'>
          {landlordData.map((landlorddata, landlorddataindex) => (
              <Card className="item-card" key={landlorddataindex} data={landlorddata} hoverable onClick={() => this.handleClick(landlorddata)} cover={<img className='item-img' style={{ height: 180, width: 250 }} alt="example" src={landlorddata.roomUrl} />}>
                 <Meta title={landlorddata.title} description={landlorddata.itemId} />
              </Card>
            ))}
          </div>


        </div>


      </Content>
    )
  }
}
