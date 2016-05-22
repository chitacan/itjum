import _ from 'lodash';
import React, {Component} from 'react';
import Stock from './Stock';
import Maps from './Maps';
import Counter from './Counter';
import {Row, Col, Alert} from 'react-bootstrap';

class StorePick extends Component {

  constructor(props) {
    super(props);
    this.state = {
      stores: null,
      pickedStoreStock: null,
      pickedStoreName: null,
      pickedStoreLabel: null,
      loading: false
    };
  }

  componentDidMount() {
    const {db} = this.context;
    this.setState({loading: true});
    this.storesSubs = db.ref('stores').observe$('value')
      .map(snapshot => snapshot.val())
      .subscribe(stores => {
        const {pickedStoreName} = this.state;
        this.setState({stores});
        if (pickedStoreName === null) {
          const name = _.chain(stores).keys().first().value();
          this._pickStore(name, 'A');
        }
      });
  }

  componentWillUnmount() {
    this.storesSubs.dispose();
    this.stockSubs.dispose();
    this.stockUpdateSubs.dispose();
  }

  _pickedStore() {
    const {
      pickedStoreName, pickedStoreStock, pickedStoreLabel, stores
    } = this.state;
    if (pickedStoreName) {
      return (
        <Stock name={pickedStoreName}
          store={stores[pickedStoreName]}
          stock={pickedStoreStock}
          label={pickedStoreLabel}/>
      );
    }
  }

  _pickStore(name, label) {
    if (this.stockSubs || this.stockUpdateSubs) {
      this.stockSubs.dispose();
      this.stockUpdateSubs.dispose();
    }

    const {db} = this.context;
    this.setState({pickedStoreName: name, pickedStoreLabel: label});
    this.stockSubs = db.ref(`stock/${name}`).observe$('value')
      .take(1)
      .map(snapshot => snapshot.val())
      .subscribe(stock => {
        console.log(stock);
        this.setState({pickedStoreStock: stock, loading: false});
      }, err => {
        console.error(err);
        this.setState({pickedStoreStock: null, loading: false});
      });
    this.stockUpdateSubs = db.ref(`stock/${name}`).observe$('child_changed')
      .map(({snapshot}) => snapshot)
      .subscribe(snapshot => {
        const {pickedStoreStock} = this.state;
        const highlighted = Number(new Date());
        const val = _.assign(snapshot.val(), {highlighted});
        const updated = {[snapshot.key]: val};
        this.setState({pickedStoreStock: _.assign(pickedStoreStock, updated)});
      }, err => {
        console.error(err);
      });
  }

  _loading() {
    const {loading} = this.state;
    if (loading) {
      return (
        <Row>
          <Col xs={10} sm={8} md={8} xsOffset={1} smOffset={2} mdOffset={2}>
            <br/>
            <Alert bsStyle="warning">로딩 중...</Alert>
          </Col>
        </Row>
      );
    }
  }

  render() {
    const {stores} = this.state;
    return (
      <div>
        <Counter />
        <Maps stores={stores} pick={this._pickStore.bind(this)}/>
        {this._loading()}
        <br/>
        {this._pickedStore()}
      </div>
    );
  }
}

StorePick.displayName = 'StorePick';
StorePick.contextTypes = {
  db: React.PropTypes.object
};

export default StorePick;
