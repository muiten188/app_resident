import React, { Component } from 'react';
import { View, ListView, Image, Text, TextInput, Keyboard, Platform } from 'react-native';
import InvertibleScrollView from 'react-native-invertible-scroll-view';
import { Navbar, Touchable, TextView } from '../../component';
import * as Themes from '../../themes';
import { Icon } from 'react-native-elements';
import I18n from '../../i18n';
import { RealmHelper, SyncManager, MessageHandler, HttpClientHelper } from '../../libs/';

var dismissKeyboard = require('dismissKeyboard');

var ViewType = {
  left: 'left',
  right: 'right'
};

export default class ReportConversation extends Component {

  ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
  messages = [];
  user = {};

  constructor (props) {
    super(props);
    this.state = {
      reload: true,
      keyboardHeight: 0,
      keyword: ''
    };
    this.loadData = this.loadData.bind(this);
    RealmHelper.write(() => {
      RealmHelper.getInstance().create('Conversation', {conversationId: props.item.conversationId, isRead: 1}, true);
    });
  }

  loadData () {
    try {
      this.messages = RealmHelper.getInstance().objects('ConversationDetail').filtered('conversationId=' + this.props.item.conversationId).sorted('conversationDetailId', true);
      this.reload();
    } catch (e) {
    }
  }

  reload () {
    this.setState({
      reload: !this.state.reload
    });
  }

  _getItemViewType (rowData) {
    return rowData.conversationSentFrom == 'APP' ? ViewType.right : ViewType.left;
  }

  _renderRow (rowData, sectionID, rowID, highlightRow) {
    let paddingBottom = 2;
    try {
      let preRowData = this.messages[rowID - 1];
      if (preRowData == undefined || this._getItemViewType(rowData) != this._getItemViewType(preRowData)) {
        paddingBottom = 8;
      }
    } catch (e) {
    }
    if (this._getItemViewType(rowData) == ViewType.left) {
      return (<View style={{paddingLeft: 10, paddingTop: 2, paddingBottom: paddingBottom, alignItems: 'flex-start'}}>
        <View style={{
          padding: 10,
          paddingLeft: 15,
          paddingRight: 15,
          borderRadius: 4,
          maxWidth: parseInt(Themes.Metrics.screenWidth * 2 / 3),
          backgroundColor: '#eaeaea'
        }}>
          <TextView style={{}}>{rowData.conversationDetailContent}</TextView>
        </View>
        <TextView style={{fontSize: 10, color: '#ccc', paddingBottom: 8, paddingTop: 3}}>23:20:20 11/09/2017</TextView>
      </View>);
    } else {
      return (<View style={{paddingRight: 10, paddingTop: 2, paddingBottom: paddingBottom, alignItems: 'flex-end'}}>
        <View style={{
          padding: 10,
          paddingLeft: 15,
          paddingRight: 15,
          borderRadius: 4,
          maxWidth: parseInt(Themes.Metrics.screenWidth * 2 / 3),
          backgroundColor: '#0084ff'
        }}>
          <TextView style={{color: '#ffffff'}}>{rowData.conversationDetailContent}</TextView>
        </View>
        <TextView style={{fontSize: 10, color: '#ccc', paddingBottom: 8, paddingTop: 3}}>23:20:20 11/09/2017</TextView>
      </View>);
    }
  }

  componentDidMount () {
    this.loadData();
    RealmHelper.getInstance().addListener('change', this.loadData);
  }

  _dismissKeyboard () {
    dismissKeyboard();
  }

  async _sendTextMsg () {
    if (this.state.keyword.trim() === '') {
      return;
    }
    let params = {
      'apartmentId': this.props.item.apartmentId,
      'content': this.state.keyword.trim(),
      'conversationId': this.props.item.conversationId,
      'conversationType': this.props.item.conversationType
    };
    HttpClientHelper.post('conversation', params, (err, res) => {
      if (!err) {
        // this.messages.push({
        //   conversationSentFrom: 'APP',
        //   conversationDetailContent: this.state.keyword
        // });
        MessageHandler.notify('report');
        this.setState({keyword: ''});
      }
    });
  }

  render () {
    return (
      <View style={{flex: 1, backgroundColor: '#ffffff'}}>
        <Navbar title={I18n.t('REPORT') + I18n.t(this.props.item.conversationType)}/>
        <View style={{flex: 1, paddingBottom: 52 + this.state.keyboardHeight}}>
          <ListView
            renderScrollComponent={props => <InvertibleScrollView {...props} inverted/>}
            style={{flex: 1, paddingTop: 5, paddingBottom: 5}}
            keyboardShouldPersistTaps="always"
            enableEmptySections={true}
            dataSource={this.ds.cloneWithRows(this.messages)}
            renderRow={(rowData, sectionID, rowID, highlightRow) => this._renderRow(rowData, sectionID, rowID, highlightRow)}
            pageSize={6}/>
        </View>
        <View style={{
          position: 'absolute',
          bottom: this.state.keyboardHeight,
          backgroundColor: '#ffffff',
          left: 0,
          width: Themes.Metrics.screenWidth
        }}>
          <View style={{height: 1, backgroundColor: Themes.Colors.borderColor}}/>
          <View style={{height: 56, flexDirection: 'row', alignItems: 'center', paddingLeft: 20}}>
            <View style={{
              flex: 1,
              justifyContent: 'center',
              borderRadius: 22,
              paddingRight: 10,
              paddingLeft: 10,
              borderColor: Themes.Colors.borderColor,
              borderWidth: 1,
              height: 44,
            }}>
              <TextInput
                editable={this.props.item.conversationStatus != 'REPORT_DONE'}
                autoCapitalize="none"
                autoFocus={false}
                blurOnSubmit={true}
                placeholder={I18n.t('enter_text')}
                placeholderColor="#838383"
                autoCorrect={false}
                underlineColorAndroid="transparent"
                value={this.state.keyword}
                onChangeText={(value) => {
                  this.setState({keyword: value});
                }}
                onSubmitEditing={() => {
                  this._sendTextMsg();
                }}
                returnKeyType="send"
                multiline={false}
                style={[{
                  padding: 0,
                  fontSize: Themes.Fonts.size.regular,
                  marginLeft: 10,
                  height: 44,
                }]}
                ref={(component) => this._textInput = component}
              />
            </View>
            <Touchable onPress={() => {
              this._sendTextMsg();
            }} style={{width: 60, height: 50, alignItems: 'center', justifyContent: 'center'}}>
              <Icon
                size={30}
                color={Themes.Colors.background}
                name='send'/>
            </Touchable>
          </View>
          <View style={{height: 1, backgroundColor: Themes.Colors.background}}/>
        </View>
      </View>
    );
  }

  componentWillMount () {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardDidShow.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardDidHide.bind(this));
  }

  keyboardDidShow (e) {
    // console.log(e.endCoordinates.height);
    this.setState({
      keyboardHeight: Platform.OS == 'ios' ? e.endCoordinates.height : 0
    });
  }

  keyboardDidHide (e) {
    this.setState({
      keyboardHeight: 0
    });
  }

  componentWillUnmount () {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    RealmHelper.getInstance().removeListener('change', this.loadData);
    // realm.removeListener('change', this.listenerChat);
  }
}
