import { Card } from 'antd';
const { Meta } = Card;
const ItemCard = () => (
  <Card className="item-card"
    hoverable
    cover={<img className='item-img' style={{height:180,width:250}} alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
  >
    <Meta title="Europe Street beat" description="www.instagram.com" />
  </Card>
);
export default ItemCard;