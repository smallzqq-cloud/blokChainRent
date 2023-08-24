import React, { Component } from 'react'
import { Layout, Input, Select, Button, Image ,message ,Alert } from 'antd';
import '../../css/Renthouse.css'
import { UserOutlined, PhoneOutlined, IdcardOutlined, AuditOutlined } from '@ant-design/icons';
import Web3 from "web3";
import Address from "../../config/address.json"
import RentManager from "../../contracts/RentManagement.sol/RentManagement.json"
const web3 = new Web3(window.ethereum);

export default class RentHouse extends Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        
        this.state = {
            contractData: null,
            island:null,
            status:2

        };
        this.messageApi = message;
    }

    App = () => <Alert message="Success" type="success" />;

    success = (data) => {
        this.messageApi.open({
          type: 'loading',
          content: data + ' in progress..',
          duration: 0,
        });
        // Dismiss manually and asynchronously
        setTimeout(this.messageApi.destroy, 2500);
      };

    handleClick() {
        const customVariable = 5;
        this.props.onCustomVariable(customVariable);
    }




    handleClick() {
        const customVariable = 5;
        this.props.onCustomVariable(customVariable);
    }



  //定义一个向 父组件 传值方法
  sendToValueParent = () => {
    this.props.callback({
      status: this.state.status,
    })
  }


    sendTx = async () => {

        if (window.ethereum.selectedAddress === null) {
            await window.ethereum.enable();
        }
        const networkId = await web3.eth.net.getId();
        // const contractNetworkId = 201;
        // if (networkId !== contractNetworkId) {
        //     throw new Error(`Please connect to network ${contractNetworkId}`);
        // }
        let contractAddress = Address.rentManager;
        const contract = new web3.eth.Contract(RentManager.abi, contractAddress);
        // 调用合约方法

        contract.methods.payRent(this.props.parentProp.itemId).send({ from: window.ethereum.selectedAddress })
            .on('transactionHash', (hash) => {
            // 显示正在交易的提示

                this.success(hash);
             })
            .on('receipt', (receipt) => {
                // 处理交易成功的回调
                this.App();
                console.log("receipt", receipt);
                //this.handleClick();
                setTimeout(this.messageApi.destroy, 500);
                //this.App();
            
            })
            .on('error', (error) => {
                // 处理交易失败的回调
                console.log("error", error);
            });
    }


    //removeHouse

    removeHouse = async () => {

        if (window.ethereum.selectedAddress === null) {
            await window.ethereum.enable();
        }
        const networkId = await web3.eth.net.getId();
        // const contractNetworkId = 201;
        // if (networkId !== contractNetworkId) {
        //     throw new Error(`Please connect to network ${contractNetworkId}`);
        // }
        let contractAddress = Address.rentManager;
        const contract = new web3.eth.Contract(RentManager.abi, contractAddress);
        // 调用合约方法

        contract.methods.removeHouse(this.props.parentProp.itemId).send({ from: window.ethereum.selectedAddress })
            .on('transactionHash', (hash) => {
            // 显示正在交易的提示

                this.success(hash);
             })
            .on('receipt', (receipt) => {
                // 处理交易成功的回调
                console.log("receipt", receipt);
                setTimeout(this.messageApi.destroy, 500);
                this.sendToValueParent();
            })
            .on('error', (error) => {
                // 处理交易失败的回调
                console.log("error", error);
            });
    }
    //get PayStatus

    async PayStatus() {
        let contractAddress = Address.rentManager;
        const contract = new web3.eth.Contract(RentManager.abi, contractAddress);
        // 调用合约方法
        const contractData = await contract.methods.getPayStatu(this.props.parentProp.itemId).call({ from: window.ethereum.selectedAddress });
        //console.log(contractData);

        // console.log("this.state.contractData",this.state.contractData);
        return contractData;
    }

    async IsRent(){
        let contractAddress = Address.rentManager;
        const contract = new web3.eth.Contract(RentManager.abi, contractAddress);
        // 调用合约方法
        let isRent = await contract.methods.isRent(this.props.parentProp.itemId).call({ from: window.ethereum.selectedAddress })
        //console.log("isRent",isRent);

        // console.log("this.state.contractData",this.state.contractData);
        return isRent;
    }

    ifLandor(){
        if (window.ethereum.selectedAddress.toUpperCase() == this.props.parentProp.landlord.toUpperCase()) {
            // console.log("window.ethereum.selectedAddress",window.ethereum.selectedAddress.toUpperCase());
            // console.log(" this.props.parentProp.landlord", this.props.parentProp.landlord.toUpperCase());
            return true
        }
        // console.log("window.ethereum.selectedAddress",window.ethereum.selectedAddress.toUpperCase());
        // console.log(" this.props.parentProp.landlord", this.props.parentProp.landlord.toUpperCase());
        return false;
    }

    async componentDidMount() {
        let island = this.ifLandor();
       // console.log("island",island);
        this.setState({ island: island});
        let isRent = this.IsRent();
        if (isRent) {
            let contractData = await this.PayStatus();
            this.setState({ contractData :contractData});
        }
        else{
            this.setState({ contractData :false});
        }


    }


    //getTime 

    formatTime(timestamp) {
        const date = new Date(timestamp * 1000);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hour = date.getHours().toString().padStart(2, '0');
        const minute = date.getMinutes().toString().padStart(2, '0');
        const second = date.getSeconds().toString().padStart(2, '0');
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }



    render() {
        const { Content } = Layout;
        const { contractData ,island} = this.state;
       
        //this.PayStatus();
        // console.log("contractData", contractData);
        // console.log("island",island);
        // const time = (data) => {
        //     if (data >= 3600 * 24 * 30 * 12) {
        //         return data / (3600 * 24 * 30 * 12) + " 年"
        //     } else {
        //         return data / (3600 * 24 * 30) + " 月"
        //     }
        // }

        return (


            <Content style={{ padding: '0 ' }}>
                <div className="site-layout-content">
                    <div className='House-Form'>
                        <div className='House-ImgContent'>
                            <span>房屋标题 : {this.props.parentProp.title}</span>
                            <div className='House-Img'>
                                {this.props.parentProp.roomUrl && <Image className='NFTImg' width={'640px'} height={'340px'} src={this.props.parentProp.roomUrl} alt="NFT preview" />}
                            </div>
                            <span style={{ whiteSpace: "nowrap" }}>合同有效期 : {this.formatTime(this.props.parentProp.endTime)}</span>
                            <span>支付状态 : {contractData ? "已支付" : "未支付"}</span>
                        </div>
                        <div className='House-Table'>
                            <div className='input-content'>
                                <div className="input-address-box">
                                    <span className='input-box-tag'>房东 :</span>
                                    <p>{this.props.parentProp.landlord}</p>
                                </div>
                            </div>

                            <div className="input-address-box">
                                <span className='input-box-tag'>租户 :</span>
                                <p>{this.props.parentProp.tenant}</p>
                            </div>


                            <div className='input-content'>
                                <div className="input-box">
                                    <span className='input-box-tag'>房屋租金 :</span>
                                    <p>{this.props.parentProp.rental}</p>
                                </div>
                                <div className="input-box">
                                    <span className='input-box-tag'>房屋押金 :</span>
                                    <p>{this.props.parentProp.deposit}</p>
                                </div>
                            </div>
                            <div className='input-content'>
                                <div className="input-box">
                                    <span className='input-box-tag'>房屋电费 :</span>
                                    <p>{this.props.parentProp.electricity}</p>
                                </div>
                                <div className="input-box">
                                    <span className='input-box-tag'>房屋热水费 :</span>
                                    <p>{this.props.parentProp.hotwater}</p>
                                </div>
                            </div>
                            <div className='input-content'>
                                <div className="input-box">
                                    <span className='input-box-tag'>房屋冷水费 :</span>
                                    <p>{this.props.parentProp.coldwater}</p>
                                </div>
                                <div>
                                    {island ? <Button onClick={this.removeHouse}>收回房产</Button> : <Button onClick={this.sendTx}>支付房租</Button>}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </Content>
        )
    }
}
