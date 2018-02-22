import React from 'react';
import {View, TextInput} from 'react-native';
import {Icon} from 'react-native-elements';

export default class InputValidation extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: '',
      error: '',
    }
    this.onChangeText = this.onChangeText.bind(this);
  }

  validate() {
    if (this.props.validate) {
      let {checked, message} = this.props.validate(this.state.value);
      if (!checked)
        this.setState({error: message});
      else this.setState({error: ''});
      if (this.props.onValidate)
        this.props.onValidate(checked);
    }
  }

  onChangeText(text) {
    console.log(text)
    this.setState({value: text});
    if (this.props.onChangeText)
      this.props.onChangeText(text);
  }

  render() {
    let height = 50;
    if (this.props.containerStyle && this.props.containerStyle.height)
      height = this.props.containerStyle.height;
    return (<View style={[{height: height}, this.props.containerStyle, {flexDirection: 'row'}]}>
      <TextInput {...this.props}
                 style={[this.props.type, {paddingRight: 10, height: height, flex: 1}]}
                 onChangeText={this.onChangeText} onBlur={() => {
        this.validate()
        if (this.props.onFocus)
          this.props.onFocus();
      }}/>
      {this.state.error != '' && <Icon onPress={() => {
        this.props.onPressError(this.state.error)
      }} name={'info'} color={'red'} style={{height: height, width: height}}/>}

    </View>);
  }
}