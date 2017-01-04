import semver from 'semver';
import _ from 'lodash';
import Repository from './repository';

const repo = process.env.NPM_REPOSITORY;

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
  static find () {
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
    return Repository.get.length
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

function parsePackage(x) {
  x["releases"] = x["dist-tags"];
  delete x["dist-tags"];
  x["downloads"] = 0;
  x["stargazers_count"] = 0;
  return Promise.resolve(x);
}
