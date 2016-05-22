import chokidar from 'chokidar';
import debug from 'debug';
import path from 'path';
import Rx from 'rx';
import xlsx from 'xlsx';
import _ from 'lodash';
import glob from 'glob';
import sync from './sync';
import store from './configStore';

const GLOB_PATTERN = '*.{xlsx,xls}';

const d = debug('watcher');
const target = path.join(process.cwd(), GLOB_PATTERN);
const watcher = chokidar.watch(target);

const sheet2arr = sheet => {
  var result = [];
  var row;
  var rowNum;
  var colNum;
  var range = sheet['!range'];
  for (rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
    row = [];
    for (colNum = range.s.c; colNum <= range.e.c; colNum++) {
      var nextCell = sheet[
        xlsx.utils.encode_cell({r: rowNum, c: colNum})
      ];
      if (typeof nextCell === 'undefined') {
        row.push(null);
      } else {
        row.push(nextCell.w);
      }
    }
    result.push(row);
  }
  return result;
};

export default () => {
  const serviceAccount = store.get('serviceAccount');

  if (!serviceAccount) {
    console.error('cannot find service account info. run "itjum config <path>" first.');
    return process.exit(1);
  }

  d(`target: ${target}`);
  d(`match: ${glob.sync(GLOB_PATTERN)}`);
  Rx.Observable.fromEvent(watcher, 'change')
    .map(path => {
      d(`changed: ${path}`);
      return xlsx.readFile(path);
    })
    .map(workbook => {
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const array = sheet2arr(sheet);
      const header = _.head(array);
      const rows = _.chain(array)
        .slice(1)
        .filter(row => !_.every(row, r => r === null))
        .map(row => _.zipObject(header, row))
        .map(row => _.omit(row, 'null'))
        .keyBy('품목')
        .omit('null')
        .value();
      return {name: sheetName, rows};
    })
    .tap(r => d(r))
    .concatMap(stock => sync(stock))
    .subscribe(() => {
      d(`sync ok - ${new Date()}`);
    }, err => {
      d(err);
      process.exit(1);
    });
};
