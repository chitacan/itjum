import _ from 'lodash';
import m from 'moment';
import React, {Component} from 'react';
import {Row, Col, Table} from 'react-bootstrap';

class Stores extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      stores: null
    };
  }

  componentDidMount() {
    const {db} = this.context;
    this.setState({loading: true});
    this.subs = db.ref('stores').observe$('value')
      .map(snapshot => snapshot.val())
      .subscribe(stores => {
        console.log(stores);
        this.setState({loading: false, stores});
      }, err => {
        console.error(err);
        this.setState({loading: false, stores: null});
      });
  }

  componentWillUnmount() {
    this.subs.dispose();
  }

  _stores() {
    const {loading, stores} = this.state;
    if (loading) {
      return 'loading...';
    }
    if (stores === null) {
      return 'error';
    }
    return (
      <Table striped bordered condensed hover responsive>
        <thead>
          <tr>
            <th>점포명</th>
            <th>업데이트</th>
            <th>위도</th>
            <th>경도</th>
          </tr>
        </thead>
        <tbody>
        {
          _.map(stores, (store, k) => {
            const updated = store.updated ?
              m(store.updated).format('YYYY. M. D, h:mm:ss a') :
              'N/A';
            return (
              <tr key={k}>
                <td>{k}</td>
                <td>{updated}</td>
                <td>{store.lat}</td>
                <td>{store.lon}</td>
              </tr>
            );
          })
        }
        </tbody>
      </Table>
    );
  }

  render() {
    return (
      <Row>
        <Col className="card"
          xs={10} sm={8} md={8} xsOffset={1} smOffset={2} mdOffset={2}>
          <h4>점포목록</h4>
          {this._stores()}
        </Col>
      </Row>
    );
  }
}

Stores.displayName = 'Stores';
Stores.contextTypes = {
  db: React.PropTypes.object
};

export default Stores;
