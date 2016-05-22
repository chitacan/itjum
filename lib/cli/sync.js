import Rx from 'rx';
import store from './configStore';
import fb from './fb';

export default ({name, rows}) => {
  const serviceAccount = store.get('serviceAccount');

  if (!serviceAccount) {
    const err = new Error('cannot find service account info. run "itjum config <path> first."');
    return Rx.Observable.throw(err);
  }

  const firebase = fb(serviceAccount);
  const db = firebase.database();

  const stock$ = db.ref(`stock/${name}`).set$(rows);
  const store$ = db.ref(`stores/${name}/updated`).set$(Number(new Date()));
  return Rx.Observable.combineLatest(stock$, store$);
};
