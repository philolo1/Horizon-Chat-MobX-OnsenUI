import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import DevTools from 'mobx-react-devtools';
import ons from 'onsenui';
import {Modal, Page, List, ListItem, Button, Row, Col, Navigator, Toolbar, Input} from 'react-onsenui';
import _ from 'lodash';
import Page2 from './Page2.jsx';

const UserInput = observer(({appState}) => {
  return (
    <div>
      <Input
        modifier='underbar'
        style={{width: '100%'}}
        onChange={(e) => appState.userName = e.target.value}
        value={appState.userName}
        placeholder='Name'
        float
      />
    </div>
  );
});

const RoomInput = observer(({appState}) => {
  return (
    <div style={{paddingTop: 10, paddingBottom: 10}}>
      <Input
        modifier='underbar'
        fload
        style={{width: '100%'}}
        placeholder='Room'
        onChange={(e) => appState.roomName = e.target.value}
        value={appState.roomName}
      />
    </div>
  );
});


@observer
class Page1 extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  componentDidMount() {
    console.log('component mountes');
    this.chatRooms = this.props.appState.horizon('chatRooms');
  }

  renderModal = () => {
    console.log('render modal');
    return (
      <Modal isOpen={this.state.loading}>
        <div>
          <ons-icon icon='ion-load-c' spin='true'></ons-icon> <br /> <br />
          <span>Loading ...</span>
        </div>
      </Modal>
    )
  }

  renderToolbar = () => {
    return (
      <Toolbar>
        <div className='center'> Chat App </div>
      </Toolbar>
    );
  }

  render() {
    return (
      <Page
        renderModal={this.renderModal}
        renderToolbar={this.renderToolbar}
      >
        <div style={{padding: 60}}>
          <UserInput appState={this.props.appState} />
          <RoomInput appState={this.props.appState} />
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <Button onClick={this.joinRoom} modifier='large' style={styles.loginButton}> Join </Button>
          </div>
          <DevTools />
        </div>
      </Page>
    );
  }

  joinRoom = () => {
    var {userName, roomName} = this.props.appState;

    if (!(userName != null && userName.length > 0)) {
      ons.notification.alert('Please fill in a userName');
      return;
    }

    if (!(roomName != null && roomName.length > 0)) {
      ons.notification.alert('Please fill in a roomName');
      return;
    }


    /* this.chatRooms
      .watch().subscribe(
        (arr) => {
          arr = _.sortBy(arr, (el) => el.name.toLowerCase());
          this.props.appState.setChatRoom(arr);
          });
          */

    this.setState({loading: true});

    this.chatRooms.find({name: roomName}).fetch().defaultIfEmpty().subscribe(room => {
      if (room == null) {
        console.log('room does not exist');
        var el = this.chatRooms.store({
          name: roomName
        }).subscribe((el) => {
          this.props.navigator.pushPage({
            component: Page2,
            props: {
              appState: this.props.appState,
              title: roomName,
              roomID: el.id,
              author: userName
            }
          });
        });


      } else {
        console.log(room);

        this.props.navigator.pushPage({
          component: Page2,
          props: {
            appState: this.props.appState,
            title: roomName,
            roomID: room.id,
            author: userName
          }
        });
      }
    });
  }

  onReset = () => {
    this.props.appState.resetTimer();
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.renderPage = this.renderPage.bind(this);
  }
  renderPage(route, navigator) {
    const props = route.props || {};
    props.navigator = navigator;
    console.log('render');
    return React.createElement(route.component, route.props);
  }

  render() {
    return (
      <Navigator
        initialRoute={{component: Page1, props: {
          appState: this.props.appState
        }}}
        renderPage={this.renderPage}
      />
    );
  }
}

const styles = {
  loginButton: {
    width: '100px',
    height: 30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 15,
    marginTop: 10
  }
};

export default App;
