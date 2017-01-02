class Repository {
  constructor (repo) {
    this.packages = {};
  }
  get get() {
    return Object.keys(this.packages).map(key => (this.packages[key]));
  }
  set (packageItem) {
  }
  search (query) {
  }
}

global.repository = new Repository(process.env.NPM_REPOSITORY);
export default repository;
