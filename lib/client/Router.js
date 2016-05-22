import React from 'react';
import {Router, Route, browserHistory, IndexRedirect} from 'react-router';

import App from './App';
import Stores from './Stores';
import StorePick from './StorePick';
import Info from './Info';

const router = (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="/info" component={Info} />
      <Route path="/stores" component={Stores} />
      <Route path="/pick" component={StorePick} />
      <IndexRedirect to="pick" />
    </Route>
  </Router>
);

export default router;
