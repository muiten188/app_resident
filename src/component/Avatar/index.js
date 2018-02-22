import React from 'react';
import { View, Image, Text } from 'react-native';
import User from '../../models/User';
import Touchable from '../Touchable/index';
import SessionManager from '../../libs/SessionManager';
import ImagePicker from 'react-native-image-picker';
import { Icon } from 'react-native-elements';
import Themes from '../../themes/index';
import MessageHandler from '../../libs/MessageHandler';
import ImageResizer from 'react-native-image-resizer';

var {FileUploader} = require('react-native-file-uploader');
import HttpClientHelper from '../../libs/HttpClientHelper';

class Avatar extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      reload: false
    };
    this.reload = this.reload.bind(this);
  }

  reload () {
    this.setState({
      reload: !this.state.reload
    });
  }

  componentDidMount () {
    MessageHandler.register('update_avatar', this.reload);
  }

  componentWillUnmount () {
    MessageHandler.remove('update_avatar', this.reload);
  }

  showPicker () {
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
          // You can also display the image using data:
          // let source = { uri: 'data:image/jpeg;base64,' + response.data };
          this.processUpload(_response.path);
        }).catch((err) => {
          // Oops, something went wrong. Check that the filename is correct and
          // inspect err to get more details.
        });
      }
    });
  }

  async processUpload (path) {
    let token = await SessionManager.getToken();

    FileUploader.setHeaders({JSESSIONID: token});
    let params = {};

    let fileUpload = {
      name: 'file',
      filepath: path
    };
    FileUploader.upload(HttpClientHelper.API_URL.upload, params, fileUpload, (error, data) => {
      if (!error) {
        try {
          let res = JSON.parse(data.data.result);
          let params = {
            avatar: res.path
          };
          // alert(res.path);
          HttpClientHelper.post('resident', params, (_err, _res) => {
            if (!_err) {
              User.avatar = res.path;
              SessionManager.saveUserInfo(User);
              MessageHandler.notify('update_avatar');
              this.reload();
            }
          });
        } catch (e) {
          console.log(e);
        }
      }
    });
    return;
  }

  render () {
    let avatar = null;
    try {
      avatar = User.getAvatar(this.props.size);
    } catch (e) {
      console.warn(e);
    }
    return (
      <Touchable
        activeOpacity={this.props.canEdit ? 0.7 : 1}
        style={{
          width: this.props.size,
          height: this.props.size,
          padding: 4,
          borderRadius: parseInt(this.props.size / 2),
          backgroundColor: 'rgba(10, 111, 194, 0.6)',
          ...this.props.style
        }} onPress={() => {
        if (this.props.canEdit)
          this.showPicker();
      }}>
        <Image source={{uri: avatar}} style={{
          width: this.props.size - 8,
          height: this.props.size - 8,
          borderRadius: parseInt((this.props.size - 8) / 2),
          resizeMode: 'cover',
        }}/>
      </Touchable>
    );
  }
}

export default Avatar;