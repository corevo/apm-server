import lunr from 'lunr';
import Package from './package';

class Repository {
  constructor (repo) {
    this._packages = {};
    this._cacheUpdated = true;
    this._cache = [];
    this._index = lunr(function () {
      this.field('name', { boost: 30 });
      this.field('description', { boost: 10 });
      this.field('readme');
    });
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
      this.index(packageItem);
      this._packages[packageItem.name] = packageItem;
    } else {
      throw new Error(`The given ${typeof packageItem} is not ${Package.name}`);
    }
  }
  search (query) {
    return this._index.search(query);
  }
  index (packageItem) {
    this._index.add({
      id: packageItem.name,
      name: packageItem.name,
      description: packageItem.metadata.description,
      readme: packageItem.readme
    });
  }
}

if (!global.repository) {
  global.repository = new Repository(process.env.NPM_REPOSITORY);
}

export default repository;
