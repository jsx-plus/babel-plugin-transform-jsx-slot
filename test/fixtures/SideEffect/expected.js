import { $slot } from "babel-runtime-jsx-plus";
import React from 'react';

function View() {
  const $slots = this && this.props ? this.props.$slots : arguments[0].$slots;
  return <div>
      <$slot name="header" $slots={$slots} />
    </div>;
}

var _ref =
/*#__PURE__*/
<span>122123</span>;

export default function App() {
  return <View $slots={{
    header: () => <div>
        _ref
      </div>
  }}>
      
    </View>;
}