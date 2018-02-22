import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

class Com2 extends React.Component {

  constructor () {
    super();
    alert(1);
  }

  render() {
    setTimeout(()=>{
      alert(2);
    }, 1000)
    return <View style={{flex: 1}}></View>;
  }
}
export default class Com1 extends React.Component {

  constructor () {
    super();
    this.state = {
      reload: false
    }
  }

  render() {
    return <View style={{flex: 1}}>
      <Com2/>
      <Text onPress={()=>{
        this.setState({reload: !this.state.reload})
      }}>RELOAD</Text>
    </View>;
  }
}

const styles = StyleSheet.create({
});