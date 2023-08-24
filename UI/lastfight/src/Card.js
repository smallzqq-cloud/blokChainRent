import { Card } from 'antd';

const CardImage = () => (


  <div style={{
    backgroundColor: '#262629',
    margin: 'auto', width: "60%", height: "50%", left: 0, right: 0, top: 0, bottom: '0', gap: '90px', borderRadius: "30px",
    display: 'flex', flexDirection: 'row', alignItems: "center", justifyContent: "center", position: 'absolute', borderStyle: 'none'
  }}>

    <Card hoverable style={{ width: 240, height: 300, backgroundColor:'black'}} bordered={false} cover={<img alt="example" style={{ width: 240, height: 250 }} src='https://bafkreif4twg7wqst3rjxydbrm64uva4p7ecndcgockajlksmpqa76q37vu.ipfs.nftstorage.link/' />}>
      <p style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 'larger',color: '#ffffff',fontWeight:800 }}>我是房东</p>
    </Card>
    <Card hoverable style={{ width: 240, height: 300, backgroundColor:'black'}} bordered={false} cover={<img alt="example" style={{ width: 240, height: 250 }} src="https://bafkreifqnkorvgd4qbe4hv6sxm4zufz2inr6wqbvf4boc2d5qawriwx7fa.ipfs.nftstorage.link/" />}>
      <p style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 'larger',color: '#ffffff',fontWeight:900,fontSize: '15px' }}>我是租户</p>
    </Card>
    <p style={{ left: '40%', fontSize: '30px', color: '#ffffff', position: 'absolute', bottom: '10%',fontWeight:800}} >Choose your identity</p>
  </div>

);
export default CardImage;