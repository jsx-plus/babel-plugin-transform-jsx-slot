import { createElement, Component } from 'react';

class WaterFall extends Component {
  render() {
    const arr = ["hello", "world"];

    return (
      <view>
        <slot name="header" />

        {arr.map((item) => {
          return (<slot name="item" item={item} />);
        })}

        <slot name="footer" />
      </view>
    );
  }
}


export default function Foo(props) {
  const { message } = props;
  return (
    <WaterFall><view x-slot:header>header</view><view x-slot:item="props">item: {props.item}</view><view x-slot:footer>footer</view></WaterFall>
  );
}
