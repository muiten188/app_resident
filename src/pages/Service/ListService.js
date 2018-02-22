import React from 'react';
import { View, Image, StyleSheet, ScrollView } from 'react-native';
import { Functions } from '../../libs';
import { Navbar, TextView, Card, GradientButton } from '../../component';
import LinearGradient from 'react-native-linear-gradient';
import Themes from '../../themes/index';
import I18n from '../../i18n/index';
import ServiceItemRegistered from './ServiceItem';
import RegisterOptionItem from './OptionItem';
import { Actions } from 'react-native-router-flux';
import { SessionManager } from '../../libs';
import HttpClientHelper from '../../libs/HttpClientHelper';
import User from '../../models/User';
import RegisterService from '../../models/RegisterService';
import MessageHandler from '../../libs/MessageHandler';
import HTMLView from 'react-native-htmlview/HTMLView';

class DialogOption extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      register_type: this.props.selected,
      text_expand: false
    };
    this.data = [];
  }

  render () {
    let options = ['OWNER', 'RENTER', 'BORROWER', 'FAMILY', 'EXPAND'];
    let cmp = [];

    for (let i in options) {
      let option = options[i];
      cmp.push(<RegisterOptionItem key={'option_' + i} selected={this.state.register_type == option}
                                   text={I18n.t(option)} onPress={() => {
        this.setState({register_type: option});
        if (this.props.onSelectedItem)
          this.props.onSelectedItem(i, option);
      }}/>);
    }

    return <View style={{width: 300, alignSelf: 'center', marginTop: 20}}>
      <View style={{marginTop: 35, zIndex: 0}}>
        <Card containerStyle={{minHeight: 100, paddingTop: 50, padding: 15, paddingBottom: 30}}>
          {cmp}
        </Card>
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          height: 80,
          width: 300,
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1
        }}>
        <LinearGradient
          start={{x: 0.0, y: 0}}
          end={{x: 1, y: 0}}
          locations={[0, 0.6, 1]}
          colors={['#005dac', '#1581d8', '#2196f3']}
          style={styles.linearGradient}>
          <TextView style={styles.buttonText}>
            {this.props.title}
          </TextView>
        </LinearGradient>
        <Image source={Themes.Resource[this.props.icon]}
               style={{position: 'absolute', left: 0, top: 0, width: 80, height: 80, resizeMode: 'cover'}}/>
      </View>
    </View>;
  }
}

export default class ListService extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      register_type: '',
      reload: false
    };
    RegisterService.clear();
    let motor_rule = '', car_rule = '';
    try {
      for (let i in SessionManager.getRegulation()) {
        let data = SessionManager.getRegulation()[i];
        if (data.dateType == 'OPTION_SERVICE') {
          for (let j in data.data) {
            let content = data.data[j];
            if (content.regulationSubCategory == 'DICHVUOTO') {
              car_rule = content.content;
            }
            if (content.regulationSubCategory == 'DICHVUXAMAY') {
              motor_rule = content.content;
            }
          }
          break;
        }
      }
    } catch (e) {}

    this.config = {
      motor: {
        icon: 'xe_may',
        title: I18n.t('motor_service'),
        rule: motor_rule,
        vehicleType: 'xemay',
      },
      car: {
        icon: 'oto',
        title: I18n.t('car_service'),
        rule: car_rule,
        vehicleType: 'oto',
      }
    };

    this.loadData = this.loadData.bind(this);
  }

  componentDidMount () {
    this.loadData();
    MessageHandler.register('new_service', this.loadData);
  }

  componentWillUnmount () {
    MessageHandler.remove('new_service', this.loadData);
  }

  reload () {
    this.setState({reload: !this.state.reload});
  }

  loadData () {
    let params = {
      apartmentId: User.currentApartmentId,
      vehicleType: this.config[this.props.service_type]['vehicleType']
    };
    HttpClientHelper.get('registration', params, (err, res) => {
      if (!err) {
        console.log(res);
        this.data = res;
        this.reload();
      }
    });
  }

  showOptions () {
    Functions.showModal({
      contentOnly: true,
      body: <DialogOption selected={this.state.register_type}
                          title={this.config[this.props.service_type]['title']}
                          icon={this.config[this.props.service_type]['icon']}
                          onSelectedItem={(index, data) => {
                            this.setState({register_type: data.type});
                          }}/>,
      buttonText: 'Tiếp',
      buttonText2: 'Hủy',
      mCallback: () => {
        if (this.state.register_type != '') {
          RegisterService.registrationType = this.state.register_type;
          RegisterService.apartmentId = User.currentApartmentId;
          RegisterService.serviceType = this.props.service_type;
          Actions.RegisterNewService({
            title: this.config[this.props.service_type]['title'],
            icon: this.config[this.props.service_type]['icon'],
          });
        } else {
          Functions.showModal({
            body: <TextView>Bạn cần chọn một hình thức đăng ký</TextView>,
            mCallback: () => {
              this.showOptions();
            }
          });
        }
      }
    });
  }

  render () {
    let text_expand_props = {};
    if (!this.state.text_expand) {
      text_expand_props = {numberOfLines: 5};
    }
    let services = [];

    for (let i in this.data) {
      if (i > 20) break;
      let item = this.data[i];
      console.log(item);
      services.push(<ServiceItemRegistered key={'vehiclePlate' + i} license_plate={item.vehiclePlate}
                                           status={I18n.t(item.status)}
                                           canEdit={item.status == 'PENDING1'} canDelete={item.status == 'PENDING1'}/>);
    }

    return (

      <View style={{paddingBottom: 20, flex: 1}}>
        <Navbar title={I18n.t('optional_service')}/>
        <ScrollView style={{flex: 1}}>
          <View>
            <View style={{width: 300, alignSelf: 'center', marginTop: 20}}>
              <View style={{marginTop: 35, zIndex: 0}}>
                <Card
                  containerStyle={{minHeight: 100, paddingTop: 50, padding: 15, paddingBottom: 15}}>
                  <HTMLView
                    {...text_expand_props}
                    onPress={() => {this.setState({text_expand: !this.state.text_expand});}}
                    value={this.config[this.props.service_type]['rule']}/>
                  {!this.state.text_expand &&
                  <TextView
                    onPress={() => {this.setState({text_expand: !this.state.text_expand});}}
                    style={{
                      textAlign: 'right',
                      color: Themes.Colors.profileText,
                      marginTop: 10
                    }}>{I18n.t('read_more')}</TextView>}
                </Card>
              </View>
              <View
                style={{
                  zIndex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 80,
                  width: 300,
                  position: 'absolute',
                  top: 0,
                  left: 0
                }}>
                <LinearGradient
                  start={{x: 0.0, y: 0}}
                  end={{x: 1, y: 0}}
                  locations={[0, 0.6, 1]}
                  colors={['#005dac', '#1581d8', '#2196f3']}
                  style={styles.linearGradient}>
                  <TextView style={styles.buttonText}>
                    {this.config[this.props.service_type]['title']}
                  </TextView>
                </LinearGradient>
                <Image source={Themes.Resource[this.config[this.props.service_type]['icon']]}
                       style={{position: 'absolute', left: 0, top: 0, width: 80, height: 80, resizeMode: 'cover'}}/>
              </View>
            </View>
            <View style={{width: 300, alignSelf: 'center', marginTop: 20}}>
              <Card containerStyle={{width: 300, padding: 15}}>
                <TextView style={{
                  fontSize: 17,
                  fontWeight: '500',
                  color: '#39484d'
                }}>{this.config[this.props.service_type]['title']}</TextView>
                <View style={{height: 0.5, backgroundColor: '#ccc', marginTop: 8, marginBottom: 8}}/>
                {services}
              </Card>
            </View>
            <GradientButton containerStyle={{width: 200, alignSelf: 'center', marginTop: 20}} text={'Đăng ký mới'}
                            onPress={() => {
                              this.showOptions();
                            }}/>
          </View>
        </ScrollView>
      </View>
    );
  }
}

// Later on in your styles..
const styles = StyleSheet.create({
  wrapper: {
    paddingLeft: 15,
    paddingRight: 15,
    justifyContent: 'center',
    height: 44,
    backgroundColor: '#f5f5f5',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#bbb',
    margin: 5
  },
  linearGradient: {
    paddingLeft: 40,
    paddingRight: 15,
    borderRadius: 23,
    width: 300,
    justifyContent: 'center',
    height: 44,
  },
  buttonText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
});