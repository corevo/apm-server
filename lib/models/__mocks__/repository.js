/* eslint-disable */
let packages = require('../../../__test__/models/packages');
if (!global.repository) global.repository = {
  get: packages,
  packages: packages.reduce((hash, item) => { hash[item.name] = item; return hash}, {}),
  set: () => {},
  search: (query) => (packages.filter(p => (p.name === query)))
};
export default repository;
/* eslint-disable */
