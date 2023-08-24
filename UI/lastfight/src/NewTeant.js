import React, { Component } from 'react'
import { Layout, Input } from 'antd';
import { UserOutlined, PhoneOutlined, IdcardOutlined, AuditOutlined } from '@ant-design/icons';
import SelectGender from './Layout/SelectGender';
import TenantUploadIpfs from './Layout/TenantUploadIpfs';
import './css/newland.css';
import Web3 from "web3";
import { NODE_URL } from "./config/config";
import { Select } from 'antd';
const web3 = new Web3(NODE_URL);


export default class NewTeant extends Component {


    constructor(props) {
        super(props);
        this.state = {
            value: null, // 状态中保存值
            landlordname: '',
            phone: '',
            gender: '1',
            idCard: ''
        };
        // 绑定函数
        this.handleInputChange = this.handleInputChange.bind(this);
    }



    // 回调函数将值从子组件传递给父组件 创建新的用户时进行页面跳转
    handleValueChange = (value) => {
        this.setState({ value });
        this.props.onValueChange(value); // 将回调函数继续传递给父组件
    };

    handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;
        this.setState({
            [name]: value
        });
    }

    handleChange = (value) => {
        console.log(value);
        this.setState({
            gender: value.value
        });
    };
    render() {

        const { Content } = Layout;


        return (
            <Content style={{ padding: '0 ', }}>
                <div
                    className="land-site-layout-content"
                    style={{
                        backgroundImage: ' linear-gradient(to top,#000000,#696969,#D3D3D3,#DCDCDC)', width: "100%"
                    }}>
                    <div className='land-form'>
                        <div className='newland-input-box'>
                            <span className='input-box-tag'>姓名</span>
                            <Input className='input-box-content' type="text" size="large" placeholder="请输入姓名" prefix={<IdcardOutlined />} name="landlordname" value={this.state.landlordname} onChange={this.handleInputChange} />
                            <div>
                                <Select
                                    labelInValue
                                    defaultValue={{
                                        value: '1',
                                        label: '男 ',
                                    }}
                                    style={{
                                        width: 120,
                                    }}
                                    onChange={this.handleChange}
                                    options={[
                                        {
                                            value: '0',
                                            label: '女 ',
                                        },
                                        {
                                            value: '1',
                                            label: '男 ',
                                        },
                                        {
                                            value: '其他',
                                            label: '其他 ',
                                        },
                                    ]}
                                />
                            </div>
                        </div>
                        <div className='newland-input-box'>
                            <span className='input-box-tag'>电话号码</span>
                            <Input className='input-box-content' type="number" maxLength="11" size="large" placeholder="电话号码" prefix={<PhoneOutlined />} name="phone" value={this.state.phone} onChange={this.handleInputChange} />

                        </div>
                        <div className='newland-input-box'>
                            <span className='input-box-tag'>身份证号码</span>
                            <Input className='input-box-content' type="text" size="large" placeholder="身份证号码" prefix={<IdcardOutlined />} name="idCard" value={this.state.idCard} onChange={this.handleInputChange} />
                        </div>
                        <div className='newland-input-box'>
                            <TenantUploadIpfs inputValues={this.state} onValueChange={this.handleValueChange} ></TenantUploadIpfs>
                        </div>

                    </div>

                    <AuditOutlined style={{ fontSize: '400px', color: '#ffffff', position: 'absolute', top: '20%', left: '55%' }} />
                </div>
            </Content>
        )
    }
}
