/* eslint-disable */
let packages = require('../../../__test__/models/packages');
if (!global.repository) global.repository = { get: packages, set: () => {}, search: (query) => (packages.filter(p => (p.name === query)))};
export default repository;
/* eslint-disable */
