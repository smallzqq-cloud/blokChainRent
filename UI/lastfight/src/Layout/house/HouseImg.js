import React, {useState} from 'react';
import { NFTStorage } from "nft.storage";
import {Button,Input,Image, message  } from 'antd';
import '../../css/form.css'
import { ethers } from 'ethers';
import '../../config/address.json'
import RentManager from '../../contracts/RentManagement.sol/RentManagement.json'
import Web3 from "web3";
import Address from '../../config/address.json'
import { create } from 'ipfs-http-client';


const ipfs = create({ host: 'localhost', port: '5001', protocol: 'http' });
const web3 = new Web3(window.ethereum);
const APIKEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDZjNjNkOUUxMkJiODBDODE1M2YyRjZhMDgyNzgxOWMxNTMwRjA4ODAiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3NjYxMjYyOTg0MCwibmFtZSI6InpzYzIwMSJ9.YEtGSLbLrDcE8Ax5Lwqybkxog_P3_YxInkd8wXS5anQ';
// const nftContractAddress = '<YOUR-NFT-SMART-CONTRACT-ADDRESS>';

const HouseImg =(props) => {

    const [imageHash, setImageHash] = useState('');
    const [imageBuffer, setImageBuffer] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const { title, id, area, rent,pledge, electric, hot, cold,contractTime, contractState, payTime, payStatus } = props.inputValues;
    const reader = new FileReader();
    let status = 0



        // message

        const [messageApi, contextHolder] = message.useMessage();
        const success = (data) => {
            messageApi.open({
                type: 'loading',
                content: data +' 交易正在执行',
                duration: 0,
            });
            // Dismiss manually and asynchronously
            // setTimeout(messageApi.destroy, 2500);
        };

    //uploadimg

    //upload img 

    const handleChange = (event) => {
        const file = event.target.files[0];
    
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend = () => {
          setSelectedImage(file);
          setImageBuffer(new Uint8Array(reader.result));
          setImageUrl(URL.createObjectURL(file));
        }
      }


      const handleSubmit = async (event) => {
        event.preventDefault();
        const imageAdded = await ipfs.add(imageBuffer);
        setImageHash("https://ipfs.io/ipfs/"+imageAdded.path);
        console.log("imageAdded.path","https://ipfs.io/ipfs/"+imageAdded.path);
        let url = "https://ipfs.io/ipfs/"+imageAdded.path
        await sendTx(url);
      }

    const handleClick = (data) => {
       // const value = 2; // 要传递的值
        props.onValueChange(data); // 调用回调函数将值传递给父组件
    };

    const mintNFTToken = async(event) =>{
        handleSubmit(event);
    }
    //button 返回页面

    const sendTx = async (url) => {
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
        console.log("param",title, id, area, rent,pledge, electric, hot, cold,contractTime, contractState, payTime, payStatus);
        let newContractTime;
        let newPayTime;
        if (contractState == 0) {
            newContractTime = contractTime*30*24*3600
        }else{
            newContractTime = contractTime*30*24*3600*12
        }
        if (payStatus == 0) {
            newPayTime = payTime*30*24*3600
        }else{
            newPayTime = payTime*30*24*3600*12
        }
        console.log("image url",url);
        let rentInfo = [title, id, area, rent,pledge, electric, hot, cold, newContractTime,  newPayTime, url]
        contract.methods.createItem(rentInfo).send({ from: window.ethereum.selectedAddress })
            .on('transactionHash', (hash) => {
            // 显示正在交易的提示
                success(hash);
             })
            .on('receipt', (receipt) => {
                // 处理交易成功的回调
                console.log("receipt",receipt);
                handleClick(2);
            })
            .on('error', (error) => {
                // 处理交易失败的回调
                console.log("error",error);
            });
    }

    return(
        <div className='MintNFT'>
            <form className='Upload-form'>
                <Input className='Upload-form-input' type="file" multiple="multiple"  onChange={handleChange} accept="image/png, image/jpeg ,image/jpg "></Input>
            </form>
            <>
                {contextHolder}

            </>
            <div className='Upload-form-box'>
            {imageUrl &&<Image className='NFTImg' width={'450px'}  height={'300px'} src={imageUrl} alt="NFT preview"/>}
            </div>
                <Button style={{ width: '225px', height: '100px', position: 'absolute', top: '750px' }} onClick={e => mintNFTToken(e)}>出租房屋</Button>
        </div>
        
    );
}

export default HouseImg;