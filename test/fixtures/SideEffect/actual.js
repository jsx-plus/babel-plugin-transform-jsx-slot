import React from 'react';

function View() {
  return (
    <div>
      <slot name="header" />
    </div>
  )
}

export default function App() {
  return (
    <View>
      <div x-slot:header>
        <span>122123</span>
      </div>
    </View>
  );
}