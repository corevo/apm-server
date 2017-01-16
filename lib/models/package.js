import semver from 'semver';
import _ from 'lodash';
import Repository from './repository';

const repo = process.env.NPM_REGISTRY;
let featured = process.env.FEATURED ? process.env.FEATURED.split(',') : [];

export default class Package {
  constructor (packageItem) {
    Object.assign(this, packageItem);
  }
  filter (engine) {
    const version = verifySemver(engine);
    let filtered = new Package(this);
    Object.assign(filtered, {versions: {}});
    filtered.versions = _.pickBy(this.versions, (packageVersion) => {
      return semver.satisfies(version, packageVersion.engines.atom);
    });
    return filtered;
  }
  compatible (engine) {
    const version = verifySemver(engine);
    return Boolean(_.findKey(this.versions, (key) => {
      return semver.satisfies(version, key.engines.atom);
    }));
  }
  static find () { // eslint-disable-line max-statements
    let arg = 0;
    const query = typeof arguments[arg] === 'string' ? arguments[arg] : undefined;
    if (query) arg++;
    const options = arguments[arg] ? arguments[arg] : {};

    let results = undefined;
    if (query) { // eslint-ignore-line
      results = Repository.search(query);
    } else {
      results = Repository.get;
    }
    results = options.offset ? results.slice(options.offset, results.length) : results;
    results = options.limit ? results.slice(0, options.limit) : results;

    return results;
  }
  static findOne (name) {
    return PackageService(repo, name).then(item => {
      Repository.set(item);
      return item;
    });
  }
  static get count () {
    return Repository.get.length;
  }
  static get featured () {
    return featured.filter(_.identity).map(f => Repository.packages[f]);
  }
  static set featured (value) {
    featured = value;
  }
}

function verifySemver (version) {
  const validated = semver.valid(version);
  if (!validated) {
    throw new Error(`Invalid semver ${version}`);
  }
  return validated;
}

export function PackageService(registry, name) {
  return fetch(`${registry}/${name}`).then((res) => {
    if (!res.ok) {
      return Promise.reject({
        code: res.status,
        message: res.statusText
      });
    } else {
      return res.json().then(parsePackage).then(item => (
        new Package(item)
      ));
    }
  });
}

export function InitializeRepository() {
  return fetch(`${repo}/-/all`).then((res) => {
    if (!res.ok) {
      return Promise.reject({ message: `Failed to parse packages, repository is empty` });
    } else {
      return res.json().then((data) => {
        const filtered = _.pickBy(data, _.isObject);
        const packagesList = Object.keys(filtered).map(name => filtered[name]);

        packagesList.map((item) => (new Package(item))).forEach(Repository.set);
        return Promise.resolve(true);
      });
    }
  });
}

function parsePackage(x) { // eslint-disable-line max-statements
  x["releases"] = x["dist-tags"];
  delete x["dist-tags"];
  x["downloads"] = 0;
  x["stargazers_count"] = 0;

  const latest = x.releases.latest;
  x["metadata"] = {
    dependencies: x.versions[latest].dependencies,
    description: x.versions[latest].description,
    license: x.versions[latest].license,
    main: x.versions[latest].main,
    name: x.versions[latest].name,
    version: x.versions[latest].version
  };
  if (x.versions[latest].theme)
    x.metadata.theme = x.versions[latest].theme;
  if (x.versions[latest].engines)
    x.metadata.engines = x.versions[latest].engines;

  const regex = /^git+(.*)\.git$/;
  if (x.versions[latest].repository && x.versions[latest].repository.url && regex.test(x.versions[latest].repository.url))
    x.metadata.repository = x.versions[latest].repository.url.match(regex)[1];

  return Promise.resolve(x);
}
