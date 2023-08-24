import React, { Component } from 'react'
import { Layout, Input, Select, Button } from 'antd';
import '../../css/create.css'
import { UserOutlined, PhoneOutlined, IdcardOutlined, AuditOutlined } from '@ant-design/icons';
import HouseImg from './HouseImg';
export default class CreateItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: null, // 状态中保存值
            title: '',
            id: '',
            area: '',
            rent: '',
            pledge: '',
            electric: '',
            hot: '',
            cold: '',
            contractTime: '',
            contractState: '0',
            payTime: '',
            payStatus: '0   '
        };
        // 绑定函数
        this.handleInputChange = this.handleInputChange.bind(this);
    }




    handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;
        this.setState({
            [name]: value
        });
    }

    handleContractTimeChange = (value) => {
        console.log(value);
        this.setState({
            contractState: value.value
        });
    };

    handlePayTimeChange = (value) => {
        console.log(value);
        this.setState({
            payStatus: value.value
        });
    };

    // 回调函数将值从子组件传递给父组件 创建新的用户时进行页面跳转
    handleValueChange = (value) => {
        this.setState({ value });
        this.props.onValueChange(value); // 将回调函数继续传递给父组件
    };

    render() {
        const { Content } = Layout;
        //button 返回item查询


        return (
            <Content style={{ padding: '0 ' }}>
                <div className="site-layout-content">
                    <div className='Create-form'>
                        <div className='Create-input-item'>
                            <div className='create-input-box'>
                                <span className='create-input-box-tag'>标题</span>
                                <Input className='create-input-box-content' type="text" size="large" placeholder="请输入标题" name='title' onChange={this.handleInputChange} prefix={<UserOutlined />} />
                            </div>
                            <div className='create-input-box'>
                                <span className='create-input-box-tag'>房屋编号</span>
                                <Input className='input-short-content' type="number" size="large" placeholder="请输入房屋编号" name='id' onChange={this.handleInputChange} prefix={<IdcardOutlined />} />
                                <span className='create-input-box-tag'>房屋面积</span>
                                <Input className='input-short-content' type="number" size="large" placeholder="请输入房屋面积" name='area' onChange={this.handleInputChange} prefix={<IdcardOutlined />} />
                            </div>

                            <div className='create-input-box'>
                                <span className='create-input-box-tag'>房屋租金/月</span>
                                <Input className='input-short-content' type="number" size="large" placeholder="请输入房屋租金" name='rent' onChange={this.handleInputChange} prefix={<IdcardOutlined />} suffix="RMB" />
                                <span className='create-input-box-tag'>房屋押金</span>
                                <Input className='input-short-content' type="number" size="large" placeholder="请输入房屋押金" name='pledge' onChange={this.handleInputChange} prefix={<IdcardOutlined />} suffix="RMB" />
                            </div>

                            <div className='create-input-box'>
                                <span className='create-input-box-tag'>房屋电费/度</span>
                                <Input className='input-short-content' type="number" size="large" placeholder="请输入房屋电费" name='electric' onChange={this.handleInputChange} prefix={<IdcardOutlined />} suffix="RMB" />
                            </div>
                            <div className='create-input-box'>
                                <span className='create-input-box-tag'>房屋热水费/吨</span>
                                <Input className='input-short-content' type="number" size="large" placeholder="请输入房屋热水费" name='hot' onChange={this.handleInputChange} prefix={<IdcardOutlined />} suffix="RMB" />
                                <span className='create-input-box-tag'>房屋冷水费/吨</span>
                                <Input className='input-short-content' type="number" size="large" placeholder="请输入房屋冷水费" name='cold' onChange={this.handleInputChange} prefix={<IdcardOutlined />} suffix="RMB" />
                            </div>
                            <div className='create-input-box'>
                                <Input className='input-short-content' type="number" size="large" placeholder="请输入合同有效期" name='contractTime' onChange={this.handleInputChange} prefix={<IdcardOutlined />} />
                                <Select
                                    labelInValue
                                    defaultValue={{
                                        value: '0',
                                        label: 'month ',
                                    }}
                                    style={{
                                        width: 120,
                                    }}
                                    onChange={this.handleContractTimeChange}
                                    options={[
                                        {
                                            value: '1',
                                            label: 'year ',
                                        },
                                        {
                                            value: '0',
                                            label: 'month ',
                                        },

                                    ]}
                                />
                            </div>
                            <div className='create-input-box'>
                                <Input className='input-short-content' type="number" size="large" placeholder="请输入租金支付时间" name='payTime' onChange={this.handleInputChange} prefix={<IdcardOutlined />} />
                                <Select
                                    labelInValue
                                    defaultValue={{
                                        value: '0',
                                        label: 'month ',
                                    }}
                                    style={{
                                        width: 120,
                                    }}
                                    onChange={this.handlePayTimeChange}
                                    options={[
                                        {
                                            value: '1',
                                            label: 'year ',
                                        },
                                        {
                                            value: '0',
                                            label: 'month ',
                                        },

                                    ]}
                                />
                            </div>

                        </div>
                        <div className='input-uploadimg'>
                            <HouseImg inputValues={this.state} onValueChange={this.handleValueChange}  />
                        </div>
                    </div>
                </div>

            </Content>
        )
    }
}
