import React from 'react';
import { View, StyleSheet, FlatList, Image } from 'react-native';
import HttpClientHelper from '../../libs/HttpClientHelper';
import User from '../../models/User';
import TextView from '../../component/TextView/index';
import Themes from '../../themes/index';

export default class Family extends React.Component {

  state = {
    loading: true
  };

  componentDidMount () {
    this.loadData();
  }

  loadData () {
    let params = {
      url_params: {
        apartmentId: User.currentApartmentId
      }
    };
    HttpClientHelper.get('family', params, (err, res) => {
      if (!err) {
        this.data = res;
        this.setState({
          loading: false
        });
      }
    });
  }

  getAvatar (item, max_size = 150) {
    let avatar = 'https://ui-avatars.com/api/?size=400&background=fff&color=000&name=' + item.username;
    if (item.fullName != '') {
      avatar = 'https://ui-avatars.com/api/?size=400&background=fff&color=000&name=' + item.fullName;
    }
    if (item.avatar != undefined && item.avatar != null && item.avatar != '' && item.avatar != 'null') {
      return HttpClientHelper.IMAGE_URL + '/' + User.avatar;
    }
    return avatar;
  }

  render () {
    return (
      <View style={{flex: 1, justifyContent: 'center'}}>
        {this.data && this.data.length > 0 && <FlatList
          style={{padding: 5}}
          data={this.data}
          keyExtractor={(item, index) => index}
          renderItem={({item, index}) => {
            return (
              <View style={{
                height: 60,
                width: Themes.Metrics.width - 20,
                margin: 5,
                backgroundColor: '#fff',
                padding: 5,
                borderRadius: 3
              }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image source={{uri: this.getAvatar(item)}}
                         style={{
                           height: 50,
                           width: 50,
                           resizeMode: 'cover',
                           borderRadius: 25,
                           borderWidth: 1,
                           borderColor: '#f1f1f1'
                         }}/>
                  <View style={{marginLeft: 10, flex: 1}}>
                    <TextView style={{fontSize: 18}}>{item.fullName}</TextView>
                    <TextView>Nghề nghiệp: {item.occupation}</TextView>
                  </View>
                </View>
              </View>
            );
          }}
        />}
        {(this.data == undefined || (this.data && this.data.length == 0)) && !this.state.loading &&
        <TextView style={{textAlign: 'center', padding: 20}}>Chưa có thành viên nào</TextView>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({});