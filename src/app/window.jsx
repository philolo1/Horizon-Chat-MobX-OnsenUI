import React from 'react';
import {render} from 'react-dom';
import ReactDOMServer from 'react-dom/server';

global.navigator = {
  userAgent: 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36'
}

import ons from 'onsenui';
import {Modal, Page, Col, Row, BottomToolbar, List, ListItem, Button, Navigator, Toolbar, Input} from 'react-onsenui';


console.log(
  ReactDOMServer.renderToString(
    <Page>
      lala
    </Page>
  )
);
