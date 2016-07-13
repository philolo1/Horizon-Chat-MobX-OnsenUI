import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import DevTools from 'mobx-react-devtools';
import ons from 'onsenui';
import {Modal, BackButton, Icon, Page, List, BottomToolbar, ListItem, Button, Row, Col, Navigator, Toolbar, Input} from 'react-onsenui';
import _ from 'lodash';

const Message = observer(({data, author}) => {

  let messageStyle = {
    padding: 10,
    borderColor: '#9E9E9E',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: 'white',
    color: '#535050'
  };

  let authorElement;

  if (author === data.author) {
    authorElement = (
      <div
        style={{fontSize: 24 * 0.6, paddingLeft: 10, paddingBottom: 5, color: '#928585'}}
      >
        {data.author}
      </div>
    );

    return (
      <div style={{paddingTop: 10, paddingLeft: 14}}>
        {data.showAuthor ? authorElement : null}
        <div style={{display: 'flex'}}>
          <div style={messageStyle}> {data.message} </div>
          <div style={{flex: 1, minWidth: '20%'}} />
        </div>
      </div>
    );
  }

  messageStyle = {
    padding: 10,
    borderColor: '#9E9E9E',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: 'white',
    color: '#535050'
  };


  authorElement = (
    <div
      style={{fontSize: 24 * 0.6, textAlign: 'right', paddingBottom: 5, paddingRight: 10, color: '#928585'}}
    >
      {data.author}
    </div>
  );

  return (
    <div style={{paddingTop: 10, paddingRight: 14}}>
      {data.showAuthor ? authorElement : null}
      <div style={{display: 'flex'}}>
        <div style={{flex: 1, minWidth: '20%'}} />
        <div style={messageStyle}> {data.message} </div>
      </div>
    </div>
  );
});

const MessageBar = observer(({pageState, sendText}) => {

  return (
    <BottomToolbar>
      <div style={{display: 'flex',
        height: '100%',
        alignItems: 'center'}}>
        <Input placeholder='Type Message'

          onKeyPress={(event) => {
            var code = event.keyCode || event.which;
            if (code === 13) {
              sendText();
            }
          }}
          onChange={({target}) => pageState.setText(target.value)}
          value={pageState.text}
          style={{
            paddingLeft: 15,
            flex: 1
          }}
        />
        <span
          style={{paddingLeft: 10, paddingRight: 15,
            color: '#616161',
            fontWeight: pageState.text.length > 0 ? 'bold' : 'normal'
          }}
          onClick={sendText}
        >Send</span>
      </div>
    </BottomToolbar>
  );
});

const NewMessage = observer(({show, onClick}) => {


  if (show) {
    return (
      <div onClick={onClick} style={{height: 40, position: 'fixed', bottom: 44, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'lightgrey', color: '#616161'}}> new messages </div>
    );
  }

  return <div />;
});

@observer
export default class Page2 extends Component {

  componentDidUpdate() {
    console.log('mount', this.props.appState.lastAuthor);
    if (this.props.appState.lastAuthor === this.props.author) {
      this.scrollBottom();
    }
  }

  scrollBottom = () => {
    const page = document.getElementById('page2').querySelector('.page__content');
    page.scrollTop = page.scrollHeight;
  }

  constructor(props) {
    super(props);
    this.initial = true;
    this.state = {
      typedText: '',
      messages: []
    };
  }

  get pageState() {
    console.log('props', this.props);
    return this.props.pageState;
  }

  componentDidMount() {
    this.messages = this.props.appState.horizon('messages');

    this.messages.findAll({roomID: this.props.roomID}).order('date').watch().subscribe((data) => {
      if (data) {
        const newData = _.sortBy(data, (el) => el.date);
        this.props.appState.setMessages(newData);
        if (this.initial) {
          this.initial = false;
          this.scrollBottom();
        } else if (this.props.appState.lastAuthor !== this.props.author) {
          this.props.appState.showMessageNotification();
        }
      }
    });
  }

  sendText = () => {
    if (this.pageState.text.length === 0) {
      return;
    }
    this.messages.store({
      author: this.props.author,
      date: new Date(),
      message: this.pageState.text,
      roomID: this.props.roomID
    });

    this.pageState.resetText();
  }

  render() {
    return (
      <Page
        id='page2'
        renderBottomToolbar={() =>
          <MessageBar
            sendText={this.sendText}
            appState={this.props.appState}
            pageState={this.pageState}
          />
        }
        renderToolbar={() =>
          <Toolbar>
            <div className='left'><BackButton>Back</BackButton></div>
            <div className='center'> {this.props.title} </div>
          </Toolbar>
        }
      >
        {this.props.appState.messageList.map((data) => {
          return (
            <Message data={data} author={this.props.author} />
          );
        })}

        <div style={{height: 15}} />

        <NewMessage
          onClick={() => { this.scrollBottom(); this.props.appState.hideMessageNotification(); }}
          show={this.props.appState.newMessage}
        />

      </Page>
    );
  }
}

