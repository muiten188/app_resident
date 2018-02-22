import React from 'react';
import {View} from 'react-native';
import InputValidation from './InputValidation';
import PopoverTooltip from 'react-native-popover-tooltip';
import TextView from "../../component/TextView/index";

export default class TestValidate extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: ''
    }
  }

  validate(text) {
    return {checked: text.indexOf('A')==0, message: 'Tesst djdfdfjdfjdfj'};
  }

  render() {
    return <View style={{flex: 1}}>
      <InputValidation containerStyle={{backgroundColor: 'green', marginTop: 20}} validate={this.validate.bind(this)}
                       onChangeValidate={(validated) => {
                         console.log(validated);
                       }}/>

      <InputValidation onPressError={(msg)=>{alert(msg)}} containerStyle={{backgroundColor: 'green', marginTop: 20}} validate={this.validate.bind(this)}
                       onChangeValidate={(validated) => {
                         console.log(validated);
                       }}/>
      <PopoverTooltip
        ref='tooltip5'
        buttonComponent={
          <View style={{width:200, height:50, backgroundColor: 'yellow', justifyContent: 'center', alignItems: 'center', borderRadius: 5}}>
            <TextView>
              Press Me
            </TextView>
          </View>
        }
        items={[
          {
            label: 'Item 1',
            onPress: () => {}
          }
        ]}
        // animationType='timing'
        // using the default timing animation
        timingConfig={{duration: 100}}
        opacityChangeDuration={100} />
    </View>
  }
}