import {observable} from 'mobx';

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
  @observable userName;
  @observable roomName;
  @observable chatRooms = [];
  @observable loading = false;
  @observable messages = [];


  constructor(horizon) {
    this.horizon = horizon;
    this.chatRooms = [];
  }

  setMessages(data) {
    this.messages = data;
  }

  setChatRoom(data) {
    this.chatRooms = data.map((el) => new ChatRoom(el));
  }

  resetTimer() {
    this.timer = 0;
  }
}

export default AppState;
