import Rx from 'rx';
import fb from './fb';
import stores from './stores';
import stock from './stock';
import debug from 'debug';
import store from './configStore';

const d = debug('init');

export default () => {
  const serviceAccount = store.get('serviceAccount');

  if (!serviceAccount) {
    console.error('cannot find service account info. run "itjum config <path>" first.');
    return process.exit(1);
  }

  const firebase = fb(serviceAccount);
  const db = firebase.database();
  const stores$ = db.ref('stores').set$(stores);
  const stock$ = db.ref('stock').set$(stock);

  d('updating...');
  Rx.Observable.combineLatest(stores$, stock$)
    .subscribe(() => {
      d('OK');
      process.exit();
    }, err => {
      d(err);
    });
};
