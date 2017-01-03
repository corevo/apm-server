import Package from './package';

class Repository {
  constructor (repo) {
    this.packages = {};
  }
  get get() {
    return Object.keys(this.packages).map(key => (this.packages[key]));
  }
  set (packageItem) {
    if (packageItem instanceof Package) {
      this.packages[packageItem.name] = packageItem;
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
