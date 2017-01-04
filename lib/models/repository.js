import Package from './package';

class Repository {
  constructor (repo) {
    this._packages = {};
    this._cacheUpdated = true;
    this._cache = [];
  }
  get packages() {
    return this._packages;
  }
  get get() {
    if (!this._cacheUpdated) { this._cache = Object.keys(this._packages).map(key => (this._packages[key])); }
    return this._cache;
  }
  set (packageItem) {
    if (packageItem instanceof Package) {
      this._cacheUpdated = false;
      this._packages[packageItem.name] = packageItem;
    } else {
      throw new Error(`The given ${typeof packageItem} is not ${Package.name}`);
    }
  }
  search (query) {
  }
}

if (!global.repository) {
  global.repository = new Repository(process.env.NPM_REPOSITORY);
}

export default repository;
