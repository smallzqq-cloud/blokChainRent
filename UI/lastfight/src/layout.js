import { Layout } from 'antd';
import './css/layout.css';
import React from 'react'
import LayoutHeader from './Layout/Header'
import LayContent from './Layout/Content'
import LayoutFooter from './Layout/Footer'
import NewLandlord from './NewLandlord'
import CreateItem from './Layout/house/CreateHouse';
import House from './Layout/house/House'
import Item from './Layout/Item/Item'
import HouseInfo from './Layout/houseInfo/HouseInfo';
import NewTeant from './NewTeant';
import RentHouse from './Layout/house/RentHouse'

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            status: 0,
            receivedData: null
        }
        this.handleDataFromChild = this.handleDataFromChild.bind(this);
        this.handleCustomVariable = this.handleCustomVariable.bind(this);
    }

    handleDataFromChild(data) {
        this.setState({ status: data });
    }

    //定义一个接收子组件传值的方法
    getChildValue = data => {
        this.setState({  // this.setState({}) 这里赋值有点像 小程序this.setData({})
            status: data.status
        })

    }

    handleChildClick = (clickedData, customData) => {
        // 5. 子组件传入的数据被保存在状态中，可以在这里进行进一步处理
        this.setState({ receivedData: clickedData }, () => {
          console.log("received data:", this.state.receivedData);
          console.log("custom data:", customData);
          this.setState({  // this.setState({}) 这里赋值有点像 小程序this.setData({})
            status: customData
        })
        });
      };
    

    //接受从孙子组件那边传过来的值，用于页面跳转
    handleValueChange = (value) => {
        this.setState({ status: value });
    };

    handleCustomVariable(customVariable) {
        this.setState({ status: customVariable });
      }

    
    Which() {
        switch (this.state.status) {
            case 0:
                return <LayContent callback={this.getChildValue}></LayContent>
            case 1:
                return <NewLandlord onValueChange={this.handleValueChange}></NewLandlord>
            case 2:
                return <Item onClick={this.handleChildClick}></Item>
            case 3:
                return <House  onCustomVariable={this.handleCustomVariable}  parentProp={this.state.receivedData} ></House>
            case 4:
                return <CreateItem onValueChange={this.handleValueChange}></CreateItem>
            case 5:
                return <HouseInfo onClick={this.handleChildClick} ></HouseInfo>
            case 6:
                return <NewTeant onValueChange={this.handleValueChange}></NewTeant>
            case 7:
                    return <RentHouse callback={this.getChildValue}  parentProp={this.state.receivedData}></RentHouse>
            default:
                break;
        }
    }



    render() {
        

        return (
            <Layout className="layout" style={{ height: "100%" }}>

                <LayoutHeader onData={this.handleDataFromChild}></LayoutHeader>
                {this.Which()}
                {console.log(this.state.status)}
                <LayoutFooter></LayoutFooter>
            </Layout>
        );
    }

}
export default App;