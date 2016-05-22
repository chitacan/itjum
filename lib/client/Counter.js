import _ from 'lodash';
import React, {Component} from 'react';
import {Row, Col} from 'react-bootstrap';

class Counter extends Component {

  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  componentDidMount() {
    const {db} = this.context;
    this.subs = db.ref('online-users').observe$('value')
      .map(snapshot => snapshot.val())
      .subscribe(users => {
        this.setState({count: _.keys(users).length});
      });
  }

  componentWillUmount() {
    this.subs.dispose();
  }

  render() {
    const {count} = this.state;
    return (
      <Row>
        <Col xs={10} sm={8} md={8} xsOffset={1} smOffset={2} mdOffset={2}>
          <div className="clearfix">
            <div className="pull-right" style={{marginBottom: 10}}>
              <span style={{color: '#aaa'}}>
                접속 : {count} 명
              </span>
            </div>
          </div>
        </Col>
      </Row>
    );
  }
}

Counter.displayName = 'Counter';
Counter.contextTypes = {
  db: React.PropTypes.object
};

export default Counter;
