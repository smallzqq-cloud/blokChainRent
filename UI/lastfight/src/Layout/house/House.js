import React, { Component } from 'react'
import { Layout, Button ,Image, message} from 'antd';
import '../../css/house.css'
import { UserOutlined, PhoneOutlined, IdcardOutlined, AuditOutlined } from '@ant-design/icons';
import Web3 from "web3";
import Address from "../../config/address.json"
import RentManager from "../../contracts/RentManagement.sol/RentManagement.json"
const web3 = new Web3(window.ethereum);

export default class House extends Component {
    
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.messageApi = null;
      }


      
      componentDidMount() {
        this.messageApi = message;
      }
    
      success = (data) => {
        this.messageApi.open({
          type: 'loading',
          content: data+' in progress..',
          duration: 0,
        });
        //setTimeout(this.messageApi.destroy, 2500);
      };


      handleClick() {
        const customVariable = 5;
        this.props.onCustomVariable(customVariable);
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
        let contractAddress =Address.rentManager;
        const contract = new web3.eth.Contract(RentManager.abi, contractAddress);
        // 调用合约方法

        contract.methods.rentHouse(this.props.parentProp.itemId).send({ from: window.ethereum.selectedAddress })
            .on('transactionHash', (hash) => {
            // 显示正在交易的提示
            this.success(hash);
             })
            .on('receipt', (receipt) => {
                // 处理交易成功的回调
                console.log("receipt",receipt);
                this.handleClick();
                setTimeout(this.messageApi.destroy, 500);
            })
            .on('error', (error) => {
                // 处理交易失败的回调
                console.log("error",error);
            });
    }

    render() {
        const { Content } = Layout;

        console.log("this.state.receivedData",this.props.parentProp);

        
    // message

      


        const time = (data)=>{
            if (data >= 3600*24*30*12) {
                return data/(3600*24*30*12)+" 年"
            }else{
                return data/(3600*24*30)+" 月"
            }
        }
     
        return (
           

            <Content style={{ padding: '0 ' }}>
                <div className="site-layout-content">
                    <div className='House-Form'>
          
                        <div className='House-ImgContent'>
                            <span>房屋标题 : {this.props.parentProp.title}</span>
                            <div className='House-Img'>
                            {this.props.parentProp.roomUrl &&<Image className='NFTImg' width={'640px'}  height={'340px'} src={this.props.parentProp.roomUrl} alt="NFT preview"/>}
                            </div>
                            <span style={{whiteSpace: "nowrap"}}>合同有效期 : {time(this.props.parentProp.validTime)}</span>
                            <span>支付时间 : {time(this.props.parentProp.paymentTime)}</span>
                        </div>
                        <div className='House-Table'>
                        <div className='input-content'>
                            <div className="input-box">
                            <span className='input-box-tag'>房屋编号 :</span>
                                <p>{this.props.parentProp.itemId}</p>
                            </div>
                            <div className="input-box">
                            <span className='input-box-tag'>房屋面积 :</span>
                                <p>{this.props.parentProp.area}</p>
                            </div>
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
                            <Button onClick={ this.sendTx}>租房</Button>
                            </div>
                            </div>   
                        </div>
                        
                    </div>
                </div>
            </Content>
        )
    }
}
