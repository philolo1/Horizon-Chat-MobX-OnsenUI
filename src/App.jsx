import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import DevTools from 'mobx-react-devtools';
import ons from 'onsenui';
import {Page, Button, Row, Col} from 'react-onsenui';
import _ from 'lodash';

const UserInput = observer(({user}) => {
  return (
    <div> Name :
      <input
        onChange={(e) => user.name = e.target.value}
        value={user.name}
      />
    </div>
  );
});


const UserName = observer(({user}) => {
  return (
    <div> Name : {user.name} </div>
  );
});

const ChatRoom = ({name}) => {
  return (
    <div style={{
      border: '1px solid #ccc',
      height: 50,
      display: 'flex',
      paddingLeft: 10,
      alignItems: 'center'
    }}>
        {name}
    </div>
  );
};

const ChatRooms = ({chatRooms, addRoomClick}) => {
  return (
    <div>
      <h3> Rooms: <button onClick={addRoomClick}> Add Room </button> </h3>
      {chatRooms.map((el) => <ChatRoom name={el.name} />)}
    </div>
  );
};


@observer
class App extends Component {
  componentDidMount() {
    console.log('component mountes');
    this.chatRooms = this.props.appState.horizon('chatRooms');
    this.addRoomClick = this.addRoomClick.bind(this);

    this.chatRooms
      .watch().subscribe(
        (arr) => {
          arr = _.sortBy(arr, (el) => el.name.toLowerCase());
          this.props.appState.setChatRoom(arr);
        });
  }

  addRoomClick() {
    ons.notification.prompt({
      message: 'Which room would you like to add?',
      callback: (room) => {
        this.chatRooms.insert({
          name: room
        });

      }});
  }

  render() {
    return (
      <Page>
        <h1> Chat App </h1>
        <UserInput user={this.props.appState.user} />
        <UserName user={this.props.appState.user} />
        <ChatRooms
          chatRooms={this.props.appState.chatRooms}
          addRoomClick={this.addRoomClick}
        />
        <DevTools />
      </Page>
    );
  }

  onReset = () => {
    this.props.appState.resetTimer();
  }
}

export default App;
