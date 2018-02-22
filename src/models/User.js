import { SessionManager, HttpClientHelper } from '../libs';

var User = {
  username: '',
  fullName: '',
  jSessionId: '',
  residentType: 'OWNER',
  ressidentId: '',
  currentApartmentId: '',
  currentApartmentCode: '',
  phoneNumber: '',
  identification: '',
  birthDay: '',
  accountType: '',
  avatar: '',
  email: 'chưa cập nhật',
  subPhoneNumber: '',
  listApartment: [],
  gender: '',
  topics: [],
  getAvatar: (max_size = 150) => {
    let isLogged = SessionManager.isLoggedIn();
    let avatar = 'https://ui-avatars.com/api/?size=400&background=fff&color=000&name=Guest';
    if (isLogged) {
      avatar = 'https://ui-avatars.com/api/?size=400&background=fff&color=000&name=' + User.username;
      if (User.fullName != '') {
        avatar = 'https://ui-avatars.com/api/?size=400&background=fff&color=000&name=' + User.fullName;
      }
      if (User.avatar != undefined && User.avatar != null && User.avatar != '' && User.avatar != 'null') {
        return HttpClientHelper.IMAGE_URL + '/' + User.avatar;
      }
    }
    return avatar;
  }
};
export default User;