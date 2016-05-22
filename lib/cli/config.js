import fs from 'fs';
import path from 'path';
import debug from 'debug';
import store from './configStore';

const d = debug('config');

export default _path => {
  try {
    const target = path.normalize(path.join(process.cwd(), _path));
    const content = JSON.parse(fs.readFileSync(target));
    store.set('serviceAccount', content);
    d('OK');
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
};
