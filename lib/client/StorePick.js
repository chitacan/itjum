import _ from 'lodash';
import Rx from 'rx';
import React, {Component} from 'react';
import Stock from './Stock';
import Maps from './Maps';
import Counter from './Counter';
import Loading from './Loading';

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
    this.updatedSubs.dispose();
    this.removedSubs.dispose();
  }

  _pickStore(name, label) {
    if (this.updatedSubs || this.removedSubs) {
      this.updatedSubs.dispose();
      this.removedSubs.dispose();
    }

    const {db} = this.context;
    this.setState({
      pickedStoreName: name, pickedStoreLabel: label, pickedStoreStock: {}
    });
    const changed$ = db.ref(`stock/${name}`).observe$('child_changed');
    const added$ = db.ref(`stock/${name}`).observe$('child_added');

    this.updatedSubs = Rx.Observable.merge(changed$, added$)
      .map(({snapshot}) => snapshot)
      .subscribe(snapshot => {
        const {pickedStoreStock} = this.state;
        _.forEach(pickedStoreStock, v => {
          v.highlighted = false;
        });
        const highlighted = Number(new Date());
        const val = _.assign(snapshot.val(), {highlighted});
        const updated = {[snapshot.key]: val};
        this.setState({
          pickedStoreStock: _.assign(pickedStoreStock, updated),
          loading: false
        });
      });
    this.removedSubs = db.ref(`stock/${name}`).observe$('child_removed')
      .map(({snapshot}) => snapshot)
      .subscribe(snapshot => {
        const {pickedStoreStock} = this.state;
        delete pickedStoreStock[snapshot.key];
        this.setState({pickedStoreStock, loading: false});
      });
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

  _loading() {
    const {loading} = this.state;
    if (loading) {
      return <Loading style={{marginTop: 20}} message="재고 가져오는 중" />;
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
