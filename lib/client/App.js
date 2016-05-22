import React, {Component} from 'react';
import Toolbar from './Toolbar';
import firebase from '../firebaseExtended';
import Loading from './Loading';
import {Row, Col, Alert} from 'react-bootstrap';

class App extends Component {

  constructor(props) {
    super(props);
    firebase.initializeApp({
      apiKey: "AIzaSyA6yRKAmPxsW-KG-E5Mt9gwJrfJyMysYP4",
      authDomain: "project-9057366841059851375.firebaseapp.com",
      databaseURL: "https://project-9057366841059851375.firebaseio.com",
      storageBucket: "project-9057366841059851375.appspot.com"
    });
    this.db = firebase.database();
    this.state = {
      loading: false,
      user: null
    };
  }

  componentDidMount() {
    const auth = firebase.auth();
    this.setState({loading: true});
    auth.onAuthStateChanged$()
      .subscribe(user => {
        if (user === null) {
          return auth.signInAnonymously();
        }
        this.setState({loading: false, user});
        this._online();
      }, err => {
        console.error(err);
        this.setState({loading: false, user: null});
      });
  }

  getChildContext() {
    return {db: this.db};
  }

  _online() {
    const {user} = this.state;
    this.db.ref('online-users').child(user.uid).set(true);
    this.db.ref('online-users').child(user.uid).onDisconnect().set(null);
  }

  _children() {
    const {children} = this.props;
    const {user, loading} = this.state;
    if (loading) {
      return <Loading style={{marginTop: 20}}/>;
    }
    if (user === null) {
      return (
        <Row>
          <Col xs={10} sm={8} md={8} xsOffset={1} smOffset={2} mdOffset={2}>
            <Alert bsStyle="danger">로그인 중 오류 발생.</Alert>
          </Col>
        </Row>
      );
    }
    return children;
  }

  render() {
    return (
      <div>
        <Toolbar/>
        <div className="container">
        {this._children()}
        </div>
        <br/>
      </div>
    );
  }
}

App.displayName = 'App';
App.contextTypes = {
  router: React.PropTypes.object
};
App.childContextTypes = {
  db: React.PropTypes.object
};

export default App;
