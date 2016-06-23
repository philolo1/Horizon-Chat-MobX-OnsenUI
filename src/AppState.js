import {observable} from 'mobx';

class User {
  @observable name = 'patrick';
}


class ChatRoom {
  @observable name;
  id;

  constructor(data) {
    this.name = data.name;
    this.id = data.id;
  }
}

class AppState {
  @observable timer = 0;
  horizon;
  user = new User();
  @observable chatRooms = [];

  constructor(horizon) {
    this.horizon = horizon;
    this.chatRooms = [];
  }

  setChatRoom(data) {
    this.chatRooms = data.map((el) => new ChatRoom(el));
  }

  resetTimer() {
    this.timer = 0;
  }
}

export default AppState;
