let packages = require('../../../__test__/models/packages');
global.repository = { get: packages, set: () => {}, search: (query) => (packages.filter(p => (p.name === query)))};
export default repository;
