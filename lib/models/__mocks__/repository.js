/* eslint-disable */
let packages = require('../../../__test__/models/packages');
let counter = 0;
if (!global.repository) global.repository = {
  get: packages,
  get count() { return counter; },
  packages: packages.reduce((hash, item) => { hash[item.name] = item; return hash}, {}),
  resetCounter: () => {counter = 0;},
  set: (item) => {++counter;},
  search: (query) => (packages.filter(p => (p.name === query)))
};
export default repository;
/* eslint-disable */
