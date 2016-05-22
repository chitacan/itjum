import program from 'commander';
import pkg from '../../package';
import debug from 'debug';

import watcher from './watcher';
import init from './init';
import config from './config';

const d = debug('commander');

program.version(pkg.version);

program
  .command('init')
  .description('initialize itjum firebase database.')
  .action(() => {
    d('init');
    init();
  });

program
  .command('config <path>')
  .description('save config to configstore')
  .action(path => {
    d('config', path);
    config(path);
  });

program.parse(process.argv);

// start watching files.
if (process.argv.length === 2) {
  d('watcher');
  watcher();
}
