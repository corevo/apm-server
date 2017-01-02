class Repository {
  constructor (repo) {
    this.get = [];
  }
  set (packageItem) {
  }
  search (query) {
  }
}

global.repository = new Repository(process.env.NPM_REPOSITORY);
export default repository;
