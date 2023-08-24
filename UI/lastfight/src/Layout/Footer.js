import React, { Component } from 'react'
import '../css/layout.css';
import { Layout } from 'antd';

export default class LayoutFooter extends Component {
  render() {
    const { Footer } = Layout;
    return (
        <Footer
        style={{
            textAlign: 'center', backgroundColor: "#262629"
        }}
    >
        <p style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 'larger', color: 'white' }}>ZSC201 @ 2023</p>
    </Footer>
    )
  }
}
