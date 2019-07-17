# babel-plugin-transform-jsx-slot

Support Slot directive for JSX.

## Example

**Usage In**

```jsx
<WaterFall>
  <view x-slot:header>header</view>
  <view x-slot:item="props">item: {props.item}</view>
  <view x-slot:footer>footer</view>
</WaterFall>
```

**Usage Out**

```jsx 
<WaterFall
  $slots={{
    header: () => <view>header</view>,
    item: props => <view>item: {props.item}</view>,
    footer: () => <view>footer</view>
  }}
></WaterFall>
```

**Component In**

```jsx
 <view>
  <slot name="header" />

  {arr.map(item => {
    return <slot name="item" item={item} />;
  })}

  <slot name="footer" />
</view>
```

**Component Out**
```jsx
<view>
  <$slot name="header" $slots={$slots} />

  {arr.map(item => {
    return <$slot name="item" item={item} $slots={$slots} />;
  })}

  <$slot name="footer" $slots={$slots} />
</view>
```

## Installation

```sh
$ npm install babel-plugin-transform-jsx-slot
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "plugins": ["transform-jsx-slot"]
}
```

### Via CLI

```sh
$ babel --plugins transform-jsx-slot script.js
```

### Via Node API

```javascript
require("babel-core").transform("code", {
  plugins: ["transform-jsx-slot"]
});
```
