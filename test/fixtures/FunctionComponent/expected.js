import { $slot } from "babel-runtime-jsx-plus";
import { createElement } from 'react';

function WaterFall() {
  const $slots = this && this.props ? this.props.$slots : arguments[0].$slots;
  const arr = ["hello", "world"];
  return <view>
      <$slot name="header" $slots={$slots} />

      {arr.map(item => {
      return <$slot name="item" item={item} $slots={$slots} />;
    })}

      <$slot name="footer" $slots={$slots} />
    </view>;
}

export default function Foo(props) {
  const {
    message
  } = props;
  return <WaterFall $slots={{
    header: () => <view>header</view>,
    item: props => <view>item: {props.item}</view>,
    footer: () => <view>footer</view>
  }}></WaterFall>;
}
