import React, { Component } from 'react';

import {
  View,
  ScrollView
} from 'react-native';
import MonthCard from './MonthCard';

import moment from 'moment';
import Touchable from '../../component/Touchable/index';
import { Icon } from 'react-native-elements';
import Themes from '../../themes/index';

class DateScroller extends Component {

  constructor (props) {
    super(props);
    this.thisYear = moment().year();
    this.thisMonth = moment().month();
    this.state = {
      position: 12
    };

    this.months = [];
    for (let i = this.thisMonth; i < 12; i++) {
      this.months.push({text: (i + 1) + '/' + (this.thisYear - 1), month: i, year: this.thisYear - 1});
    }

    for (let i = 0; i < 12; i++) {
      this.months.push({text: (i + 1) + '/' + (this.thisYear), month: i, year: this.thisYear});
    }

    for (let i = 0; i < this.thisMonth; i++) {
      this.months.push({text: (i + 1) + '/' + (this.thisYear + 1), month: i, year: this.thisYear + 1});
    }
  }

  onChangeMonth (value) {
    this.setState({
      position: value
    }, () => {
      let offsetX = (this.state.position - 1) * 80 - 10;
      if (this._scrollView && offsetX) {
        this._scrollView.scrollTo({x: offsetX, y: 0, animated: false});
      }
    });
    this.props.onChange(this.months[value]['text']);
  }

  componentDidMount () {
    setTimeout(() => {
      this.onChangeMonth(12);
    }, 200);
  }

  render () {
    let monthCards = [];

    for (let i in this.months) {
      let item = this.months[i];
      monthCards.push(
        <MonthCard
          onPress={() => {
            this.onChangeMonth(i);
          }}
          key={i}
          text={item.text}
          selected={(this.state.position == i) ? true : false}
          style={{height: styles.container.height}}
        />);
    }

    let offsetX = (this.state.position - 1) * 80 - 10;

    return (
      <View style={{
        marginTop: 15,
        height: styles.container.height,
        flexDirection: 'row',
        paddingLeft: 15,
        paddingRight: 15,
        alignItems: 'center',
      }}>
        <Touchable
          style={{
            borderWidth: 1,
            borderColor: Themes.Colors.borderColor,
            borderRadius: 5,
            width: 40,
            height: 40,
            padding: 2,
            backgroundColor: '#ececec',
            alignItems: 'center',
            justifyContent: 'center'
          }} onPress={() => {
          let new_value = (this.state.position - 1);
          if (new_value < 0) new_value = 0;
          this.onChangeMonth(new_value);
        }}>
          <Icon name='angle-left' type='font-awesome' color={'#667174'}/>
        </Touchable>
        <ScrollView ref={(view) => this._scrollView = view} style={{flex: 1}} contentOffset={{x: offsetX}}
                    horizontal={true}
                    decelerationRate={0} snapToInterval={200}
                    scrollEnabled={false}
                    snapToAlignment={'center'}
                    showsHorizontalScrollIndicator={false}>
          <View style={styles.container}>
            {monthCards}
          </View>
        </ScrollView>
        <Touchable
          style={{
            borderWidth: 1,
            borderColor: Themes.Colors.borderColor,
            borderRadius: 5,
            width: 40,
            height: 40,
            backgroundColor: '#ececec',
            padding: 2,
            alignItems: 'center',
            justifyContent: 'center'
          }} onPress={() => {
          let new_value = (this.state.position + 1) % this.months.length;
          this.onChangeMonth(new_value);
        }}>
          <Icon name='angle-right' type='font-awesome' color={'#667174'}/>
        </Touchable>
      </View>
    );
  }
}

const styles = {
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 30
  }
};

export default DateScroller;

