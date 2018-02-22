import React from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { Card } from '../../component';
import Themes from '../../themes/index';
import TextView from '../../component/TextView/index';
import Touchable from '../../component/Touchable/index';
import { Icon } from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import GradientButton from '../../component/GradientButton/index';
import { Actions } from 'react-native-router-flux';
import I18n from '../../i18n/index';
import SessionManager from '../../libs/SessionManager';
import HttpClientHelper from '../../libs/HttpClientHelper';

var {FileUploader} = require('react-native-file-uploader');
import ImageResizer from 'react-native-image-resizer';
import RegisterService from '../../models/RegisterService';

export default class UploadDocument extends React.Component {

  options = {
    title: 'Select image',
    storageOptions: {
      skipBackup: true,
      path: 'images'
    }
  };

  groups = [
    'VEHICLE_REGISTRATION', 'VEHICLE_IDENTIFY_CARD', 'VEHICLE_RED_BOOK', 'VEHICLE_TENANCY_CONTRACT', 'VEHICLE_TEMPORARY_REGISTRATION',
    'VEHICLE_RELATIONSHIP', 'VEHICLE_OWNER', 'VEHICLE_HAPULICO'
  ];

  documents = {};

  constructor (props) {
    super(props);
    this.state = {
      reload: false,
      uploading: false,
    };
    this.processUpload = this.processUpload.bind(this);
  }

  reload () {
    this.setState({
      reload: !this.state.reload
    });
  }

  showPicker (group) {
    ImagePicker.showImagePicker(this.options, (response) => {
      // console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        ImageResizer.createResizedImage(response.uri, 1000, 1000, 'JPEG', 80, 0, null).then((_response) => {
          console.log(_response);
          // response.uri is the URI of the new image that can now be displayed, uploaded...
          // response.path is the path of the new image
          // response.name is the name of the new image with the extension
          // response.size is the size of the new image
          let source = {uri: response.uri};
          // You can also display the image using data:
          // let source = { uri: 'data:image/jpeg;base64,' + response.data };
          let document = this.documents[group];
          if (!document) document = [];
          document.push({source, upload: 0, path: _response.path});
          this.documents[group] = document;
          this.processUpload();
          this.reload();
        }).catch((err) => {
          // Oops, something went wrong. Check that the filename is correct and
          // inspect err to get more details.
        });
      }
    });
  }

  async processUpload () {
    let token = await SessionManager.getToken();
    for (let i in this.documents) {
      let group = this.documents[i];
      for (let j in group) {
        let document = group[j];
        if (document.upload >= 0 && document.upload < 3) {
          this.setState({uploading: true});
          FileUploader.setHeaders({JSESSIONID: token});
          let params = {
            vehicleDocType: i,
          };

          let fileUpload = {
            name: 'file',
            filepath: document.path
          };
          FileUploader.upload(HttpClientHelper.API_URL.upload_service, params, fileUpload, (error, data) => {
            if (!error) {
              document.upload = -1;
              document.data = JSON.parse(data.data.result);
              console.log(document.data);
            } else {
              document.upload = document.upload + 1;
              console.log('Error: ', error);
            }
            this.setState({uploading: false});
            this.processUpload();
          });
          return;
        }
      }
    }
  }

  render () {
    let gc = [];
    for (let i in this.groups) {
      let group = this.groups[i];
      gc.push(<TextView key={'label_' + i} style={{marginTop: 10, fontSize: 13}}>{I18n.t(group)}</TextView>);
      let im = [];
      if (this.documents[group]) {
        for (let j in this.documents[group]) {
          im.push(
            <Image key={'image_' + group + j} source={this.documents[group][j]['source']}
                   style={{
                     height: 44,
                     borderRadius: 6,
                     width: 44,
                     resizeMode: 'cover',
                     borderColor: Themes.Colors.borderColor,
                     borderRadius: 6,
                     borderWidth: 1,
                     opacity: (this.documents[group][j]['upload'] < 0 ? 1 : 0.2)
                   }}/>
          );
        }
      }
      gc.push(
        <View key={'content_' + i} style={{flexDirection: 'row', alignItems: 'center'}}>
          {im}
          <Touchable style={{
            width: 44,
            height: 44,
            borderColor: Themes.Colors.borderColor,
            borderRadius: 6,
            borderWidth: 1,
            margin: 5,
            alignItems: 'center',
            justifyContent: 'center'
          }} onPress={() => {
            this.showPicker(group);
          }}>
            <Icon color={'#ccc'} name='add'/>
          </Touchable>
        </View>
      );
    }
    return (
      <ScrollView style={{flex: 1}}>
        <View style={{paddingBottom: 20}}>
          <Card containerStyle={{width: 340, padding: 15, alignSelf: 'center', marginTop: 20}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image source={Themes.Resource[this.props.icon]}
                     style={{width: 80, height: 80, resizeMode: 'contain'}}/>
              <View style={{alignItems: 'flex-start', marginLeft: 10, alignItems: 'center'}}>
                <TextView style={{color: Themes.Colors.background, fontSize: 16}}>
                  Vai trò
                </TextView>
                <TextView style={{color: Themes.Colors.background, fontWeight: 'bold', fontSize: 18}}>
                  Người thuê nhà
                </TextView>
              </View>
            </View>
            <TextView style={{fontWeight: 'bold', marginTop: 10}}>Đề nghị quý khách cung cấp giấy tờ</TextView>
            <View style={{height: 1, backgroundColor: '#ccc', marginTop: 4}}/>
            {gc}
          </Card>
          <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 15}}>
            <GradientButton textStyle={{fontSize: 16}} containerStyle={{width: 120}}
                            text={'Trở lại'} onPress={() => {
              Actions.pop();
            }}/>
            <GradientButton
              textStyle={{fontSize: 16}}
              containerStyle={{width: 120, marginLeft: 8}}
              text={'Tiếp'}
              onPress={() => {
                RegisterService.attachmentFiles = [];
                for (let i in this.documents) {
                  let group = this.documents[i];
                  for (let j in group) {
                    let document = group[j];
                    if (document.data) {
                      RegisterService.attachmentFiles.push(document.data);
                    }
                  }
                }
                this.props.setCurrentPage(1);
              }}/>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({});