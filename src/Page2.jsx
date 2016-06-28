import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import DevTools from 'mobx-react-devtools';
import ons from 'onsenui';
import {Modal, Page, List, ListItem, Button, Row, Col, Navigator, Toolbar, Input} from 'react-onsenui';
import _ from 'lodash';

const Message = observer(({data}) => {
  return (
    <Row style={{paddingTop: 10}}>
      <Col width='25%' style={{paddingRight: 10}}>
        {data.author}:
      </Col>
      <Col>
        {data.message}
      </Col>
    </Row>
  );
});


@observer
export default class Page2 extends Component {

  constructor(props) {
    super(props);
    this.state = {
      typedText: '',
      messages: []
    };
  }

  componentDidMount() {
    this.messages = this.props.appState.horizon('messages');

    this.messages.findAll({roomID: this.props.roomID}).watch().subscribe((data) => {
      if (data) {
        this.setState({
          messages: data
        });
      }
    });

    // scroll at bottom
    window.mesageList.scrollTop = window.mesageList.scrollHeight
  }

  renderRow = (row, idx) => {
    return (
      <ListItem >
        <Message data={row} />
      </ListItem>
    );
  };

  typeText = () => {
    this.messages.store({
      author: this.props.author,
      date: new Date(),
      message: this.state.typedText,
      roomID: this.props.roomID
    });
  }

  render() {
    return (
      <Page renderToolbar={() => <Toolbar> <div className='center'> {this.props.title} </div> </Toolbar>}>
        <List id='mesageList' style={{overflow: 'scroll', height: '80%'}} dataSource={this.state.messages}
          renderRow={this.renderRow}
        />
        <Input
          placeholder='Type something'
          onChange={(event) => this.setState({typedText: event.target.value})}
          value={this.state.typedText}
          style={{backgroundColor: 'white', width: '100%'}}
        />
        <Button onClick={this.typeText}> Add Text </Button>
      </Page>
    );
  }
}

