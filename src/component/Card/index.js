import React from 'react'

import {
	View,
	StyleSheet
} from 'react-native'

const Card = (props) => {
	return (
		<View style={[Styles.containerStyle, props.containerStyle]}>
			{props.children}
		</View>
	)
}

const Styles = StyleSheet.create({
	containerStyle: {
		borderWidth: 1,
		borderRadius: 8,
		borderColor: '#ddd',
		borderBottomWidth: 0,
		shadowColor: '#000',
		shadowOffset: {width: 0, height: 2},
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 1,
		backgroundColor: '#fff'
	}
})

export default Card
