import { Select } from 'antd';
const handleChange = (value) => {
  console.log(value); // { value: "lucy", key: "lucy", label: "Lucy (101)" }
};

const SelectGender = () => (
  <Select
    labelInValue
    defaultValue={{
      value: '1',
      label: '男 ',
    }}
    style={{
      width: 120,
    }}
    onChange={handleChange}
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
);
export default SelectGender;