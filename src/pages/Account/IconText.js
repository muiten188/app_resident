import React from 'react'

import {
  View,
  Image
} from 'react-native'

import {TextView} from '../../component'
import * as Themes from '../../themes'

const IconText = (props) => {
  return(
    <View style={styles.container}>
      <Image style={styles.image} source={Themes.Resource[props.icon]} />
      <TextView style={styles.text}>{props.text}</TextView>
    </View>
  )
}

const styles = {
  container: {
    flexDirection: 'row',
    justifyContent:'flex-start',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10
  },
  image: {
    width: 20,
    height: 20,
    marginLeft: 15,
    marginRight: 15,
    backgroundColor: 'transparent',
    tintColor: '#9aa1a6',
    resizeMode: 'contain'
  },
  text: {
    color: '#39484d',
    fontSize: 13
  }
}

export default IconText