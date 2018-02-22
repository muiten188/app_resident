import React from 'react'

import {
  View,
  Image
} from 'react-native'

import {TextView} from '../../component'
import * as Themes from '../../themes'

const InfoItem = (props) => {
  return (
    <View style={styles.container}>
      <TextView style={styles.label}>{props.label + ":"}</TextView>
      <TextView style={styles.text}>{props.text}</TextView>
    </View>
  )
}

const styles = {
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10
  },
  label: {
    color: '#404f53',
    fontSize: 13,
    marginLeft: 20
  },
  text: {
    color: '#404f53',
    fontWeight: 'bold',
    fontSize: 13,
    marginLeft: 10
  }
}

export default InfoItem;


