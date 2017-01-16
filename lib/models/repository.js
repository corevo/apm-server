import lunr from 'lunr';
import Package from './package';

class Repository {
  constructor () {
    this._packages = {};
    this._cacheUpdated = true;
    this._cache = [];
    /* eslint-disable */
    this._index = lunr(function () {
      this.field('name', { boost: 30 });
      this.field('description', { boost: 10 });
      this.field('readme');
    });
    /* eslint-disable */
    this.set = this.set.bind(this);
    this.search = this.search.bind(this);
    this.index = this.index.bind(this);
  }
  get packages() {
    return this._packages;
  }
  get get() {
    if (!this._cacheUpdated) {
      this._cache = Object.keys(this._packages).map(key => (this._packages[key]));
    }
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
    return this._index.search(query).map(r => this._packages[r.ref]);
  }
  index (packageItem) {
    this._index.add({
      description: packageItem.metadata.description,
      id: packageItem.name,
      name: packageItem.name,
      readme: packageItem.readme
    });
  }
}

if (!global.repository) {
  global.repository = new Repository(process.env.NPM_REPOSITORY);
}

export default global.repository;
