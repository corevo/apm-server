import semver from 'semver';
import _ from 'lodash';

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
    return [];
  }
  static findOne () {
    return {};
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

export function getPackages() {
  return Promise.resolve([new Package(require('../../__test__/models/single_package'))]);
}

function parsePackage(x) {
  x["releases"] = x["dist-tags"];
  delete x["dist-tags"];
  x["downloads"] = 0;
  x["stargazers_count"] = 0;
  return Promise.resolve(x);
}
